"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { makeAuthenticatedRequest } from "../../lib/customSupabaseClient";
import { testAuth } from "../../lib/authTest";
import styles from "./Checkout.module.css";

/**
 * Robust parser for the common date formats we expect from the URL
 * Supports:
 *  - "17/11/2025 09:00"  (dd/mm/yyyy hh:mm)
 *  - "17-11-2025 09:00"
 *  - "2025-11-17 09:00"  (yyyy-mm-dd)
 *  - ISO strings
 *  - epoch milliseconds
 */
function parseDateInput(raw) {
  if (!raw) return null;
  try {
    let s = decodeURIComponent(String(raw)).trim();

    // If it's a pure number (epoch ms or seconds)
    if (/^\d+$/.test(s)) {
      const asNum = Number(s);
      // if seconds, convert to ms (10-digit), if ms keep
      return asNum < 1e12 ? new Date(asNum * 1000) : new Date(asNum);
    }

    // First try native parse (ISO and other recognized formats)
    const native = new Date(s);
    if (!isNaN(native.getTime())) return native;

    // dd/mm/yyyy hh:mm or dd-mm-yyyy hh:mm
    const dmy = s.match(
      /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:[T\s]+(\d{1,2}):(\d{2}))?$/
    );
    if (dmy) {
      const day = Number(dmy[1]);
      const month = Number(dmy[2]) - 1;
      const year = Number(dmy[3]);
      const hour = Number(dmy[4] || 0);
      const minute = Number(dmy[5] || 0);
      return new Date(year, month, day, hour, minute);
    }

    // yyyy/mm/dd or yyyy-mm-dd hh:mm
    const ymd = s.match(
      /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})(?:[T\s]+(\d{1,2}):(\d{2}))?$/
    );
    if (ymd) {
      const year = Number(ymd[1]);
      const month = Number(ymd[2]) - 1;
      const day = Number(ymd[3]);
      const hour = Number(ymd[4] || 0);
      const minute = Number(ymd[5] || 0);
      return new Date(year, month, day, hour, minute);
    }

    // Last resort: try replacing dots with hyphens and parse
    const tryAlt = new Date(s.replace(/\./g, "-"));
    if (!isNaN(tryAlt.getTime())) return tryAlt;
  } catch (err) {
    console.warn("parseDateInput error", err);
  }
  return null;
}

