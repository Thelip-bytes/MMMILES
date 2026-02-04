import Image from "next/image";
import styles from "./ComingSoon.module.css";

export default function ComingSoonHero() {
  return (
    <section className={styles.hero}>
      <p className={styles.coming}>Coming Soon</p>
      <h1 className={styles.city}>Bangalore</h1>

      <div className={styles["car-lock"]}>
        <Image
          src="/car.png"
          alt="Car"
          fill
          priority
          className={styles["car-img"]}
        />
        <span className={styles.headlight}></span>
      </div>

      <div className={styles.right}>
        <h2>
          Experience the future of car rentals and
          <br />
          Your next ride is closer than you think.
        </h2>
        <br />
        <p className={styles.sub}>
          Join the waitlist & be the first to know
        </p>

        <button className={styles.cta}>GET EARLY ACCESS</button>
      </div>
    </section>
  );
}