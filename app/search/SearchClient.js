"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaFilter, FaSearch, FaMapMarkerAlt, FaClock, FaCar, FaGasPump, FaCog, FaUsers, FaCalendarAlt, FaChevronDown, FaStar, FaMedal, FaAirFreshener, FaAirbnb, FaSafari, FaFirstAid, FaUserFriends, FaChair, FaRegSave, FaSatellite, FaPhone, FaHeart, FaRegHeart, FaCrown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./filters.module.css";
import LocationPickerModal from "../components/LocationPickerModal";
import CalendarModal from "../components/CalendarModal";

// debounce helper
// debounce helper
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// Supabase storage base URL for car images
const STORAGE_BASE_URL = "https://tktfsjtlfjxbqfvbcoqr.supabase.co/storage/v1/object/public/car-images/";

// Helper to get ALL image URLs
function getCarImages(car) {
  const images = car.vehicle_images || [];
  // Sort by is_primary if needed, or just return all
  // Ensure we have at least one valid image
  if (images.length === 0) return ["/cars/default.jpg"];
  
  return images.map(img => {
      return img.image_url?.startsWith("http") 
        ? img.image_url 
        : `${STORAGE_BASE_URL}${img.image_url}`;
  });
}

function CarCard({ car, pickup, returndate, router, city }) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false); // Local state for now
  
  const images = getCarImages(car);

  const handleNextImg = (e) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrevImg = (e) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    // TODO: Call API to toggle wishlist
  };

  return (
    <div
      className={styles.card}
      onClick={() =>
        router.push(
          `/car/${car.id}?pickup=${pickup}&return=${returndate}`
        )
      }
    >
      
      {/* 1. Image Section with Info Overlay */}
      <div className={styles.cardImageWrapper}>
        <Image
          src={images[currentImgIdx]}
          alt={`${car.make} ${car.model}`}
          width={400} 
          height={250}
          className={styles.carImg}
          priority={false} 
        />
        
        {/* Gradient overlay */}
        <div className={styles.gradientOverlay}></div>
        
        {/* Slider Arrows (Only if > 1 image) */}
        {images.length > 1 && (
          <>
            <button className={`${styles.sliderArrow} ${styles.leftArrow}`} onClick={handlePrevImg}>
              <FaChevronLeft size={12} color="#fff" />
            </button>
            <button className={`${styles.sliderArrow} ${styles.rightArrow}`} onClick={handleNextImg}>
              <FaChevronRight size={12} color="#fff" />
            </button>
          </>
        )}

        {/* Heart Icon */}
        <button className={styles.heartBtn} onClick={handleWishlist}>
          {isWishlisted ? <FaHeart color="#ef4444" size={16} /> : <FaRegHeart color="#111827" size={16} />}
        </button>

        {/* Info Overlay - Title, Details, Rating */}
        <div className={styles.cardInfoOverlay}>
          <div className={styles.cardInfoLeft}>
            {/* Dots */}
            {images.length > 1 && (
              <div className={styles.dotsOverlay} style={{position: 'static', transform: 'none', marginBottom: '6px'}}>
                {images.map((_, idx) => (
                  <div key={idx} className={idx === currentImgIdx ? styles.dotActive : styles.dot}></div>
                ))}
              </div>
            )}
            <h3 className={styles.carTitle}>
              {car.make} {car.model} {car.year || '2023'}
            </h3>
            <p className={styles.carSubtitle}>
              {car.transmission_type} <span className={styles.dotSeparator}></span> {car.fuel_type} <span className={styles.dotSeparator}></span> {car.seating_capacity} Seats
            </p>
          </div>
          
          <div className={styles.cardInfoRight}>
            <div className={styles.ratingPill}>
              <FaStar color="#f59e0b" size={10} /> 5.0 <span style={{color: '#6b7280', fontWeight: 400}}>(8)</span>
            </div>
            <span className={styles.ratingText}>Excellent</span>
          </div>
        </div>
      </div>

      {/* 2. Footer Section */}
      <div className={styles.cardFooter}>
        <div className={styles.footerLeft}>
          {/* <span className={styles.featureTag}>
            <img src="https://zoomcar-assets.zoomcar.com/images/original/4272e0b00685e69a33baee4773378e1b4494ea63.png?1746712467" alt="delivery" />
            Delivery Available
          </span> */}
          <span className={styles.featureTag}>
            <img src="/icons/location-icon.png" alt="loc" />
            {car.distance_km ? `${car.distance_km} km away` : `in ${city}`}
          </span>
        </div>

        <div className={styles.footerRight}>
          <div className={styles.priceRow}>
            <span className={styles.priceHour}>₹{Math.round((car.base_daily_rate || 0) / 24)}</span>
            <span className={styles.priceUnit}>/hr</span>
          </div>
        </div>
      </div>

    </div>
  );
}

