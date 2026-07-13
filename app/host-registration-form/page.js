"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./HostRegistration.module.css";
import { useRouter } from "next/navigation";

export default function HostRegistrationForm() {
  const router = useRouter();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  // Load existing data from localStorage upon component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullName(localStorage.getItem("hreg_full_name") || "");
      setEmail(localStorage.getItem("hreg_email") || "");
      setAddress(localStorage.getItem("hreg_address") || "");
    }
  }, []);

  const handleNext = () => {
    if (!fullName.trim() || !email.trim() || !address.trim()) {
      setError("Please fill out all fields before proceeding.");
      return;
    }

    // Save inputs to localStorage to persist across OAuth redirects
    localStorage.setItem("hreg_full_name", fullName.trim());
    localStorage.setItem("hreg_email", email.trim());
    localStorage.setItem("hreg_address", address.trim());

    setError("");
    router.push("/host-registration-form/verify-profile");
  };

  return (
    <div className={styles.hregpage}>
      <section className={styles.hregSection}>
        <div className={styles.hregContainer}>
          {/* LEFT IMAGE */}
          <div className={styles.hregLeftCard}>
            <Image
              src="/Best-car-hosting-registration1.webp"
              alt="Registration"
              fill
              priority
              className={styles.hregPreviewImage}
            />
          </div>

          {/* RIGHT CARD */}
          <div className={styles.hregRightCard}>
            <div className={styles.hregHeader}>
              <div className={styles.hregIconBox}>
                <Image
                  src="/profile-icon.svg"
                  alt="Profile"
                  width={28}
                  height={28}
                />
              </div>
              <div>
                <h2>Your Profile</h2>
                <p>Tell us about yourself</p>
              </div>
            </div>

            <div className={styles.hregField}>
              <label>Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className={styles.hregField}>
              <label>Email ID</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <div className={styles.hregField}>
              <label>Address</label>
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter physical address"
              />
            </div>

            {error && (
              <p style={{ color: "#d9534f", fontSize: "13px", fontWeight: "600", marginTop: "10px" }}>
                {error}
              </p>
            )}

            <button
              className={styles.hregVerifyBtn}
              onClick={handleNext}
            >
              VERIFY ITS YOU
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}