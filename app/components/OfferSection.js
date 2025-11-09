"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./OffersSection.module.css";

const offers = [
  { img: "/long-offer.png", alt: "Luxury Apartments" },
  { img: "/short-offer.png", alt: "Premium Villas" },
  { img: "/offer.png", alt: "Exclusive Homes" },
];

export default function OffersSection() {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);
  const autoSlideRef = useRef(null);

  // Detect screen width for mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-slide logic with pause on interaction
  useEffect(() => {
    if (isMobile && !paused) {
      autoSlideRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % offers.length);
      }, 4000);
    }
    return () => clearInterval(autoSlideRef.current);
  }, [isMobile, paused]);

  // Handle swipe gestures
  const handleDragEnd = (event, info) => {
    setPaused(true);
    clearInterval(autoSlideRef.current);

    if (info.offset.x > 50) {
      // Swipe right
      setCurrent((prev) => (prev - 1 + offers.length) % offers.length);
    } else if (info.offset.x < -50) {
      // Swipe left
      setCurrent((prev) => (prev + 1) % offers.length);
    }

    // Resume after short delay
    setTimeout(() => setPaused(false), 4000);
  };

  // Pause auto-slide when user touches
  const handleUserInteraction = () => {
    setPaused(true);
    clearInterval(autoSlideRef.current);
    setTimeout(() => setPaused(false), 4000);
  };

  return (
    <section className={styles.offersSection} aria-label="Deals we offer">
      <div className={styles.container}>
        <h2 className={styles.heading}>Deals we offer</h2>

        {/* 🖥 Desktop View (unchanged) */}
        {!isMobile ? (
          <div className={styles.offersGrid}>
            {offers.map((offer, idx) => (
              <div key={idx} className={styles.card}>
                <Image
                  src={offer.img}
                  alt={offer.alt}
                  width={500}
                  height={300}
                  className={styles.offerImage}
                />
              </div>
            ))}
          </div>
        ) : (
          // 📱 Mobile Carousel
          <div className={styles.mobileCarousel}>
            <AnimatePresence initial={false}>
              <motion.div
                key={current}
                className={styles.mobileSlide}
                initial={{ opacity: 0, scale: 0.9, x: 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                  duration: 0.5,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                onTouchStart={handleUserInteraction}
                onMouseDown={handleUserInteraction}
              >
                <Image
                  src={offers[current].img}
                  alt={offers[current].alt}
                  width={500}
                  height={300}
                  className={styles.offerImage}
                />
              </motion.div>
            </AnimatePresence>

            {/* ⚫ Dots Navigation */}
            <div className={styles.dots}>
              {offers.map((_, idx) => (
                <motion.span
                  key={idx}
                  className={`${styles.dot} ${
                    current === idx ? styles.activeDot : ""
                  }`}
                  animate={
                    current === idx
                      ? { scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }
                      : { scale: 1, opacity: 0.6 }
                  }
                  transition={{
                    repeat: current === idx ? Infinity : 0,
                    repeatType: "reverse",
                    duration: 1.5,
                  }}
                  onClick={() => setCurrent(idx)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
