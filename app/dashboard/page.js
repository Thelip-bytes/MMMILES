"use client";
import { useState } from "react";
import { User, Clock, ShoppingCart } from "lucide-react";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const [activeBox, setActiveBox] = useState(null);

  const handleBoxClick = (id) => {
    setActiveBox(id === activeBox ? null : id); // toggle if clicked again
  };

  const boxStateClass = (id) => {
    if (!activeBox) return "";
    return id === activeBox ? styles.activeBox : styles.inactiveBox;
  };

  return (
    <div className={styles.container}>
      <div className={styles.background} />

      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to MM Miles</h1>
        <p className={styles.subtitle}>
          Manage your rides, track bookings, and get ready for your next journey.
        </p>

        <div className={styles.grid}>
          {/* Profile Box */}
          <div
            className={`${styles.box} ${styles.profile} ${boxStateClass("profile")}`}
            onClick={() => handleBoxClick("profile")}
          >
            <User className={styles.icon} />
            <span>My Profile</span>
          </div>

          {/* Booking History Box */}
          <div
            className={`${styles.box} ${styles.history} ${boxStateClass("history")}`}
            onClick={() => handleBoxClick("history")}
          >
            <Clock className={styles.icon} />
            <span>Booking History</span>
          </div>

          {/* Checkout Box */}
          <div
            className={`${styles.box} ${styles.checkout} ${boxStateClass("checkout")}`}
            onClick={() => handleBoxClick("checkout")}
          >
            <ShoppingCart className={styles.icon} />
            <span>Check-Out Cart</span>
          </div>
        </div>
      </div>
    </div>
  );
}
