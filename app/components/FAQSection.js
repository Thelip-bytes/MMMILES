"use client";

import React, { useState } from "react";
import styles from "./FAQSection.module.css";

export default function FAQSection() {
 const faqs = [
    {
      question: "What documents do I need to rent a car?",
      answer:
        "You need a valid Driving License and a government-issued ID proof (Aadhar / Passport / PAN).",
    },
    {
      question: "What is the minimum age to rent a car?",
      answer:
        "The minimum age is 18 years.",
    },
    {
      question: "Do I need to pay a security deposit?",
      answer:
        "No. We do not require any security deposit at any stage of the booking or trip.",
    },
    {
      question: "How does fuel policy work?",
      answer:
        "Vehicles are provided with fuel, and you must return them with the same fuel level. Any shortage will be charged.",
    },

     {
      question: "Is there a kilometer limit?",
      answer:
        "Most cars have unlimited kms. Kilometer limits apply only to select premium cars and will be mentioned during booking.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const onKeyToggle = (e, index) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFAQ(index);
    }
  };

  return (
    <section className={styles.faqSection} aria-label="Frequently asked questions">
      <div className={styles.faqHeader}>
        <h2 id="faq-navigation">Your Queries, Answered</h2>
        <p>Know Before You Go</p>
      </div>

      <div className={styles.faqList}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              className={`${styles.faqCard} ${isOpen ? styles.open : ""}`}
              key={index}
            >
              <div
                className={styles.faqTrigger}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                onClick={() => toggleFAQ(index)}
                onKeyDown={(e) => onKeyToggle(e, index)}
              >
                <span className={styles.faqQuestion}>{faq.question}</span>
                <span
                  className={`${styles.faqIcon} ${isOpen ? styles.open : ""}`}
                  aria-hidden="true"
                />
              </div>

              <div
                id={`faq-panel-${index}`}
                className={`${styles.faqAnswer} ${isOpen ? styles.show : ""}`}
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