/** Clean numeric string like "₹500" or "500.00 " -> 500 */
function toNumberClean(v) {
  if (v === undefined || v === null) return 0;
  const s = String(v).trim();
  // Remove any non-digit except dot and minus
  const cleaned = s.replace(/[^\d.\-]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const carId = searchParams.get("car");
  const pickup = searchParams.get("pickup"); // e.g. "17/11/2025 09:00"
  const returnTime = searchParams.get("return"); // e.g. "19/11/2025 17:00"
  const plan = searchParams.get("plan") || "BASIC";

  const [car, setCar] = useState(null);
  const [host, setHost] = useState(null);
  const [customer, setCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [priceSummary, setPriceSummary] = useState({
    basePrice: 0,
    gst: 0,
    convFee: 100,
    total: 0,
    hours: 0,
    error: null,
  });

  const [loggedInUser, setLoggedInUser] = useState(null);

  // Load Razorpay script
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) return;
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // 🔥 FIXED LOGIN CHECK + Supabase Session Injection
  useEffect(() => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("auth_token")
      : null;

    if (!token) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`
      );
      return;
    }

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .padEnd(base64Url.length + (4 - base64Url.length % 4) % 4, "=");
      const payload = JSON.parse(atob(base64));
      setLoggedInUser(payload);

      setTimeout(() => {
        testAuth().then((success) => {
          if (success) {
            console.log("✅ Authentication test passed!");
          } else {
            console.log("❌ Authentication test failed - check console for details");
          }
        });
      }, 1000);
    } catch (err) {
      console.error("JWT parsing error:", err);
      router.push("/login?redirect=/checkout");
    }
  }, [router]);

  // Fetch car
  useEffect(() => {
    async function fetchCar() {
      try {
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/vehicles?id=eq.${carId}&select=*,hosts(*),vehicle_images(*)`;
        const response = await fetch(url, {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.length > 0) {
          const carData = data[0];
          setCar(carData);
          setHost(carData.hosts);
        } else {
          setCar(null);
        }
      } catch (err) {
        console.error("Error fetching car:", err);
        setCar(null);
      } finally {
        setLoading(false);
      }
    }
    if (carId) fetchCar();
    else setLoading(false);
  }, [carId]);

  // Fetch customer details
  useEffect(() => {
    async function fetchCustomer() {
      if (!loggedInUser?.sub) return;
      try {
        const data = await makeAuthenticatedRequest(
          "GET",
          `customers?user_id=eq.${loggedInUser.sub}&select=*`
        );

        if (data && data.length > 0) {
          const customerData = data[0];
          setCustomer({
            first_name: customerData.first_name || "",
            last_name: customerData.last_name || "",
            email: customerData.email || "",
            address: customerData.address || "",
            phone: customerData.phone || loggedInUser.phone_number || "",
          });
        }
      } catch (err) {
        console.log("No customer record yet.", err);
      }
    }
    fetchCustomer();
  }, [loggedInUser]);

  // Calculate total price (robust)
  useEffect(() => {
    // Safe defaults
    if (!car) return setPriceSummary((s) => ({ ...s, error: "Car data not loaded yet" }));

    const start = parseDateInput(pickup);
    const end = parseDateInput(returnTime);

    if (!start || !end) {
      // Provide helpful error & zeroed numbers (avoid NaN)
      setPriceSummary({
        basePrice: 0,
        gst: 0,
        convFee: 100,
        total: 0,
        hours: 0,
        error: "Invalid pickup/return datetime format. Use dd/mm/yyyy hh:mm or ISO.",
      });
      console.warn("Invalid date(s): pickup=", pickup, " return=", returnTime);
      return;
    }

    // Convert DB rates to numbers safely
    let hourlyRateRaw =
      plan === "MAX"
        ? car.price_max
        : plan === "PLUS"
        ? car.price_plus
        : car.price_basic;

    const hourlyRate = toNumberClean(hourlyRateRaw);

    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) {
      setPriceSummary({
        basePrice: 0,
        gst: 0,
        convFee: 100,
        total: 0,
        hours: 0,
        error: "Return must be after pickup",
      });
      return;
    }

    const hours = Math.ceil(diffMs / (1000 * 60 * 60)); // round up to next hour

    const basePrice = +(hours * hourlyRate).toFixed(2);
    const gst = +(basePrice * 0.18).toFixed(2);
    const convFee = 100;
    const total = +(basePrice + gst + convFee).toFixed(2);

    setPriceSummary({
      basePrice,
      gst,
      convFee,
      total,
      hours,
      error: null,
    });
  }, [plan, car, pickup, returnTime]);

  // Insert or update customer info
  async function handleSave() {
    if (!loggedInUser?.sub) {
      console.error("No logged in user");
      return;
    }

    try {
      const existingData = await makeAuthenticatedRequest(
        "GET",
        `customers?user_id=eq.${loggedInUser.sub}&select=id`
      );

      if (existingData && existingData.length > 0) {
        await makeAuthenticatedRequest(
          "PATCH",
          `customers?user_id=eq.${loggedInUser.sub}`,
          {
            headers: {
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              first_name: customer.first_name,
              last_name: customer.last_name,
              email: customer.email,
              address: customer.address,
            }),
          }
        );
      } else {
        await makeAuthenticatedRequest(
          "POST",
          "customers",
          {
            headers: {
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify({
              user_id: loggedInUser.sub,
              first_name: customer.first_name,
              last_name: customer.last_name,
              email: customer.email,
              phone: customer.phone || loggedInUser.phone_number,
              address: customer.address,
            }),
          }
        );
      }

      setEditing(false);
    } catch (err) {
      console.error("❌ Error saving customer:", err);
      alert("Failed to save customer data. Please try again.");
    }
  }

  // Handle payment
  const handlePayment = () => {
    if (!priceSummary.total || priceSummary.total <= 0) {
      alert("Invalid payment amount. Check trip details.");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(priceSummary.total * 100), // in paise
      currency: "INR",
      name: "MMmiles Rentals",
      description: `${car.make} ${car.model} booking`,
      image: "/logo.png",
      handler: (response) => {
        alert("Payment Successful: " + response.razorpay_payment_id);
        router.push("/booking-success");
      },
      prefill: {
        name: `${customer.first_name} ${customer.last_name}`,
        email: customer.email,
        contact: customer.phone,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (!car) return <p className={styles.error}>Car Not Found</p>;

  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.leftColumn}>
        {/* Car Info */}
        <div className={styles.carCard}>
          <Image
            src={car.vehicle_images?.[0]?.image_url || "/cars/default.jpg"}
            width={400}
            height={250}
            alt="Car"
            className={styles.carImage}
          />
          <div className={styles.carDetails}>
            <h2>
              {car.make} {car.model} ({car.model_year})
            </h2>
            <p>
              Hosted by <strong>{host?.full_name}</strong>
            </p>
            <p>📍 {car.location_name}, {car.city}</p>
          </div>
        </div>

        {/* Customer Details Form */}
        <div className={styles.formSection}>
          <h3>Your Details</h3>

          {["first_name", "last_name", "email"].map((field) => (
            <div className={styles.formGroup} key={field}>
              <label>{field.replace("_", " ").toUpperCase()}</label>
              <input
                type="text"
                value={customer[field] || ""}
                onChange={(e) => {
                  setCustomer({ ...customer, [field]: e.target.value });
                  setEditing(true);
                }}
              />
            </div>
          ))}

          <div className={styles.formGroup}>
            <label>Home Address</label>
            <textarea
              rows="3"
              value={customer.address}
              onChange={(e) => {
                setCustomer({ ...customer, address: e.target.value });
                setEditing(true);
              }}
            />
          </div>

          <button
            className={styles.saveBtn}
            disabled={!editing}
            onClick={handleSave}
          >
            {editing ? "Save Changes" : "Saved ✓"}
          </button>
        </div>
      </div>

      {/* Price Section */}
      <div className={styles.priceSection}>
        <h3>Trip Summary</h3>
        <p><strong>Selected Plan:</strong> {plan}</p>
        <p><strong>Pickup:</strong> {pickup}</p>
        <p><strong>Return:</strong> {returnTime}</p>

        {priceSummary.error && (
          <p style={{ color: "crimson" }}>{priceSummary.error}</p>
        )}

        <p><strong>Duration:</strong> {priceSummary.hours} hours</p>
        <div className={styles.priceBreakdown}>
          <p>Base Price: ₹{priceSummary.basePrice}</p>
          <p>Convenience Fee: ₹{priceSummary.convFee}</p>
          <p>GST (18%): ₹{priceSummary.gst}</p>
          <hr />
          <h4>Total: ₹{priceSummary.total}</h4>
        </div>

        <button className={styles.payBtn} onClick={handlePayment}>
          Pay Now
        </button>
      </div>
    </div>
  );
}
