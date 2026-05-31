"use client";

import Image from "next/image";
import styles from "./HostRegistration.module.css";
import { useRouter } from "next/navigation";



export default function HostRegistrationForm() {
    const router = useRouter(); // ✅ INSIDE COMPONENT
  return (
    <div className={styles.hregpage}>
    <section className={styles.hregSection}>
      <div className={styles.hregContainer}>

        {/* LEFT IMAGE */}

        <div className={styles.hregLeftCard}>
          <Image
            src="/registration-left-image.png"
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
            <input type="text" />
          </div>

          <div className={styles.hregField}>
            <label>Email ID</label>
            <input type="email" />
          </div>

          <div className={styles.hregField}>
            <label>Address</label>
            <input type="text" />
          </div>

          <button
            className={styles.hregVerifyBtn}
            onClick={() =>
                router.push("/host-registration-form/verify-profile")
            }
            >
            VERIFY ITS YOU
          </button>

        </div>

      </div>
    </section>
    </div>
  );
}