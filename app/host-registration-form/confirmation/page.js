"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "../HostRegistration.module.css";

export default function ConfirmationPage() {

  const router = useRouter();

  return (

    <div className={styles.hregpage}>

      <section className={styles.hregSection}>

        <div className={styles.hregContainer}>

          {/* LEFT IMAGE */}

          <div className={styles.hregLeftCard}>

            <Image
              src="/Best-car-hosting-registration3.webp"
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
                  src="/verify-profile-icon.svg"
                  alt="Confirmation"
                  width={28}
                  height={28}
                />

              </div>

              <div>

                <h2>Confirmation</h2>

                <p>Check your Details</p>

              </div>

            </div>

            <div className={styles.hregField}>
              <label>Your Aadhar Number</label>
              <input type="text" />
            </div>

            <div className={styles.hregField}>
              <label>Your Pan</label>
              <input type="text" />
            </div>

            <div className={styles.hregField}>
              <label>Your DL no</label>
              <input type="text" />
            </div>

            <div className={styles.hregTermsRow}>

              <input
                type="checkbox"
                id="terms"
              />

              <label htmlFor="terms">
                By creating an account, you agree to our Policy.
              </label>

            </div>

           <button
                className={styles.hregVerifyBtn}
                onClick={() =>
                    router.push("/host-registration-form/success")
                }
                >
                Verify & Submit
            </button>

          </div>

        </div>

      </section>

    </div>

  );

}