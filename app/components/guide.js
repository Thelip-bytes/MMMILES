"use client";

import styles from "./guide.module.css";
import Image from "next/image";
import { motion } from "framer-motion";

export default function GuidePage() {
  const steps = [
    {
      id: 1,
      title: "Book Early",
      desc: "Prices generally rise when it gets closer to the starting date of your trip. Book ahead to save and don’t worry, you can always make changes or cancel for free up to 48 hours before pick-up if your plans change.",
      img: "/gauid2.jpg",
      bg: "#DDF0FF",
    },
    {
      id: 2,
      title: "Pay Attention To Reviews",
      desc: "See what previous customers have to say about the rental supplier. Choosing a company with a score of 8 or higher is recommended.",
      img: "/gauid2.jpg",
      bg: "#FFF2B7",
    },
    {
      id: 3,
      title: "Keep the Deposit in Mind",
      desc: "You will have to leave a deposit when you pick up the car. In the rental conditions, you can see how much it will be. Make sure you have enough credit available to cover it.",
      img: "/gauid3.jpg",
      bg: "#D8FFE8",
    },
    {
      id: 4,
      title: "Know the Fuel and Mileage Policies",
      desc: "Avoid costly fees by knowing how much mileage is included in your rental and what the fuel policy is.",
      img: "/gauid1.jpg",
      bg: "#f4eeefff",
    },
  ];

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        className={styles.title}
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        How to find a great car rental deal
      </motion.h1>

      <motion.p
        className={styles.subtitle}
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        We’ll take care of finding the lowest price for you, but here’s what you can do to make sure you get the best deal:
      </motion.p>

      <div className={styles.grid}>
        {steps.map((item, i) => (
          <motion.div
            key={item.id}
            className={styles.card}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.04 }}
          >
            <div className={styles.imageBox} style={{ background: item.bg }}>
              <Image src={item.img} alt={item.title} width={180} height={180} />
            </div>

            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}