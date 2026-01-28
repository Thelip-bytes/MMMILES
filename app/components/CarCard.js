"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import styles from "./CarCard.module.css";

// Supabase storage base URL for car images
const STORAGE_BASE_URL = "https://tktfsjtlfjxbqfvbcoqr.supabase.co/storage/v1/object/public/car-images/";

// Helper to get ALL image URLs
function getCarImages(car) {
  const images = car.vehicle_images || [];
  // Sort by is_primary to ensure primary image is first for search results
  const sortedImages = [...images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
  
  if (sortedImages.length === 0) return ["/cars/default.jpg"];
  
  return sortedImages.map(img => {
      return img.image_url?.startsWith("http") 
        ? img.image_url 
        : `${STORAGE_BASE_URL}${img.image_url}`;
  });
}

export default function CarCard({ car, pickup, returndate, city }) {
  const router = useRouter();
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false); // Local state for now
  
  const images = getCarImages(car);

  const handleNextImg = (e) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrevImg = (e) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Call API to toggle wishlist
  };
  
  // Calculate distance or show city
  const distanceInfo = car.distance_km ? `${car.distance_km} km away` : `in ${city || car.city || 'Chennai'}`;

  // Ensure default values for price
  const hourlyRate = car.base_daily_rate ? Math.round(car.base_daily_rate / 24) : 0;

  return (
    <div
      className={styles.card}
      onClick={() =>
        router.push(
          `/car/${car.id}?pickup=${pickup || ''}&return=${returndate || ''}`
        )
      }
    >
      
      {/* 1. Image Section with Info Overlay */}
      <div className={styles.cardImageWrapper}>
        <Image
          src={images[currentImgIdx]}
          alt={`${car.make} ${car.model}`}
          width={400} 
          height={250}
          className={styles.carImg}
          priority={false} 
        />
        
        {/* Gradient overlay */}
        <div className={styles.gradientOverlay}></div>
        
        {/* Slider Arrows (Only if > 1 image) */}
        {images.length > 1 && (
          <>
            <button className={`${styles.sliderArrow} ${styles.leftArrow}`} onClick={handlePrevImg}>
              <FaChevronLeft size={12} color="#fff" />
            </button>
            <button className={`${styles.sliderArrow} ${styles.rightArrow}`} onClick={handleNextImg}>
              <FaChevronRight size={12} color="#fff" />
            </button>
          </>
        )}

        {/* Heart Icon */}
        <button className={styles.heartBtn} onClick={handleWishlist}>
          {isWishlisted ? <FaHeart color="#ef4444" size={16} /> : <FaRegHeart color="#111827" size={16} />}
        </button>

        {/* Info Overlay - Title, Details, Rating */}
        <div className={styles.cardInfoOverlay}>
          <div className={styles.cardInfoLeft}>
            {/* Dots */}
            {images.length > 1 && (
              <div className={styles.dotsOverlay} style={{position: 'static', transform: 'none', marginBottom: '6px'}}>
                {images.map((_, idx) => (
                  <div key={idx} className={idx === currentImgIdx ? styles.dotActive : styles.dot}></div>
                ))}
              </div>
            )}
            <h3 className={styles.carTitle}>
              {car.make} {car.model} {car.year || '2023'}
            </h3>
            <p className={styles.carSubtitle}>
              {car.transmission_type} <span className={styles.dotSeparator}></span> {car.fuel_type} <span className={styles.dotSeparator}></span> {car.seating_capacity} Seats
            </p>
          </div>
          
          <div className={styles.cardInfoRight}>
            <div className={styles.ratingPill}>
              <FaStar color="#f59e0b" size={10} /> 5.0 <span style={{color: '#6b7280', fontWeight: 400}}>(8)</span>
            </div>
            <span className={styles.ratingText}>Excellent</span>
          </div>
        </div>
      </div>

      {/* 2. Footer Section */}
      <div className={styles.cardFooter}>
        <div className={styles.footerLeft}>
          <span className={styles.featureTag}>
            <img src="/icons/location-icon.png" alt="loc" />
            {distanceInfo}
          </span>
        </div>

        <div className={styles.footerRight}>
          <div className={styles.priceRow}>
            <span className={styles.priceHour}>₹{hourlyRate}</span>
            <span className={styles.priceUnit}>/hr</span>
          </div>
        </div>
      </div>

    </div>
  );
}
