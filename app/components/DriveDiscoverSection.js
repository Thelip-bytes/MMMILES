"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./DriveDiscoverSection.module.css";

const DriveDiscoverSection = () => {
  const trips = [
    { src: "/ecr1.png", label: "ECR" },
    { src: "/mahabalipuram1.jpg", label: "MAHABALIPURAM" },
    { src: "/kodai1.jpg", label: "KODAIKANAL" },
    { src: "/kothagiri1.jpg", label: "KOTHAGIRI" },
    { src: "/Ooty 1.jpg", label: "OOTY" },
    { src: "/yercaud1.jpg", label: "YERCAUD" },
    { src: "/pondi.jpg", label: "PONDICHERY" },
  ];

  const looped = [...trips, ...trips.slice(0, 3)];
  const totalSlides = trips.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const viewportRef = useRef(null);
  const intervalRef = useRef(null);

  const cardWidth = 350 + 20;

  // FIXED — removed TypeScript syntax
  const scrollToCard = useCallback(
    (i, smooth = true) => {
      if (!viewportRef.current) return;
      viewportRef.current.scrollTo({
        left: i * cardWidth,
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [cardWidth]
  );

  const next = useCallback(() => setActiveIndex((p) => p + 1), []);
  const prev = useCallback(() => setActiveIndex((p) => p - 1), []);

  // LOOP FIX
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;

    if (activeIndex >= totalSlides) {
      setTimeout(() => {
        vp.scrollTo({ left: 0, behavior: "auto" });
        setActiveIndex(0);
      }, 5000);
    } else if (activeIndex < 0) {
      vp.scrollTo({ left: totalSlides * cardWidth, behavior: "auto" });
      setActiveIndex(totalSlides - 1);
    } else {
      scrollToCard(activeIndex);
    }
  }, [activeIndex, totalSlides, cardWidth, scrollToCard]);

  // AUTO SLIDE — SPEED FIXED (5000ms)
  const startAuto = useCallback(() => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      setActiveIndex((p) => p + 1);
    }, 5000); // ← YOUR SPEED HERE
  }, []);

  const stopAuto = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto, stopAuto]);

  // ⭐ ADD SWIPE SUPPORT ⭐
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) < 20) return;
    if (diff > 0) next(); // swipe left → next
    else prev();          // swipe right → prev
  };

  return (
    <div className={styles.placebody}>
      <section className={styles.discoverSection}>
        <h2>Drive. Discover. Delight.</h2>
        <p className={styles.subtitle}>Turn Every Trip Into a Memory</p>

        <div
          className={styles.slider}
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
        >
          <button className={`${styles.arrowBtn} ${styles.left}`} onClick={prev}>
            <FaChevronLeft />
          </button>

          <div
            className={styles.carouselViewport}
            ref={viewportRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className={styles.carouselTrack}>
              {looped.map((trip, i) => (
                <div className={styles.discoverCard} key={i}>
                  <Image
                    src={trip.src}
                    alt={trip.label}
                    width={350}
                    height={220}
                    className={styles.image}
                  />
                  <div className={styles.label}>{trip.label}</div>
                </div>
              ))}
            </div>
          </div>

          <button className={`${styles.arrowBtn} ${styles.right}`} onClick={next}>
            <FaChevronRight />
          </button>

          <div className={styles.dotContainer}>
            {trips.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${
                  i === (activeIndex % totalSlides) ? styles.activeDot : ""
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DriveDiscoverSection;
