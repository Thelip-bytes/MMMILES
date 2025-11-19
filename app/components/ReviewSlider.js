"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./ReviewSlider.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const reviews = [
  {
    text: "The booking was super easy, got a clean, comfortable car for our girls’ weekend. Having GPS and Bluetooth made the trip stress-free and fun.",
    name: "Priya S.",
    title: "Friends Trip (4 members)",
    img: "/profile1.jpg",
  },
  {
    text: "MM Miles made our family road trip smooth from start to finish. The spacious SUV fit all our luggage, and the customer support was always available.",
    name: "Rohan K.",
    title: "Family (5 members)",
    img: "/profile2.jpg",
  },
  {
    text: "Our car broke down suddenly, but I got a replacement vehicle within an hour. Fast response and professional team — truly a lifesaver.",
    name: "Sneha L.",
    title: "Emergency Booking",
    img: "/profile3.jpg",
  },
  {
    text: "Even during the holiday rush, MM Miles had cars ready on short notice. We appreciated how easy it was to pick up and drop off without delays.",
    name: "Arjun P.",
    title: "Frequent Traveler",
    img: "/profile4.jpg",
  },
  {
    text: "I often rent for work trips, and MM Miles is the most reliable. The process is seamless and the cars are always in excellent condition.",
    name: "Kavita D.",
    title: "Corporate Client",
    img: "/profile1.jpg",
  },
  {
    text: "Got stuck in the rain with no transport, and MM Miles helped me get a car. Smooth pickup and great service even in bad weather.",
    name: "Neha V.",
    title: "Daily Commuter",
    img: "/profile2.jpg",
  },
  {
    text: "Needed a car to pick up family from the airport. Booking took just 2 minutes, and the car was ready right on time. Excellent coordination!",
    name: "Harish T.",
    title: "Local Resident",
    img: "/profile3.jpg",
  },
  {
    text: "Drove from Bangalore to Goa using MM Miles. The car handled beautifully the entire way, and there were no hidden charges at all.",
    name: "Deepa S.",
    title: "Road Trip Traveler",
    img: "/profile4.jpg",
  },
  {
    text: "Our company car went for servicing, and MM Miles provided an immediate replacement. Flexible plans and professional support.",
    name: "Rajesh K.",
    title: "Fleet Manager",
    img: "/profile1.jpg",
  },
  {
    text: "I have booked just a day before my trip and still got a reliable vehicle. Super impressed with MM Miles’ quick response.",
    name: "Ananya D.",
    title: "Solo Traveler",
    img: "/profile2.jpg",
  },
];

export default function ReviewSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);
  const scrollRef = useRef(null);

  const loopedData = [...reviews, ...reviews.slice(0, 3)];
  const totalSlides = reviews.length;

  const cardWidth = 270 + 20; // your card width + gap

  const scrollToCard = useCallback(
    (index, smooth = true) => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: smooth ? "smooth" : "auto",
      });
    },
    [cardWidth]
  );

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => prev - 1);
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    const current = scrollRef.current;

    if (activeIndex >= totalSlides) {
      setTimeout(() => {
        current.scrollTo({ left: 0, behavior: "auto" });
        setActiveIndex(0);
      }, 600);
    } else if (activeIndex < 0) {
      current.scrollTo({ left: totalSlides * cardWidth, behavior: "auto" });
      setActiveIndex(totalSlides - 1);
    } else {
      scrollToCard(activeIndex);
    }
  }, [activeIndex, totalSlides, cardWidth, scrollToCard]);

  const startAuto = useCallback(() => {
    stopAuto();
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => prev + 1);
    }, 3000);
  }, []);

  const stopAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [startAuto]);

  const touchStartX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    stopAuto();
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartX.current;
    if (diff > 50) prevSlide();
    else if (diff < -50) nextSlide();
    startAuto();
  };

  return (
    <div className={styles.reviewslide}>
      <section className={styles.reviewSection}>
        <h2 className={styles.heading}>People are talking</h2>

        <div
          className={styles.reviewSliderWrapper}
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
        >
          <button
            className={`${styles.reviewArrow} ${styles.left}`}
            onClick={prevSlide}
          >
            <FaChevronLeft />
          </button>

          <div
            className={styles.carouselViewport}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={styles.carouselTrack}
              ref={scrollRef}
              style={{ transform: `translateX(-${activeIndex * cardWidth}px)` }}
            >
              {loopedData.map((rev, i) => (
                <div className={styles.card} key={i}>
                  <p className={styles.text}>{rev.text}</p>
                  <div className={styles.profile}>
                    <Image
                      src={rev.img}
                      alt={rev.name}
                      width={40}
                      height={40}
                      className={styles.avatar}
                    />
                    <div>
                      <strong>{rev.name}</strong>
                      <p className={styles.title}>{rev.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className={`${styles.reviewArrow} ${styles.right}`}
            onClick={nextSlide}
          >
            <FaChevronRight />
          </button>

          <div className={styles.reviewDots}>
            {reviews.map((_, i) => (
              <span
                key={i}
                className={`${styles.reviewDot} ${
                  i === (activeIndex % totalSlides) ? styles.activeDot : ""
                }`}
                onClick={() => setActiveIndex(i)}
              ></span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
