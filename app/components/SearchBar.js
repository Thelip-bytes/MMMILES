"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { toast } from "react-hot-toast"; // ✅ for better alerts
import styles from "./SearchBar.module.css";



export default function SearchBar() {
  const router = useRouter();
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const popularCities = [
    "Mumbai, India",
    "Delhi, India",
    "Bengaluru, India",
    "Chennai, India",
    "Kolkata, India",
    "Pune, India",
    "Hyderabad, India",
  ];

  // ✅ Date formatter
  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ✅ Debounce helper to improve performance
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleFilterCities = useCallback(
    debounce((value) => {
      const filtered = popularCities.filter((city) =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowSuggestions(true);
    }, 300),
    []
  );

  // ✅ Google Places Autocomplete initialization
  useEffect(() => {
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const scriptId = "google-maps-places";

    const initAutocomplete = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) return;
      if (!inputRef.current) return;

      autocompleteRef.current =
        autocompleteRef.current ||
        new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ["(cities)"],
          componentRestrictions: { country: "in" },
        });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        const address = place?.formatted_address || inputRef.current.value || "";
        setLocation(address);
        setShowSuggestions(false);
      });
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      script.onerror = () => toast.error("Failed to load Google Maps API.");
      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }

    return () => {
      autocompleteRef.current = null;
    };
  }, []);

  // ✅ Input events
  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    handleFilterCities(value);
  };

  const handleFocus = () => {
    handleFilterCities(location);
  };

  // ✅ Handle Search Click
  const handleSearch = () => {
    if (!location.trim()) {
      toast.error("Please enter a location.");
      return;
    }
    if (!pickupDate || !returnDate) {
      toast.error("Please select pick-up and return dates.");
      return;
    }
    if (returnDate < pickupDate) {
      toast.error("Return date cannot be before pick-up date.");
      return;
    }

    const params = new URLSearchParams({
      location: location.trim(),
      pickup: formatDate(pickupDate),
      return: formatDate(returnDate),
    });

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.box} role="search" aria-label="Car search bar">
        {/* Location */}
        <div className={styles.field} style={{ position: "relative" }}>
          <label htmlFor="location">Location</label>
          <div className={styles.inputWrapper}>
            <FaMapMarkerAlt className={styles.icon} aria-hidden="true" />
            <input
              id="location"
              ref={inputRef}
              type="text"
              placeholder="Choose your location"
              value={location}
              onChange={handleInputChange}
              onFocus={handleFocus}
              autoComplete="off"
              className={styles.input}
              aria-label="Enter location"
            />
          </div>

          {/* Custom City Suggestions */}
          {showSuggestions && filteredCities.length > 0 && (
            <div className={styles.customSuggestions}>
              {filteredCities.map((city, idx) => (
                <div
                  key={idx}
                  className={styles.customSuggestionItem}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setLocation(city);
                    setShowSuggestions(false);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${city}`}
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pick-Up Date */}
        <div className={styles.field}>
          <label htmlFor="pickup">Pick-Up Date</label>
          <div className={styles.inputWrapper}>
            <FaCalendarAlt className={styles.icon} aria-hidden="true" />
            <DatePicker
              id="pickup"
              selected={pickupDate}
              onChange={(date) => {
                setPickupDate(date);
                if (returnDate && date && returnDate < date) setReturnDate(null);
              }}
              placeholderText="From Date"
              dateFormat="dd/MM/yyyy"
              minDate={today}
              className={styles.cdateInput}
              onChangeRaw={(e) => e.preventDefault()}
            />
          </div>
        </div>

        {/* Return Date */}
        <div className={styles.field}>
          <label htmlFor="return">Return Date</label>
          <div className={styles.inputWrapper}>
            <FaCalendarAlt className={styles.icon} aria-hidden="true" />
            <DatePicker
              id="return"
              selected={returnDate}
              onChange={(date) => setReturnDate(date)}
              placeholderText="To Date"
              dateFormat="dd/MM/yyyy"
              minDate={pickupDate || today}
              className={styles.cdateInput}
              onChangeRaw={(e) => e.preventDefault()}
            />
          </div>
        </div>

        {/* Search Button */}
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
