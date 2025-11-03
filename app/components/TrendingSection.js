"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";   // ✅ Import Link
import styles from "./TrendingSection.module.css";

const carImages = [
  { src: "/car-trending.png", link: "/car1" },
  { src: "/hero1.png", link: "/car2" },
  { src: "/about.jpg", link: "/car3" },
  { src: "/chennai-map.png", link: "/car4"},
  { src: "/car5.png", link: "/car5"},
  { src: "/car6.png", link: "/car6"},
  { src: "/car7.png", link: "/car7"},
];

export default function TrendingSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + carImages.length) % carImages.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carImages.length);
  };

  return (
    <section className={styles.trendingSection} aria-label="Trending Cars">
      <h2 className={styles.heading}>Drive What’s Trending</h2>
      <p className={styles.subheading}>Hot Rides, High Demand</p>

      <div className={styles.carouselWrapper}>
        {carImages.map((car, i) => {
          let position = styles.nextSlide;

          if (i === currentIndex) {
            position = styles.activeSlide;
          } else if (
            i === currentIndex - 1 ||
            (currentIndex === 0 && i === carImages.length - 1)
          ) {
            position = styles.prevSlide;
          }

          return (
            <Link key={i} href={car.link} className={`${styles.slide} ${position}`}>
              <Image
                src={car.src}
                alt={`Trending Car ${i + 1}`}
                fill
                className={styles.image}
                priority
              />
              {position !== styles.activeSlide && (
                <div className={styles.overlay}></div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Dots + Arrows */}
      <div className={styles.dotsWrapper}>
        <div className={styles.dots}>
          {carImages.map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${
                i === currentIndex ? styles.activeDot : ""
              }`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>

        {/* Arrows below dots */}
        <div className={styles.arrowsBottom}>
          <button onClick={handlePrev} className={styles.arrowBtn}>
            &#10094;
          </button>
          <button onClick={handleNext} className={styles.arrowBtn}>
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}
