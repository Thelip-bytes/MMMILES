"use client";

import React, { useState } from "react";
import styles from "./FAQSection.module.css";

export default function FAQSection() {
  const faqs = [
    
    
    {
      question: "Do I need to pay a security deposit?",
      answer:
        "Yes. A refundable security deposit is required before the trip. It will be refunded after vehicle inspection (within 3–7 business days).",
    },
    {
      question: "How does fuel policy work?",
      answer:
        "Vehicles are provided with fuel, and you must return them with the same fuel level. Any shortage will be charged",
    },
    {
      question: "Is there a kilometer limit?",
      answer:
        "Yes. Each rental includes a fixed km/day. Extra kilometers will be charged at the rate specified during booking.",
    },
    {
      question: "What happens if I return the car late?",
      answer:
        "Delay up to 4 hours → Hourly late fee applies. Delay beyond 4 hours → Full-day rental charge applies."
    },
   
    {
      question: "Can someone else drive the car I rented?",
      answer:
        "No. Only the registered renter (and any approved co-driver added at booking) can drive. Unauthorized drivers will void insurance and attract penalties",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes. More than 24 hrs. before trip: 90% refund.Within 24 hrs. 50% refund.No-show: No refund."
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
