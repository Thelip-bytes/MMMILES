"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaMapMarkerAlt, FaSearch, FaTimes, FaCrosshairs } from "react-icons/fa";
import { toast } from "react-hot-toast";
import styles from "./LocationPickerModal.module.css";

// Google Maps API configuration
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

let geocoder = null;
let isGoogleMapsLoaded = false;

const initializeGoogleMapsServices = () => {
  if (typeof window !== "undefined" && window.google && window.google.maps) {
    geocoder = new window.google.maps.Geocoder();
    isGoogleMapsLoaded = true;
    return true;
  }
  return false;
};

const loadGoogleMapsAPI = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.google && window.google.maps && window.google.maps.Geocoder) {
      if (initializeGoogleMapsServices()) {
        resolve(true);
        return;
      }
    }

    if (window.googleMapsLoading) {
      const checkLoaded = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.Geocoder) {
          clearInterval(checkLoaded);
          resolve(initializeGoogleMapsServices());
        }
      }, 100);
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      resolve(false);
      return;
    }

    window.googleMapsLoading = true;
    window.initGoogleMaps = () => {
      window.googleMapsLoading = false;
      resolve(initializeGoogleMapsServices());
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps&loading=async`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      window.googleMapsLoading = false;
      resolve(false);
    };
    document.head.appendChild(script);
  });
};

const CITIES = ["Chennai", "Bengaluru", "Kochi", "Hyderabad", "Mumbai"];

export default function LocationPickerModal({ isOpen, onClose, onLocationSelect, currentAddress }) {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (GOOGLE_MAPS_API_KEY && !isGoogleMapsLoaded) {
      loadGoogleMapsAPI();
    }
  }, []);

  const extractCity = (result) => {
    if (!result || !result.address_components) return null;
    const components = result.address_components;
    const cityTypes = ['locality', 'sublocality', 'administrative_area_level_2'];
    
    for (const type of cityTypes) {
      const component = components.find(comp => comp.types.includes(type));
      if (component) {
        const matchedCity = CITIES.find(city => 
          city.toLowerCase() === component.long_name.toLowerCase()
        );
        if (matchedCity) return matchedCity;
      }
    }
    return null;
  };

  const formatAddress = (result) => {
    return result.formatted_address || "Selected Location";
  };

  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);

    try {
      if (!isGoogleMapsLoaded) {
        await loadGoogleMapsAPI();
      }

      if (!window.google || !window.google.maps) {
        toast.error("Google Maps not available");
        setIsSearching(false);
        return;
      }

      const autocompleteService = new google.maps.places.AutocompleteService();
      const placesService = new google.maps.places.PlacesService(document.createElement('div'));

      autocompleteService.getPlacePredictions({
        input: query,
        componentRestrictions: { country: 'in' },
        types: ['geocode']
      }, (predictions, status) => {
        if (status === "OK" && predictions) {
          const detailedPromises = predictions.slice(0, 6).map(prediction => {
            return new Promise((resolve) => {
              placesService.getDetails({
                placeId: prediction.place_id,
                fields: ['address_components', 'formatted_address', 'geometry']
              }, (place, status) => {
                if (status === "OK" && place && place.geometry) {
                  resolve({
                    place_id: prediction.place_id,
                    title: prediction.structured_formatting?.main_text || prediction.description,
                    subtitle: prediction.structured_formatting?.secondary_text || '',
                    formatted_address: place.formatted_address,
                    lat: place.geometry.location.lat(),
                    lon: place.geometry.location.lng(),
                    address_components: place.address_components
                  });
                } else {
                  resolve(null);
                }
              });
            });
          });

          Promise.all(detailedPromises).then(results => {
            setSuggestions(results.filter(r => r !== null));
            setIsSearching(false);
          });
        } else {
          setSuggestions([]);
          setIsSearching(false);
        }
      });
    } catch (e) {
      console.error("Search error:", e);
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 400);
  };

  const handleSuggestionClick = (item) => {
    const city = extractCity({ address_components: item.address_components });
    setSelectedLocation({
      address: item.formatted_address,
      lat: item.lat,
      lon: item.lon,
      city: city
    });
    setSearchInput(item.title);
    setSuggestions([]);
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    setIsLocating(true);

    if (!isGoogleMapsLoaded) {
      await loadGoogleMapsAPI();
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        if (geocoder) {
          geocoder.geocode({ location: { lat, lng: lon } }, (results, status) => {
            if (status === "OK" && results[0]) {
              const address = formatAddress(results[0]);
              const city = extractCity(results[0]);
              
              setSelectedLocation({ address, lat, lon, city });
              setSearchInput(address.substring(0, 50) + (address.length > 50 ? '...' : ''));
              toast.success("Location detected!");
            } else {
              setSelectedLocation({ address: "Current Location", lat, lon, city: null });
              setSearchInput("Current Location");
            }
            setIsLocating(false);
          });
        } else {
          setSelectedLocation({ address: "Current Location", lat, lon, city: null });
          setSearchInput("Current Location");
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) {
          toast.error("Location access denied");
        } else {
          toast.error("Could not get location");
        }
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleContinue = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    } else {
      toast.error("Please select a location");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className={styles.header}>
          <h2>Select Location</h2>
        </div>

        {/* Search Input */}
        <div className={styles.searchContainer}>
          <div className={styles.searchLabel}>Location</div>
          <div className={styles.searchInputWrapper}>
            <FaMapMarkerAlt className={styles.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for the car location"
              value={searchInput}
              onChange={handleInputChange}
              className={styles.searchInput}
            />
            {searchInput && (
              <button className={styles.clearBtn} onClick={() => { setSearchInput(""); setSuggestions([]); }}>
                <FaTimes size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Current Location Button */}
        <button className={styles.gpsButton} onClick={handleUseCurrentLocation} disabled={isLocating}>
          <FaCrosshairs className={styles.gpsIcon} />
          <span>{isLocating ? "Detecting..." : "Current Location"}</span>
        </button>

        {/* Suggestions List */}
        <div className={styles.suggestionsContainer}>
          {isSearching && (
            <div className={styles.loadingText}>Searching...</div>
          )}
          
          {!isSearching && suggestions.length > 0 && (
            <>
              <div className={styles.suggestionsLabel}>Suggested Locations</div>
              <div className={styles.suggestionsList}>
                {suggestions.map((item) => (
                  <div 
                    key={item.place_id} 
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(item)}
                  >
                    <FaMapMarkerAlt className={styles.suggestionIcon} />
                    <div className={styles.suggestionTexts}>
                      <div className={styles.suggestionTitle}>{item.title}</div>
                      <div className={styles.suggestionSubtitle}>{item.subtitle || item.formatted_address}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Continue Button */}
        <button 
          className={styles.continueBtn} 
          onClick={handleContinue}
          disabled={!selectedLocation}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
