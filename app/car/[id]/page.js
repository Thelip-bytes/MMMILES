"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { estimatePrice } from "../../../lib/pricing";
import { supabase } from "../../../lib/supabaseClient";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import styles from "./carDetail.module.css";
import Counter from "../../components/Counter";
import CarCard from "../../components/CarCard";

// Supabase storage base URL for car images
const STORAGE_BASE_URL = "https://tktfsjtlfjxbqfvbcoqr.supabase.co/storage/v1/object/public/car-images/";

// Helper to get full image URL
const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return "/cars/default.jpg";
  return imageUrl.startsWith("http") ? imageUrl : `${STORAGE_BASE_URL}${imageUrl}`;
};

export default function CarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Enforce Chennai-only logic
  useEffect(() => {
    const city = searchParams.get("city");
    if (city && city !== "Chennai") {
      router.push(`/comingsoon?city=${encodeURIComponent(city)}`);
    }
  }, [searchParams, router]);

  const { id } = useParams();
  const pickup = searchParams.get("pickup") || searchParams.get("pickupTime");
  const returnTime = searchParams.get("return") || searchParams.get("returnTime");

  useEffect(() => {
    if (pickup && returnTime) {
        // Helper to parse "DD/MM/YYYY HH:MM"
        const parseDateTime = (str) => {
            if (!str) return null;
            const parts = str.split(' ');
            if (parts.length < 2) return null;
            const [dateStr, timeStr] = parts;
            const [day, month, year] = dateStr.split('/');
            const [hour, _] = timeStr.split(':');
            return new Date(year, month - 1, day, hour, 0);
        };

        const startDate = parseDateTime(pickup);
        const endDate = parseDateTime(returnTime);

        if (startDate && endDate) {
            const now = new Date();
             // Allow a small buffer (e.g., 5 mins) for "past" checks
            const pastBuffer = 5 * 60 * 1000; 

            if (startDate < new Date(now.getTime() - pastBuffer)) {
                toast.error("Pickup time cannot be in the past.");
                setTimeout(() => router.push('/'), 2000);
                return;
            }

            const durationMs = endDate - startDate;
            const minDurationMs = 6 * 60 * 60 * 1000; // 6 hours

            if (durationMs < minDurationMs) {
                toast.error("Minimum booking duration is 6 hours.");
                setTimeout(() => router.push('/'), 2000);
                return;
            }
        }
    }
  }, [pickup, returnTime, router]);

  const [car, setCar] = useState(null);
  const [host, setHost] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMainMedia, setCurrentMainMedia] = useState(null);
  
  useEffect(() => {
    async function fetchCar() {
      try {
        const { data: vehicle, error } = await supabase
          .from("vehicles")
          .select("*, hosts(*), vehicle_images(*)")
          .eq("id", id)
          .single();
        if (error) throw error;

        // safely parse features/faqs
        const parsedVehicle = {
          ...vehicle,
          features:
            typeof vehicle.features === "string"
              ? JSON.parse(vehicle.features)
              : vehicle.features || [],
          faqs:
            typeof vehicle.faqs === "string"
              ? JSON.parse(vehicle.faqs)
              : vehicle.faqs || [],
        };

        setCar(parsedVehicle);
        setHost(vehicle.hosts || null);
        const rawImages = vehicle.vehicle_images || [];
        // Filter out primary images (they are for search results only)
        const productImages = rawImages.filter(img => !img.is_primary);
        setImages(productImages);
        setCurrentMainMedia(
          productImages.length
            ? { src: getFullImageUrl(productImages[0].image_url), type: "image" }
            : { src: "/cars/default.jpg", type: "image" }
        );
      } catch (e) {
        console.error("Error fetching car:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchCar();
  }, [id]);

  // Scroll to top when car ID changes (when user selects a new car from explore section)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const carDetails = {
    insurancePlans: [
      { name: "MAX", price: 629, description: "Only pay Rs.2000 in case of any accidental damage." },
      
    ]
  }

  const handleBookNow = () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      const redirectUrl = encodeURIComponent(`/car/${id}?pickup=${pickup}&return=${returnTime}`);
      router.push(`/login?redirect=${redirectUrl}`);
      return;
    }
    router.push(`/checkout?car=${id}&pickup=${pickup}&return=${returnTime}`);
  };

  if (loading) return <Loading fullScreen={true} />;
  if (!car) return (
    <EmptyState 
      icon="🚗"
      title="Car Not Found"
      message="This vehicle is no longer available or the link is invalid."
      actionLabel="Browse All Cars"
      onAction={() => router.push('/search')}
    />
  );

  // Insurance is now calculated automatically based on booking duration tier
  // No user selection needed - insurance is included in the total price
  const baseDailyRate = car.base_daily_rate || 0;
  let displayHourlyRate = Math.round(baseDailyRate / 24);
  // Default insurance for 1 day (Tier 1 divisor is ~9.4, but let's use a safe estimate or base it on 24h)
  // Check pricing.js: TIER_1 (6-12h) divisor 9.4. TIER_2 (12-24h) same. 
  // Let's use standard assumption for "Starting At" logic or just base rate / 9.4 rounded.
  let displayInsurance = Math.round(baseDailyRate / 9.4);

  if (pickup && returnTime) {
      // Parse dates for pricing estimate
       const parseDateTime = (str) => {
            if (!str) return null;
            const parts = str.split(' ');
            if (parts.length < 2) return null;
            const [dateStr, timeStr] = parts;
            const [day, month, year] = dateStr.split('/');
            const [hour, _] = timeStr.split(':');
            return new Date(year, month - 1, day, hour, 0);
        };
      
      const start = parseDateTime(pickup);
      const end = parseDateTime(returnTime);
      
      if (start && end && end > start) {
           const diffMs = end - start;
           const hours = Math.ceil(diffMs / 3600000);
           if (hours > 0) {
               const estimated = estimatePrice(baseDailyRate, hours);
               displayHourlyRate = estimated.hourlyRate;
               displayInsurance = estimated.insuranceCost;
           }
      }
  }

  const baseHourlyRate = Math.round(baseDailyRate / 24); // Keep for stats if needed, or use displayHourlyRate

  // Stats Section (derived from car data)
  const statsData = [
    { number: car.model_year || "N/A", label: "Model Year" },
    { number: baseHourlyRate || "N/A", label: "Base Rate (₹/hr)" },
    { number: car.mileage_kmpl || "N/A", label: "KM/L Mileage" },
    { number: car.seating_capacity || "N/A", label: "Seats" },
    
  ];
  

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* --- Left Column --- */}
        <div className={styles.leftColumn}>
          <div className={styles.mainImage}>
            <Image
              src={currentMainMedia?.src || "/cars/default.jpg"}
              alt="Main Car"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>

          <div className={styles.thumbnails}>
            {images.map((img, i) => {
              const fullUrl = getFullImageUrl(img.image_url);
              return (
                <div
                  key={i}
                  className={`${styles.thumbnail} ${
                    currentMainMedia?.src === fullUrl ? styles.activeThumbnail : ""
                  }`}
                  onClick={() => setCurrentMainMedia({ src: fullUrl, type: "image" })}
                >
                  <Image src={fullUrl} alt="thumb" fill style={{ objectFit: "cover" }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* --- Right Column --- */}
        <div className={styles.rightColumn}>
          <h1 className={styles.carName}>
            {car.make} {car.model} {/*({car.model_year})*/}
          </h1>
          <p className={styles.priceTag}>
            <span className={styles.startingAt}>Starting At</span>
            <br />
            <span className={styles.priceValue}>₹{displayHourlyRate}</span>
            <span className={styles.priceUnit}>/hour</span>
          </p>

          <p className={styles.description}>{car.description || "TODO: Add car description."}</p>
          
          
          {/* --- Single Insurance Banner --- */}
<div className={styles.singleinsurance}>
  <div className={styles.singleinsuranceLeft}>
    <p className={styles.singleinsuranceTitle}>
      100% Coverage from MMmiles
    </p>

    <p className={styles.singleinsurancePrice}>
      At just ₹{displayInsurance}
    </p>

    <div className={styles.singleinsuranceDivider}></div>

    <p className={styles.singleinsuranceDesc}>
      Enjoy the ride. We’ll handle the safety. Drive with complete peace of mind
      on every ride with us.
    </p>
  </div>

  <div className={styles.singleinsuranceRight}>
    <img
      src="/shield-check.png"
      alt="Insurance Shield"
      className={styles.singleinsuranceShield}
    />
  </div>

  <span className={styles.singleinsuranceTc}>T&C*</span>
</div>

{/* --- Range Limit Banner (Conditional) --- */}
{car.range_km_limit && car.range_km_limit.range_km_limit && (
    <div className={styles.singleinsurance}>
      <div className={styles.singleinsuranceLeft}>
        <p className={styles.singleinsuranceTitle}>
          Kilometer Limit
        </p>

        <p className={styles.singleinsurancePrice}>
         {car.range_km_limit.range_km_limit} km included
        </p>

        <div className={styles.singleinsuranceDivider}></div>

        <p className={styles.singleinsuranceDesc}>
          Extra km charge: ₹{car.range_km_limit.price_per_extra_km || 0}/km
        </p>
      </div>

      <div className={styles.singleinsuranceRight}>
        <div style={{
            fontSize: '3rem', 
            color: '#bf9860',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '100px'
        }}>
             🛣️
        </div>
      </div>
    </div>
)}




          <div className={styles.actionButtons}>
            <BookNowButton
              carId={id}
              pickup={pickup}
              returnTime={returnTime}
            />
          </div>
        </div>
      </div>






      {/* --- Stats Section --- */}
      <div className={styles.statsSection}>
        <div className={styles.statsContainer}>
          {statsData.map((stat, i) => (
            <Counter key={i} value={stat.number} label={stat.label} styles={styles} />
          ))}
        </div>
      </div>





      {/* --- Car Location --- */}
<div className={styles.locationSection}>
  <div className={styles.worldMapContainer}>

    {/* Desktop Image */}
    <Image
      src="/chennai-map.png"
      alt="Map"
      fill
      className={`${styles.worldMapImage} ${styles.desktopMap}`}
      priority
    />

    {/* Mobile Image */}
    <Image
      src="/chennai-map-mobile.png"
      alt="Map Mobile"
      fill
      className={`${styles.worldMapImage} ${styles.mobileMap}`}
    />

    <div className={styles.locationTextContent}>
      <h2>
        {/* Location Hidden */}
      </h2>
      <p>
        Hosted by <strong>{host?.full_name || "TODO: Host Name"}</strong>
      </p>
    </div>

  </div>
</div>





      {/* --- Features --- */}
      <div className={styles.blurCardsSection}>
        <div className={styles.blurHeader}>
          <h3>Key Features of {car.make} {car.model}</h3>
        </div>
        <div className={styles.blurCardsContainer}>
          {(car.features || []).map((f, idx) => (
            <div key={idx} className={`${styles.blurCard} ${styles.blue}`}>
              <h3 className={styles.cardTitle}>{f.feature}</h3>
              <p className={styles.cardSubtext}>{f.value}</p>
            </div>
          ))}
        </div>
      </div>



      {/* --- FAQs --- */}
      <div className={styles.faqSection}>
        <div className={styles.faqHeader}>
          <h3>Looking for help? Here are our most frequently asked questions</h3>
        </div>
        <div className={styles.faqGrid}>
          {(car.faqs || []).map((q) => (
            <div key={q.id} className={styles.faqCard}>
              <div className={styles.faqNumber}>{q.id}</div>
              <h4 className={styles.faqQuestion}>{q.question}</h4>
              <p className={styles.faqAnswer}>{q.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Explore More Cars Section --- */}
      <div className={styles.exploreSection}>
        <h2 className={styles.exploreTitle}>Explore more Cars in {car.city}</h2>
        <ExploreMoreCars 
          currentCarId={id} 
          city={car.city} 
          pickup={pickup} 
          returnTime={returnTime}
        />
      </div>
    </div>
  );
}

// Component for exploring more cars from the same city
function ExploreMoreCars({ currentCarId, city, pickup, returnTime }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilarCars() {
      try {
        const { data, error } = await supabase
          .from("vehicles")
          .select("*, vehicle_images(*)")
          .eq("city", city)
          .eq("available_status", true)
          .neq("id", currentCarId)
          .limit(3);

        if (error) throw error;
        setVehicles(data || []);
      } catch (e) {
        console.error("Error fetching similar cars:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchSimilarCars();
  }, [currentCarId, city]);

  if (loading) {
    return <div className={styles.exploreLoading}>Loading more cars...</div>;
  }

  if (vehicles.length === 0) {
    return null;
  }

  return (
    <div className={styles.exploreCardsGrid}>
      {vehicles.map((vehicle) => (
        <CarCard 
          key={vehicle.id} 
          car={vehicle} 
          pickup={pickup} 
          returndate={returnTime} 
          city={city} 
        />
      ))}
    </div>
  );
}

function BookNowButton({ carId, pickup, returnTime }) {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return setLoggedIn(false);
      try {
        const payload = JSON.parse(
          atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        const now = Math.floor(Date.now() / 1000);
        setLoggedIn(payload?.exp && payload.exp > now);
      } catch {
        setLoggedIn(false);
      }
    };

    checkAuth();
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, []);

  const handleClick = () => {
    if (!loggedIn) {
      const redirectUrl = encodeURIComponent(`/car/${carId}?pickup=${pickup}&return=${returnTime}`);
      router.push(`/login?redirect=${redirectUrl}`);
      return;
    }

    router.push(`/checkout?car=${carId}&pickup=${pickup}&return=${returnTime}`);
  };

  return (
    <button className={styles.bookBtn} onClick={handleClick}>
      {loggedIn ? "Book Now" : "Login to Continue"}
    </button>
  );
}
