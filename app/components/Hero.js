"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Hero.module.css";

const images = [
  "/h1.png",
  "/hero1.png",
  "/hero33.png",
  "/hero22.png",
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  // Auto-change slides every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 4000); // 4 sec interval
    return () => clearInterval(interval);
  }, []);

  // Loop index without visual jump
  const actualIndex = current % images.length;

  return (
    <section className={styles.slider} aria-label="Car hero slider">
      <div
        className={styles.slidesWrapper}
        style={{ transform: `translateX(-${actualIndex * 100}%)` }}
      >
        {images.concat(images[0]).map((src, idx) => ( // clone first image at end
          <div className={styles.slide} key={idx}>
            {/* background blurred fill */}
            <Image
              src={src}
              alt=""
              fill
              aria-hidden="true"
              className={styles.backgroundBlur}
            />
            {/* foreground car */}
            <Image
              src={src}
              alt={`Urban Drive featured car ${idx + 1}`}
              fill
              className={styles.foregroundCar}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
