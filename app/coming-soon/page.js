"use client";
import { useEffect, useState } from "react";
import styles from "./comingsoon.module.css";

export default function ComingSoonPage() {
  const [countdown, setCountdown] = useState({
    days: 5,
    hours: 12,
    minutes: 30,
    seconds: 45,
  });

  const [theme, setTheme] = useState("dark");

  // Auto light/dark mode detection
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    setTheme(mq.matches ? "light" : "dark");

    mq.addEventListener("change", (e) => {
      setTheme(e.matches ? "light" : "dark");
    });
  }, []);

  // Countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { days, hours, minutes, seconds } = prev;

        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);



  return (
    <section className={`${styles.comingSoonSection} ${styles[theme]}`}>
      <div className={styles.backgroundGlow}></div>
      <div className={styles.road}></div>

      {/* CAR WITH HEADLIGHT + SMOKE */}
      <div className={styles.carContainer}>
        <div className={styles.carBody}></div>

        {/* Headlights */}
        <div className={styles.headlightLeft}></div>
        <div className={styles.headlightRight}></div>

        {/* Exhaust smoke */}
        <div className={styles.smoke}></div>
        <div className={styles.smoke2}></div>

        <div className={`${styles.wheel} ${styles.frontWheel}`}></div>
        <div className={`${styles.wheel} ${styles.backWheel}`}></div>
      </div>

      {/* CONTENT */}
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>Coming Soon</h1>
        <p className={styles.subtitle}>
          A new era of luxury car rentals is arriving.
        </p>

        <div className={styles.countdownBox}>
          <div><span>{countdown.days}</span>Days</div>
          <div><span>{countdown.hours}</span>Hours</div>
          <div><span>{countdown.minutes}</span>Minutes</div>
          <div><span>{countdown.seconds}</span>Seconds</div>
        </div>

        <form className={styles.notifyForm}>
          <input type="email" placeholder="Enter your email to get notified" />
          <button type="submit">Notify Me</button>
        </form>
      </div> 

    </section>
  );
}
