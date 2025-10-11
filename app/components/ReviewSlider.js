"use client";
import Image from "next/image";
import styles from "./ReviewSlider.module.css";

const reviews = [
  {
    text: "The ability to see the entire teams workflow and collaborate behind the scenes creates a better experience for the user and the team.",
    name: "Alex C.",
    title: "Enterprise (1,000 emp.)",
    img: "/r1.png",
  },
  {
    text: "With Urban Drive, we’ve seen amazing growth. We’re rolling it out across the entire customer lifecycle.",
    name: "Yvonne Chen",
    title: "VP of Marketing, Udemy",
    img: "/r2.png",
  },
  {
    text: "By engaging visitors on our website, we’ve increased conversion rates by 45%.",
    name: "Jesus Regama",
    title: "Director of Growth Marketing, Unity",
    img: "/r3.png",
  },
  {
    text: "Would massively recommend Urban Drive as a support product — great UX, very powerful.",
    name: "acouRx",
    title: "@acouRx",
    img: "/r4.png",
  },
];

export default function ReviewSlider() {
  return (
    <div className={styles.reviewslide}>
      <section
        className={styles.reviewSection}
        aria-label="Customer testimonials"
      >
        <h2 className={styles.heading}>People are talking</h2>
        <div className={styles.slider}>
          <div className={styles.sliderTrack}>
            {[...reviews, ...reviews, ...reviews].map((review, idx) => (
              <div className={styles.card} key={idx}>
                <p className={styles.text}>{review.text}</p>
                <div className={styles.profile}>
                  <Image
                    src={review.img}
                    alt={review.name}
                    width={40}
                    height={40}
                    className={styles.avatar}
                  />
                  <div>
                    <strong>{review.name}</strong>
                    <p className={styles.title}>{review.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
