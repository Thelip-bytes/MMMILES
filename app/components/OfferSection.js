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
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);
  const autoSlideRef = useRef(null);

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto slide logic
  useEffect(() => {
    if (isMobile && !paused) {
      autoSlideRef.current = setInterval(() => {
        handleSlide(1);
      }, 3500);
    }
    return () => clearInterval(autoSlideRef.current);
  }, [isMobile, paused]);

  const handleSlide = (dir) => {
    setDirection(dir);
    setCurrent((prev) => (prev + dir + offers.length) % offers.length);
  };

  const handleDragEnd = (e, info) => {
    setPaused(true);
    clearInterval(autoSlideRef.current);
    if (info.offset.x > 50) handleSlide(-1);
    else if (info.offset.x < -50) handleSlide(1);
    setTimeout(() => setPaused(false), 4000);
  };

  const handleUserInteraction = () => {
    setPaused(true);
    clearInterval(autoSlideRef.current);
    setTimeout(() => setPaused(false), 4000);
  };

  // ✅ Only horizontal movement — no Y or scale animations
  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300, // slides from right or left
      opacity: 0,
      position: "absolute",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "relative",
      transition: {
        x: { type: "spring", stiffness: 60, damping: 20 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300, // moves out opposite direction
      opacity: 0,
      position: "absolute",
      transition: { duration: 0.4 },
    }),
  };

  return (
    <section className={styles.offersSection} aria-label="Deals we offer">
      <div className={styles.container}>
        <h2 className={styles.heading}>Deals we offer</h2>

        {/* 🖥 Desktop view stays unchanged */}
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
          // 📱 Mobile carousel
          <div className={styles.mobileCarousel}>
            <div className={styles.slideContainer}>
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={current}
                  className={styles.mobileSlide}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
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
            </div>

            {/* Dots navigation */}
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
                      : { scale: 1, opacity: 0.5 }
                  }
                  transition={{
                    repeat: current === idx ? Infinity : 0,
                    repeatType: "reverse",
                    duration: 1.5,
                  }}
                  onClick={() => handleSlide(idx - current)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
