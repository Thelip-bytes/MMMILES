"use client";

import Image from "next/image";
import styles from "../HostRegistration.module.css";
import { useRouter } from "next/navigation";

export default function VerifyProfile() {
    const router = useRouter();

  return (

    <div className={styles.hregpage}>

      <section className={styles.hregSection}>

        <div className={styles.hregContainer}>

          {/* SAME LEFT IMAGE */}

          <div className={styles.hregLeftCard}>

            <Image
              src="/Best-car-hosting-registration2.webp"
              alt="Registration"
              fill
              priority
              className={styles.hregPreviewImage}
            />

          </div>

          {/* NEW RIGHT CARD */}

          <div className={styles.hregRightCard}>

            <div className={styles.hregHeader}>

              <div className={styles.hregIconBox}>

                <Image
                  src="/verify-profile-icon.svg"
                  alt="Verify"
                  width={28}
                  height={28}
                />

              </div>

              <div>

                <h2>Verify Profile</h2>

                <p>Require Govt Identity</p>

              </div>

            </div>

            <div className={styles.hregField}>

              <label>Enter Aadhar Number</label>

              <input type="text" />

            </div>

            <div className={styles.hregDigiLockerBox}>

              <div className={styles.hregDigiLockerLeft}>

                <Image
                  src="/digilocker.webp"
                  alt="Digilocker"
                  width={90}
                  height={102}
                />

              </div>

              <div className={styles.hregDigiLockerRight}>

                <p>1. Login With Otp</p>

                <p>2. Verify and Start</p>

                <button>
                  Verify
                </button>

              </div>

            </div>

            <p className={styles.hregKycText}>
              Congratulations! Your KYC verification is complete.
            </p>


            <button
                className={styles.hregVerifyBtn}
                onClick={() =>
                    router.push("/host-registration-form/confirmation")
                }
                >
                PROCEED
            </button>



            {/*  WE USER FAILED IN UI IT SHOULD COME WITH THESE TWO BUTTONS*/}


            {/*<div className={styles.hregFailedButtons}>

                <button
                    onClick={() => setVerificationStatus("pending")}
                >
                    TRY AGAIN
                </button>

                <button
                    onClick={() => router.push("/contact-us")}
                >
                    CONTACT US
                </button>

            </div>*/}


          </div>

        </div>

      </section>

    </div>

  );

}