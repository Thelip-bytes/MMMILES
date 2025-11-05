"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const router = useRouter();

  const [location, setLocation] = useState("Detecting location...");
  const [coords, setCoords] = useState(null);
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ✅ Format date + time (dd/mm/yyyy hh:mm)
  const formatDateTime = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // ✅ Get user’s current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser.");
      setLocation("Location unavailable");
      return;
    }

    setLocation("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });

        const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
          );
          const data = await res.json();
          if (data.results?.[0]) {
            const address = data.results[0].formatted_address;
            setLocation(address);
          } else {
            setLocation(`Lat: ${latitude}, Lng: ${longitude}`);
          }
        } catch {
          toast.error("Failed to retrieve address.");
          setLocation("Unknown location");
        }
      },
      () => {
        toast.error("Please allow location access.");
        setLocation("Permission denied");
      }
    );
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // ✅ Handle search
  const handleSearch = () => {
    if (!location || location.includes("Detecting")) {
      toast.error("Please confirm your location first.");
      return;
    }
    if (!pickupDate || !returnDate) {
      toast.error("Please select both pick-up and return date & time.");
      return;
    }
    if (returnDate < pickupDate) {
      toast.error("Return date cannot be before pick-up date & time.");
      return;
    }

    const params = new URLSearchParams({
      location,
      lat: coords?.latitude || "",
      lng: coords?.longitude || "",
      pickup: formatDateTime(pickupDate),
      return: formatDateTime(returnDate),
    });

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.box} role="search" aria-label="Car search bar">
        
        {/* 🌍 Location */}
        <div className={styles.field}>
          <label>Location</label>
          <div className={styles.inputWrapper}>
            <FaMapMarkerAlt className={styles.icon} aria-hidden="true" />
            <input
              type="text"
              value={location}
              readOnly
              className={styles.input}
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className={styles.locBtn}
            >
              Use My Location
            </button>
          </div>
        </div>

        {/* 📅 Pick-Up Date & Time */}
        <div className={styles.field}>
          <label htmlFor="pickup">Pick-Up Date & Time</label>
          <div className={styles.inputWrapper}>
            <FaCalendarAlt className={styles.icon} aria-hidden="true" />
            <DatePicker
              id="pickup"
              selected={pickupDate}
              onChange={(date) => {
                setPickupDate(date);
                if (returnDate && date && returnDate < date) setReturnDate(null);
              }}
              placeholderText="Select pick-up date & time"
              dateFormat="dd/MM/yyyy h:mm aa"
              showTimeSelect
              timeIntervals={30}
              minDate={today}
              className={styles.cdateInput}
              onChangeRaw={(e) => e.preventDefault()}
            />
          </div>
        </div>

        {/* 📆 Return Date & Time */}
        <div className={styles.field}>
          <label htmlFor="return">Return Date & Time</label>
          <div className={styles.inputWrapper}>
            <FaCalendarAlt className={styles.icon} aria-hidden="true" />
            <DatePicker
              id="return"
              selected={returnDate}
              onChange={(date) => setReturnDate(date)}
              placeholderText="Select return date & time"
              dateFormat="dd/MM/yyyy h:mm aa"
              showTimeSelect
              timeIntervals={30}
              minDate={pickupDate || today}
              className={styles.cdateInput}
              onChangeRaw={(e) => e.preventDefault()}
            />
          </div>
        </div>

        {/* 🔍 Search Button */}
        <button
          onClick={handleSearch}
          className={styles.csearchBtn}
          aria-label="Search cars"
        >
          Search
        </button>
      </div>
    </div>
  );
}
