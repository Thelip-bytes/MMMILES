// app/components/DriveDiscoverSection.tsx
"use client"; // Only required if used inside app/ and contains interactivity

import React from "react";
import Image from "next/image";
import styles from "./DriveDiscoverSection.module.css";

const DriveDiscoverSection = () => {
  const trips = [
    { src: "/ecr.png", label: "ECR" },
    { src: "/mahabalipuram.jpg", label: "MAHABALIPURAM" },
    { src: "/kodai.jpg", label: "KODAIKANAL" },
    { src: "/kothagiri.jpg", label: "KOTHAGIRI" },
    { src: "/Ooty.jpg", label: "OOTY" },
    { src: "/yercaud.jpg", label: "YERCAUD" },
    { src: "/pondi.jpg", label: "PONDICHERY" },
  ];

  return (
    <div className={styles.placebody}>
      <section className={styles.discoverSection}>
        <h2>Drive. Discover. Delight.</h2>
        <p className={styles.subtitle}>Turn Every Trip Into a Memory</p>

        <div className={styles.slider}>
          <div className={styles.slideTrack}>
            {[...trips, ...trips, ...trips, ...trips, ...trips, ...trips].map((trip, index) => (
              <div className={styles.discoverCard} key={index}>
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
      </section>
    </div>
  );
};

export default DriveDiscoverSection;