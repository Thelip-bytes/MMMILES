"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState, Suspense } from "react";
import styles from "./ComingSoon.module.css";

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const cityParam = searchParams.get("city");
  // Capitalize first letter if it's generic text, otherwise use as is
  const city = cityParam || "Your City";

  const [comingsoonOpen, setComingsoonOpen] = useState(false);
  const [comingsoonSuccess, setComingsoonSuccess] = useState(false);
  const [comingsoonError, setComingsoonError] = useState("");
  const [comingsoonLoading, setComingsoonLoading] = useState(false);

  const [comingsoonForm, setComingsoonForm] = useState({
    name: "",
    phone: "",
    city: cityParam || "",
  });

  const comingsoonValidatePhone = (phone) =>
    /^[6-9]\d{9}$/.test(phone);

  const comingsoonSubmitForm = async () => {
    setComingsoonError("");

    if (
      !comingsoonForm.name ||
      !comingsoonForm.phone ||
      !comingsoonForm.city
    ) {
      setComingsoonError("All fields are required");
      return;
    }

    if (!comingsoonValidatePhone(comingsoonForm.phone)) {
      setComingsoonError("Enter a valid 10-digit mobile number");
      return;
    }

    setComingsoonLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comingsoonForm),
      });

      const data = await res.json();
      setComingsoonLoading(false);

      if (!res.ok) {
        setComingsoonError(data.error || "Something went wrong");
        return;
      }

      setComingsoonSuccess(true);
      setComingsoonForm({ name: "", phone: "", city: "" });

      setTimeout(() => {
        setComingsoonOpen(false);
        setComingsoonSuccess(false);
      }, 2200);
    } catch (err) {
      setComingsoonLoading(false);
      setComingsoonError("Network error. Try again.");
    }
  };

  return (
    <>
      {/* ================= HERO (UNCHANGED DESIGN) ================= */}
      <section className={styles.ComingSoonhero}>
        <p className={styles.ComingSooncoming}>Coming Soon</p>
        <h1 className={styles.ComingSooncity}>{city}</h1>

        <div className={styles["ComingSooncar-lock"]}>
          <Image
            src="/carcarcar.png"
            alt="Car"
            fill
            priority
            className={styles["ComingSooncar-img"]}
          />
          <span className={styles.ComingSoonheadlight}></span>
        </div>

        <div className={styles.ComingSoonright}>
          <h2>
            Experience the future of car rentals and
            <br />
            Your next ride is closer than you think.
          </h2>
          <br />
          <p className={styles.ComingSoonsub}>
            Join the waitlist & be the first to know
          </p>

          <button
            className={styles.ComingSooncta}
            onClick={() => setComingsoonOpen(true)}
          >
            GET EARLY ACCESS
          </button>
        </div>
      </section>

      {/* ================= POPUP ================= */}
      {comingsoonOpen && (
        <div className={styles.comingsoonOverlay}>
          <div className={styles.comingsoonModal}>
            {!comingsoonSuccess ? (
              <>
                <h3 className={styles.comingsoonTitle}>
                  Join the Waitlist
                </h3>

                <input
                  className={styles.comingsoonInput}
                  placeholder="Your Name"
                  value={comingsoonForm.name}
                  onChange={(e) =>
                    setComingsoonForm({
                      ...comingsoonForm,
                      name: e.target.value,
                    })
                  }
                />

                <input
                  className={styles.comingsoonInput}
                  placeholder="Mobile Number"
                  value={comingsoonForm.phone}
                  onChange={(e) =>
                    setComingsoonForm({
                      ...comingsoonForm,
                      phone: e.target.value,
                    })
                  }
                />

                <input
                  className={styles.comingsoonInput}
                  placeholder="City"
                  value={comingsoonForm.city}
                  onChange={(e) =>
                    setComingsoonForm({
                      ...comingsoonForm,
                      city: e.target.value,
                    })
                  }
                />

                {comingsoonError && (
                  <p className={styles.comingsoonError}>
                    {comingsoonError}
                  </p>
                )}

                <button
                  className={styles.comingsoonSubmit}
                  onClick={comingsoonSubmitForm}
                  disabled={comingsoonLoading}
                >
                  {comingsoonLoading ? (
  <div className={styles.comingsoonSpinner}></div>
) : (
  "Join Now"
)}

                </button>

                <span
                  className={styles.comingsoonClose}
                  onClick={() => setComingsoonOpen(false)}
                >
                  ✕
                </span>
              </>
            ) : (
              <div className={styles.comingsoonSuccess}>
                <div className={styles.comingsoonCheck}>✓</div>
                <p>You’re on the waitlist!</p>
              </div>
            )}
            <span
              className={styles.comingsoonClose}
              onClick={() => setComingsoonOpen(false)}
            >
              ✕
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default function ComingSoonHero() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComingSoonContent />
    </Suspense>
  );
}
