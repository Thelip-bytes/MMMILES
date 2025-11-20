"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./payment.module.css";

export default function Page() {
  const [agree, setAgree] = useState(false);

  // static values (replace with props/state as needed)
  const rental = 1920;
  const insurance = 70;
  const convenience = 100;
  const gst = +(0.18 * (rental + insurance + convenience)).toFixed(2);
  const total = +(rental + insurance + convenience + gst).toFixed(2);

  return (
    <div className={styles.pageWrap}>
      {/* Stepper */}
      <div className={styles.stepper}>
        <div className={styles.stepItem}>
          <div className={'${styles.stepCircle} ${styles.stepDone}'}>✔</div>
          <div className={styles.stepLabel}>Passenger Details</div>
        </div>

        <div className={styles.stepLine} />

        <div className={styles.stepItem}>
          <div className={'${styles.stepCircle} ${styles.stepActive}'}>2</div>
          <div className={styles.stepLabel}>Review Journey</div>
        </div>

        <div className={styles.stepLine} />

        <div className={styles.stepItem}>
          <div className={styles.stepCircle}>3</div>
          <div className={styles.stepLabel}>Payment</div>
        </div>
      </div>

      {/* Main grid */}
      <div className={styles.mainGrid}>
        {/* LEFT */}
        <div className={styles.leftCol}>
          <div className={styles.carCard}>
            <div className={styles.carImageStage}>
              {/* Use your image path; next/image preferred */}
              <Image
                src="/B1.jpg"
                alt="White Jaguar XF"
                width={520}
                height={300}
                className={styles.carImage}
                priority
              />
              <div className={styles.groundSpot} />
            </div>

            <div className={styles.carMeta}>
              <h1 className={styles.title}>White Jaguar XF 2 Car</h1>
              <div className={styles.subtitle}>Sedan</div>

              <div className={styles.features}>
                <span>📍 Parking</span>
                <span>👥 4 Seat</span>
                <span>❄ AC</span>
              </div>

              <div className={styles.priceRow}>
                <div className={styles.discount}>25% OFF</div>
                <div className={styles.price}>$473</div>
              </div>
            </div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoCard}>
              <h3>Inclusion / Exclusions</h3>
              <ul className={styles.infoList}>
                <li>❌ Fuel not included. Guest should return the car with the same fuel level as at start.</li>
                <li>❌ Toll/Fastag charges not included. Check with host for Fastag recharge.</li>
                <li>❌ Trip Protection excludes: Off-road use, driving under influence, over-speeding, illegal use, restricted zones.</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h3>Cancellation</h3>
              <p className={styles.small}>50% of trip amount or INR 4000 (whichever is lower)</p>
              <p className={styles.smallMuted}>Until 19 Nov 2025, 07:00 PM · Convenience fee is non refundable</p>

              <div className={styles.refundLabel}>Refund upon cancellation</div>
              <div className={styles.refundBar}>
                <div className={styles.refundFill}>50% Refund</div>
                <div className={styles.refundEmpty}>0%</div>
              </div>

              <div className={styles.refundTime}>Nov 19 • 07:00 PM</div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <aside className={styles.rightCol}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Trip Summary</h2>

            <div className={styles.summaryRow}>
              <div className={styles.rowLabel}>Insurance Plan:</div>
              <div className={styles.rowValue}>PLUS</div>
            </div>

            <div className={styles.summaryRow}>
              <div className={styles.rowLabel}>Duration:</div>
              <div className={styles.rowValue}>32 hours</div>
            </div>

            <div className={styles.summaryRow}>
              <div className={styles.rowLabel}>Rental (32 hrs × ₹60/hr):</div>
              <div className={styles.rowValue}>₹{rental}</div>
            </div>

            <div className={styles.summaryRow}>
              <div className={styles.rowLabel}>Insurance (PLUS Plan):</div>
              <div className={styles.rowValue}>₹{insurance}</div>
            </div>

            <div className={styles.summaryRow}>
              <div className={styles.rowLabel}>Convenience Fee:</div>
              <div className={styles.rowValue}>₹{convenience}</div>
            </div>

            <div className={styles.divider} />

            <div className={styles.totalRow}>
              <div className={styles.totalLabel}>GST (18%):</div>
              <div className={styles.totalValue}>₹{gst}</div>
            </div>

            <div className={styles.totalBar}>
              <div className={styles.totalText}>Total:</div>
              <div className={styles.totalAmt}>₹{total}</div>
            </div>

            <button
              className={styles.payBtn}
              disabled={!agree}
              title={!agree ? "Please accept terms & conditions" : "Proceed to Payment"}
            >
              Pay Now
            </button>
          </div>

          {/* Terms - placed below right card with premium strip */}
          <div className={styles.termsStrip}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className={styles.checkbox}
              />
              <span>
                By proceeding to payment, I confirm that I agree to the{" "}
                <a href="#" className={styles.link}>Cancellation Policy</a> and{" "}
                <a href="#" className={styles.link}>Terms of Service</a>.
              </span>
            </label>
          </div>
        </aside>
      </div>
    </div>
  );
}