// Helper function to calculate distance
// Helper to calculate distance
function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Expanded tabs state
  const [expandedTabs, setExpandedTabs] = useState({
    price: true,
    details: true,
    seats: true,
    brand: false, // collapsed by default
  });

  const city = searchParams.get("city");
  const pickup = searchParams.get("pickupTime");
  const returndate = searchParams.get("returnTime");

  // Extract coordinates and address from URL parameters (sent from SearchBar)
  const userLat = searchParams.get("lat");
  const userLon = searchParams.get("lon");
  const currentAddress = searchParams.get("address") || "";

  // Location picker modal state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  
  // Calendar modal state
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [pickupHour, setPickupHour] = useState(9);
  const [returnHour, setReturnHour] = useState(17);

  // Initialize calendar state from URL params
  useEffect(() => {
    if (pickup) {
      // Parse DD/MM/YYYY HH:MM format
      const parts = pickup.split(' ');
      if (parts.length >= 2) {
        const datePart = parts[0].split('/');
        const timePart = parts[1].split(':');
        if (datePart.length === 3) {
          const date = new Date(
            parseInt(datePart[2]), // year
            parseInt(datePart[1]) - 1, // month (0-indexed)
            parseInt(datePart[0]), // day
            parseInt(timePart[0]) || 9, // hour
            0 // minutes always 0
          );
          setPickupDate(date);
          setPickupHour(parseInt(timePart[0]) || 9);
        }
      }
    }
    if (returndate) {
      const parts = returndate.split(' ');
      if (parts.length >= 2) {
        const datePart = parts[0].split('/');
        const timePart = parts[1].split(':');
        if (datePart.length === 3) {
          const date = new Date(
            parseInt(datePart[2]),
            parseInt(datePart[1]) - 1,
            parseInt(datePart[0]),
            parseInt(timePart[0]) || 17,
            0
          );
          setReturnDate(date);
          setReturnHour(parseInt(timePart[0]) || 17);
        }
      }
    }
  }, [pickup, returndate]);

    /* ------------------- UNIFIED FILTER STATE ------------------- */
  // 'filters' is the ONE source of truth.
  // We initialize price with default bounds, will update when data loads.
  const [filters, setFilters] = useState({
    type: "",
    fuel: "",
    transmission: "",
    seats: "",
    year: "",
    brand: "",
    price: { min: 0, max: 2000 }, // Object structure
    gps: false,
    ac: false,
  });

  // 'pendingFilters' is used for MOBILE interaction only. 
  // On desktop, it stays in sync with 'filters' immediately.
  const [pendingFilters, setPendingFilters] = useState(filters);

  // Sync pending filters when main filters change (e.g. initial load or desktop updates)
  useEffect(() => {
    setPendingFilters(filters);
  }, [filters]);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [showFilters, setShowFilters] = useState(true); // Default desktop show
  const [isMobile, setIsMobile] = useState(false);

  // Handle Resize for logic switching
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 900;
      setIsMobile(mobile);
      if (!mobile) setShowFilters(true); // Force show on desktop
      else if (showFilters && !mobile) setShowFilters(false); // Only close if moving to mobile? logic up to preference
    };
    
    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide global footer on this page only
  useEffect(() => {
    // Add a class to body to hide footer via CSS instead of DOM manipulation
    document.body.classList.add('hide-footer');
    
    return () => {
      document.body.classList.remove('hide-footer');
    };
  }, []);

  // Helper to update state based on device type
  const updateFilter = (key, value) => {
    if (isMobile) {
      setPendingFilters(prev => ({ ...prev, [key]: value }));
    } else {
      // Desktop: update immediately
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  // Specific helper for nested price object updates
  const updatePrice = (newPriceObj) => {
    if (isMobile) {
      setPendingFilters(prev => ({ ...prev, price: newPriceObj }));
    } else {
      setFilters(prev => ({ ...prev, price: newPriceObj }));
    }
  };

  // Specific handlers for Price Slider logic (prevent crossing)
  const handleMinPrice = (val) => {
    const currentMax = isMobile ? pendingFilters.price.max : filters.price.max;
    // Guard: min cannot bypass max - 50
    const newMin = Math.min(val, currentMax - 50);
    
    updatePrice({
      min: newMin,
      max: currentMax
    });
  };

  const handleMaxPrice = (val) => {
    const currentMin = isMobile ? pendingFilters.price.min : filters.price.min;
    // Guard: max cannot go below min + 50
    const newMax = Math.max(val, currentMin + 50);

    updatePrice({
      min: currentMin,
      max: newMax
    });
  };

  // debounce ONLY the authoritative filters for API calls
  const debouncedFilters = useDebounce(filters, 500);

  // Apply button (Mobile Only)
  const applyMobileFilters = () => {
    setFilters(pendingFilters);
    setShowFilters(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset
  const resetFilters = () => {
    const resetState = {
      type: "",
      fuel: "",
      transmission: "",
      seats: "",
      year: "",
      brand: "",
      price: priceRange, // Reset to full range
      gps: false,
      ac: false,
    };
    setFilters(resetState);
    setPendingFilters(resetState);
  };

  // Prepare user coordinates from URL parameters
  const userLocation = userLat && userLon ? {
    lat: parseFloat(userLat),
    lon: parseFloat(userLon)
  } : null;

  // Verify coordinates are valid numbers
  const isValidLocation = userLocation &&
    !isNaN(userLocation.lat) &&
    !isNaN(userLocation.lon) &&
    userLocation.lat !== 0 &&
    userLocation.lon !== 0;

  // Get address for display (fallback to city if no address provided)
  const searchAddress = searchParams.get("address");
  const displayLocation = searchAddress || city;

  // ---- fetch cars from Supabase via API ----
  useEffect(() => {
    async function fetchCars() {
      if (!city) return;
      setLoading(true);

      try {
        const params = new URLSearchParams({ city });

        // Add pickup and return times for availability check
        if (pickup) params.append("pickupTime", pickup);
        if (returndate) params.append("returnTime", returndate);

        // Add filters (Only authoritative debouncedFilters)
        Object.entries(debouncedFilters).forEach(([key, val]) => {
          if (key === 'price') {
            // Send price only if it differs from default range (optional optimization, or just send always)
             params.append('priceMin', val.min.toString());
             params.append('priceMax', val.max.toString());
          } else if (val && val !== false) {
            params.append(key, val.toString());
          }
        });

        // Sync URL with user selection (shallow replace)
        // router.replace(`?${params.toString()}`, { scroll: false }); 
        // Note: Next.js router.replace might re-trigger server components or page scroll depending on config.
        // For now we just fetch data.

        const res = await fetch(`/api/cars?${params.toString()}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }

        const data = await res.json();

        // Calculate distance logic...
        const enriched = data.map((car) => {
          if (isValidLocation && car.latitude && car.longitude) {
            car.distance_km = calcDistance(
              userLocation.lat,
              userLocation.lon,
              car.latitude,
              car.longitude
            );
          } else {
            car.distance_km = null;
          }
          return car;
        });

        setCars(enriched);

        // Extract brands from current results - always update to reflect available options
        const uniqueBrands = [...new Set(data.map(car => car.make).filter(Boolean))].sort();
        setBrands(uniqueBrands);

        // Calculate price range ONCE on initial load or if we want dynamic ranges
        // Better: Keep global range static based on initial widest search, 
        // or just default wide (0-2000) and let user filter. 
        // We won't override priceRange constantly to avoid slider jumping.
        
        // If it's the very first load and we have data, maybe set limits?
        // simple logic: keep 0-2000 as sticky defaults.

      } catch (e) {
        console.error("Error fetching cars:", e);
        setCars([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, userLat, userLon, debouncedFilters, pickup, returndate]);

  // Determine which state to show in UI (pending for mobile, authoritative for desktop)
  const uiFilters = isMobile ? pendingFilters : filters;

  // Handle location selection from modal
  const handleLocationSelect = (location) => {
    const newCity = location.city || city;
    const params = new URLSearchParams({
      city: newCity,
      pickupTime: pickup,
      returnTime: returndate,
      lat: location.lat,
      lon: location.lon,
      address: location.address,
    });
    
    sessionStorage.setItem("lastSearchParams", params.toString());
    router.push(`/search?${params.toString()}`);
  };

  // Handle date/time selection from calendar modal
  const handleDateSelect = (newPickupDate, newReturnDate, newPickupHour, newReturnHour) => {
    // Format dates for URL
    const formatDateTime = (date, hour) => {
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const year = d.getFullYear();
      const hourStr = hour.toString().padStart(2, '0');
      return `${day}/${month}/${year} ${hourStr}:00`;
    };
    
    const newPickup = formatDateTime(newPickupDate, newPickupHour);
    const newReturn = formatDateTime(newReturnDate, newReturnHour);
    
    const params = new URLSearchParams({
      city: city,
      pickupTime: newPickup,
      returnTime: newReturn,
      lat: userLat || '',
      lon: userLon || '',
      address: currentAddress,
    });
    
    sessionStorage.setItem("lastSearchParams", params.toString());
    router.push(`/search?${params.toString()}`);
  };

  // Format pickup/return for display like "14 Jan" and "7PM"
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return { date: '--', time: '--' };
    
    // Parse "16/01/2026 09:00" format
    const parts = dateStr.split(' ');
    if (parts.length < 2) return { date: dateStr, time: '' };
    
    const datePart = parts[0];
    const timePart = parts[1];
    
    const dateParts = datePart.split('/');
    if (dateParts.length !== 3) return { date: dateStr, time: '' };
    
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const hour = parseInt(timePart.split(':')[0]);
    const displayHour = hour === 0 ? '12AM' : hour === 12 ? '12PM' : hour > 12 ? `${hour - 12}PM` : `${hour}AM`;
    
    return {
      date: `${day} ${months[month]}`,
      time: displayHour
    };
  };

  const pickupDisplay = formatDateForDisplay(pickup);
  const returnDisplay = formatDateForDisplay(returndate);

  // Truncate address for display
  const displayAddress = currentAddress 
    ? (currentAddress.length > 40 ? currentAddress.substring(0, 40) + '...' : currentAddress)
    : (city ? city : 'Select Location');

  return (
    <div className={styles.container}>
      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelect={handleLocationSelect}
        currentAddress={currentAddress}
      />

      {/* Calendar Modal */}
      {isCalendarOpen && (
        <CalendarModal
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          initialPickupDate={pickupDate}
          initialReturnDate={returnDate}
          onApply={(start, end) => {
            const startHour = start.getHours();
            const endHour = end.getHours();
            handleDateSelect(start, end, startHour, endHour);
          }}
        />
      )}

      {/* Top Bar - Zoomcar Style */}
      <div className={styles.searchTopBar}>
        {/* Location Section */}
        <div 
          className={styles.searchLocation} 
          onClick={() => setIsLocationModalOpen(true)}
          role="button"
          tabIndex={0}
        >
          <div className={styles.locationIconCircle}>
            <FaMapMarkerAlt className={styles.locationIcon} />
          </div>
          <span className={styles.locationText}>{displayAddress}</span>
        </div>

        {/* Date/Time Section */}
        <div className={styles.searchDates}>
          {/* Pickup Date */}
          <div 
            className={styles.dateBlock}
            onClick={() => setIsCalendarOpen(true)}
            role="button"
            tabIndex={0}
          >
            <div className={styles.dateValue}>{pickupDisplay.date}</div>
            <div className={styles.timeValue}>{pickupDisplay.time}</div>
          </div>

          {/* Return Date */}
          <div 
            className={styles.dateBlock}
            onClick={() => setIsCalendarOpen(true)}
            role="button"
            tabIndex={0}
          >
            <div className={styles.dateValue}>{returnDisplay.date}</div>
            <div className={styles.timeValue}>{returnDisplay.time}</div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className={styles.main}>
        {/* Mobile Filter Toggle Button */}
        <button
          className={styles.mobileFilterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        {/* Sidebar Filters - Always render but hide if needed to avoid hydration/removal errors */}
        <aside className={styles.sidebar} style={{ display: showFilters ? undefined : 'none' }}>
            {/* NEW ACCORDION FILTER UI STRUCTURE */}
            <div className={styles.filtersContainer}>
              <div className={styles.filtersHeader}>
                <span style={{ marginRight: 'auto' }}>Filters</span>
                <button className={styles.reset} onClick={resetFilters}>
                  Reset All
                </button>
              </div>

              <div className={styles.filtersTabs}>

                {/* --- Total Price Tab --- */}
                <div className={styles.tab}>
                  <div 
                    className={styles.tabHeader} 
                    onClick={() => setExpandedTabs(p => ({...p, price: !p.price}))}
                  >
                    <span>Total Price</span>
                    <FaChevronDown style={{ transform: expandedTabs.price ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>
                  <div className={`${styles.tabContent} ${expandedTabs.price ? styles.open : ''}`}>
                    <div className={styles.rangeWrapper}>
                      <div className={styles.rangeLabels}>
                        <span>Min Price</span>
                        <span>Max Price</span>
                      </div>
                      <div className={styles.priceRange}>
                         {/* Reusing existing slider styles but inside new wrapper */}
                         <div
                          className={styles.rangeTrack}
                          style={{
                            "--min": ((uiFilters.price.min / priceRange.max) * 100),
                            "--max": ((uiFilters.price.max / priceRange.max) * 100),
                          }}
                        ></div>
                        <input
                          type="range"
                          min={priceRange.min}
                          max={priceRange.max}
                          step={50}
                          value={uiFilters.price.min}
                          className={styles.rangeInput}
                          onChange={(e) => handleMinPrice(parseInt(e.target.value))}
                        />
                        <input
                          type="range"
                          min={priceRange.min}
                          max={priceRange.max}
                          step={50}
                          value={uiFilters.price.max}
                          className={styles.rangeInput}
                          onChange={(e) => handleMaxPrice(parseInt(e.target.value))}
                        />
                      </div>
                      <div className={styles.priceValues}>
                        <span>₹{uiFilters.price.min}</span>
                        <span>₹{uiFilters.price.max}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- Car Details Tab (Type, Fuel, Transmission) --- */}
                <div className={styles.tab}>
                   <div 
                    className={styles.tabHeader} 
                    onClick={() => setExpandedTabs(p => ({...p, details: !p.details}))}
                  >
                    <span>Car Details</span>
                    <FaChevronDown style={{ transform: expandedTabs.details ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>
                  <div className={`${styles.tabContent} ${expandedTabs.details ? styles.open : ''}`}>
                    
                    {/* Car Type Section */}
                    <div className={styles.categorySection}>
                      <div className={styles.categoryTitle}>Filter By Car Typ</div>
                      <div className={styles.checkboxGroup}>
                        {["SUV", "Sedan", "Hatchback"].map((type) => (
                          <label key={type} className={styles.checkboxLabel}>
                            <input 
                              type="checkbox" 
                              className={styles.checkboxInput}
                              checked={uiFilters.type === type}
                              onChange={() => updateFilter("type", uiFilters.type === type ? "" : type)}
                            />
                            <span className={styles.checkboxText}>{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Transmission Section */}
                    <div className={styles.categorySection}>
                      <div className={styles.categoryTitle}>Filter By Transmission</div>
                      <div className={styles.checkboxGroup}>
                         {["Manual", "Automatic"].map((trans) => (
                          <label key={trans} className={styles.checkboxLabel}>
                            <input 
                              type="checkbox" 
                              className={styles.checkboxInput}
                              checked={uiFilters.transmission === trans}
                              onChange={() => updateFilter("transmission", uiFilters.transmission === trans ? "" : trans)}
                            />
                            <span className={styles.checkboxText}>{trans}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Fuel Type Section */}
                    <div className={styles.categorySection}>
                      <div className={styles.categoryTitle}>Filter By Fuel Type</div>
                      <div className={styles.checkboxGroup}>
                        {["Petrol", "Diesel", "Electric", "Hybrid"].map((fuel) => (
                          <label key={fuel} className={styles.checkboxLabel}>
                            <input 
                              type="checkbox" 
                              className={styles.checkboxInput}
                              checked={uiFilters.fuel === fuel}
                              onChange={() => updateFilter("fuel", uiFilters.fuel === fuel ? "" : fuel)}
                            />
                            <span className={styles.checkboxText}>{fuel}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* --- Seats Tab --- */}
                <div className={styles.tab}>
                   <div 
                    className={styles.tabHeader} 
                    onClick={() => setExpandedTabs(p => ({...p, seats: !p.seats}))}
                  >
                    <span>Seats</span>
                    <FaChevronDown style={{ transform: expandedTabs.seats ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>
                  <div className={`${styles.tabContent} ${expandedTabs.seats ? styles.open : ''}`}>
                    <div className={styles.checkboxGroup}>
                       {["5 seater", "7 seater"].map((seat) => (
                          <label key={seat} className={styles.checkboxLabel}>
                            <input 
                              type="checkbox" 
                              className={styles.checkboxInput}
                              checked={uiFilters.seats === seat}
                              onChange={() => updateFilter("seats", uiFilters.seats === seat ? "" : seat)}
                            />
                            <span className={styles.checkboxText}>{seat}</span>
                          </label>
                        ))}
                    </div>
                  </div>
                </div>

                {/* --- Brand Tab (using existing select logic but wrapped) --- */}
                 <div className={styles.tab}>
                   <div 
                    className={styles.tabHeader} 
                    onClick={() => setExpandedTabs(p => ({...p, brand: !p.brand}))}
                  >
                    <span>Brand</span>
                    <FaChevronDown style={{ transform: expandedTabs.brand ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </div>
                  <div className={`${styles.tabContent} ${expandedTabs.brand ? styles.open : ''}`}>
                     <div className={styles.customSelect}>
                        <select
                          value={uiFilters.brand || ""}
                          onChange={(e) => updateFilter("brand", e.target.value)}
                        >
                          <option value="">All Brands</option>
                          {brands.map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                        <FaChevronDown className={styles.chev} />
                      </div>
                  </div>
                </div>

              </div>
              
              {/* Mobile Apply Button (Inside sidebar container) */}
               <button className={styles.applyBtn} onClick={applyMobileFilters}>
                Apply Filters
              </button>
            </div>



        </aside>

        {/* Content Area */}
        <div className={styles.content}>
          {/* Secondary Bar - Result Count & Recommended */}
          <div className={styles.secondaryBar}>
            <div className={styles.resultCount}>
              {loading ? 'Loading...' : `${cars.length} vehicles in ${city || 'your area'}`}
            </div>
            <button className={styles.recommendedBtn}>
              Most Recommended
            </button>
          </div>

          {/* Active Filters Chips */}
          <div className={styles.activeFilters}>
            {Object.entries(filters).map(([key, val]) => {
              // Hide empty filters
              if (!val || (key === 'price' && val.min === 0 && val.max === 2000) || (key==='gps' && !val) || (key==='ac' && !val)) return null;

              return (
                <div key={key} className={styles.filterChip}>
                  {key === 'price' ? `₹${val.min} - ₹${val.max}` : val}
                  <button onClick={() => {
                     // Reset specific filter
                     if(key === 'price') updateFilter('price', {min: 0, max: 2000});
                     else updateFilter(key, "");
                  }}>✕</button>
                </div>
              );
            })}
          </div>

          {/* Independent Scrollable Results Card */}
          <div className={styles.resultsScrollableCard}>
            {loading ? (
              <div className={styles.grid}>
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <div key={s} className={styles.card}>
                    <div style={{ height: '200px', background: '#f0f0f0', borderRadius: '8px', marginBottom: '12px' }}></div>
                    <div style={{ height: '16px', background: '#f0f0f0', marginBottom: '8px' }}></div>
                    <div style={{ height: '14px', background: '#f0f0f0', width: '60%' }}></div>
                  </div>
                ))}
              </div>
            ) : cars.length === 0 ? (
              <p>No cars found matching your criteria.</p>
            ) : (
                <div className={styles.grid}>
                {cars.map((car) => (
                  <CarCard 
                    key={car.id} 
                    car={car} 
                    pickup={pickup} 
                    returndate={returndate} 
                    router={router} 
                    city={city}
                  />
                ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}