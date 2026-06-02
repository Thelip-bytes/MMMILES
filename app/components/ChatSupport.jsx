"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ChatSupport.module.css";

export default function ChatSupport() {

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi there! 👋 Welcome to MMMiles. How can I help you today?"
    }
  ]);

  const handleOptionClick = (type) => {

    let reply = "";

    if (type === "host") {
      reply =
        "For host-related queries, please tell us what you need help with.";
    }

    if (type === "booking") {
      reply =
        "For booking-related queries, please share your booking details.";
    }

    if (type === "contact") {
      reply =
        "Our support team will contact you shortly. Please leave your details.";
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: reply,
      },
    ]);
  };

  return (
    <>
      {/* Floating Button */}

      <button
        className={styles.chatFloatingBtn}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src="/Chat-bot.png"
          alt="Chat Support"
          width={70}
          height={70}
          className={styles.chatFloatingIcon}
        />
      </button>

      {/* Chat Window */}

      {isOpen && (

        <div className={styles.chatWrapper}>

          <div className={styles.chatHeader}>

            <div>
              <h3>MMMiles Support</h3>
              <p>Replies instantly...</p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

          </div>

          {/* CHAT BODY */}

          <div className={styles.chatBody}>

            {messages.map((msg, index) => (

              <div
                key={index}
                className={styles.chatBotMessage}
              >
                {msg.text}
              </div>

            ))}

            {/* QUICK OPTIONS */}

            <div className={styles.chatQuickActions}>

              <button
                onClick={() => handleOptionClick("host")}
              >
                Host Related
              </button>

              <button
                onClick={() => handleOptionClick("booking")}
              >
                Booking Related
              </button>

              <button
                onClick={() => handleOptionClick("contact")}
              >
                Contact Us
              </button>

            </div>

          </div>

          {/* FOOTER */}

          <div className={styles.chatFooter}>

            <input
              type="text"
              placeholder="Start a new conversation here..."
            />

            <button>➤</button>

          </div>

        </div>

      )}

    </>
  );
}