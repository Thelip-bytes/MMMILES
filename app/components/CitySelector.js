"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FaTimes, FaSearch, FaCrosshairs } from "react-icons/fa";
import styles from "./CitySelector.module.css";

const CITY_DATA = [
    { name: "Chennai", image: "/icons/chennai.png" },
    { name: "Bengaluru", image: "/icons/bangalore.png" },
    { name: "Kochi", image: "/icons/kochi.png" },
    { name: "Hyderabad", image: "/icons/hyderabad.png" },
    { name: "Mumbai", image: "/icons/mumbai.png" },
    // Adding Delhi/NCR if you have the icon
    { name: "Delhi-NCR", image: "/icons/delhi.png" },
];

export default function CitySelector({ isOpen, onClose, onSelect, selectedCity }) {
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const filteredCities = CITY_DATA.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                {/* Close Button implementation similar to BMS might not be strictly visible or is top right. tailored here. */}
                {/* <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <FaTimes size={20} />
        </button> */}
                {/* BMS usually interacts via clicking outside or explicit close if mobile. Keeping standard close for utility. */}

                <div className={styles.contentContainer}>
                    {/* Search Bar */}
                    <div className={styles.searchContainer}>
                        <div className={styles.searchBox}>
                            <FaSearch className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search for your city"
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Popular Cities */}
                    <div className={styles.sectionTitle}>Popular Cities</div>

                    <div className={styles.citiesGrid}>
                        {filteredCities.map((city) => (
                            <div
                                key={city.name}
                                className={`${styles.cityItem} ${selectedCity === city.name ? styles.selected : ""}`}
                                onClick={() => {
                                    onSelect(city.name);
                                    onClose();
                                }}
                            >
                                <div className={styles.cityIconWrapper}>
                                    <div className={styles.placeholderIcon}>
                                        {/* Placeholder SVG */}
                                        <svg
                                            width="40"
                                            height="40"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{ color: '#666' }}
                                        >
                                            <path d="M3 21h18" />
                                            <path d="M5 21V7l8-4 8 4v14" />
                                            <path d="M8 21v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                    </div>
                                </div>
                                <div className={styles.cityName}>{city.name}</div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
}
