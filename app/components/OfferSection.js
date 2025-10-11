"use client";
import Image from "next/image";
import styles from "./OffersSection.module.css";

const offers = [
  {
    img: "/long-offer.png", // <-- replace with your real image paths
    alt: "Luxury Apartments",
  },
  {
    img: "/short-offer.png",
    alt: "Premium Villas",
  },
  {
    img: "/offer.png",
    alt: "Exclusive Homes",
  },
];

export default function OffersSection() {
  return (
    <section className={styles.offersSection} aria-label="Deals we offer">
      <div className={styles.container}>
        <h2 className={styles.heading}>Deals we offer</h2>
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
      </div>
    </section>
  );
}
