"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./car4.module.css";
// import Navbar from "../components/Navbar"; // You can uncomment these if you have them
// import Footer from "../components/Footer";
import Counter from "../components/Counter"; 

import animatedCardStyles from "./animatedCard.module.css";


// Data for the "Explore More Cars" cards
const exploreCardsData = [
  {
    id: 1,
    image: "/explore-cards/explorecar.jpg", // Use paths relevant to the new image assets
    title: "Toyota Innova Crysta",
    rating: "4.3/5",
    price: "₹150",
    unit: "per Hour",
  },
  {
    id: 2,
    image: "/explore-cards/explorecar.jpg", 
    title: "Toyota Innova Iagnen",
    rating: "4.7/5",
    price: "₹150",
    unit: "per Hour",
  },
  {
    id: 3,
    image: "/explore-cards/explorecar.jpg",
    title: "Toyota Inug700",
    rating: "4.2/5",
    price: "₹100",
    unit: "per Hour",
  },
];






// Data for the FAQ section
const faqData = [
  {
    id: 1,
    question: "What safety features does the Innova Crysta include?",
    answer: "It includes 7 airbags, ABS with EBD, vehicle stability control, and hill assist. These features enhance passenger protection.",
  },
  {
    id: 2,
    question: "How many people can the Innova Crysta accommodate?",
    answer: "It is available in 7-seater and 8-seater configurations. Its spacious cabin ensures superior comfort, even on long trips.",
  },
  {
    id: 3,
    question: "What is the mileage of the Toyota Innova Crysta?",
    answer: "The diesel variant offers around 15–16 km/l, while the petrol gives about 10–12 km/l. Mileage may vary on driving style and road conditions.",
  },
  {
    id: 4,
   question: "Does the Innova Crysta have a good boot space?",
   answer: "Yes, it provides ample luggage capacity even with all seats up. You can easily fold the third-row seats for extra space during long journeys.",
  },
  {
    id: 5,
    question: "Does the Innova Crysta have climate control features?",
    answer: "Yes, it comes with automatic climate control and rear AC vents. This ensures a pleasant cabin temperature across all the rows.",
  },
  {
    id: 6,
    question: "How reliable is Innova in terms of performance and maintenance?",
    answer: "It offers long-term durability and low upkeep. Regular servicing ensures excellent performance and high resale value.",

  },
];

// Data for the new "Blur Cards" section
const blurCardsData = [
  { id: 1, title: "Service", subtext: "low maintenance costs", color: "blue" },
  { id: 2, title: "Display", subtext: "8 inch LED", color: "green" },
  { id: 3, title: "Safety", subtext: "7 SRS airbags", color: "cyan" },
  { id: 4, title: "Engine", subtext: "2393 CC", color: "blue" },
  { id: 5, title: "Clean", subtext: "Sanitized before every rental", color: "green" },
  { id: 6, title: "Precaution", subtext: "Routine clean for the appearance ", color: "cyan" },
];
// Data for the new stats section
const statsData = [
    { number: "2022", label: "Car Model" },
    { number: "3990", label: "Driven Record" },
    { number: "012", label: "Kilometer / liter" },
    { number: "170", label: "Top speed / hour" },
];

// Data for the new features section
const bookingFeatures = [
    "Clean Cars and Excellent Service",
    "Trusted by over 1M+ Customers",
    "On-time pickup and dropoff",
    "Verified chauffeurs and vehicles",
    "Instant booking and confirmation"
];
// Sample data for the car details
const carDetails = {
  name: "Toyota Innova CRYSTA",
  pricePerDay: 2999,
  description: "The Toyota Innova Crysta is a premium MPV known for its powerful performance, spacious interiors, and unmatched reliability. It offers both petrol and diesel engines with manual and automatic transmission options. It combines comfort, safety, and style in every journey.",
  

  // Combine all images and the video into a single array of objects
  allImages: [
    { src: "/innova1.jpg", type: "image" },
    { src: "/innova2.jpg", type: "image" },
    { src: "/innova3.jpg", type: "image" },
    { src: "/innova4.jpg", type: "image" },
    //{ src: "/carvideo.png", type: "video" }, // Added a type property for the video
    { src: "/innova5.jpg", type: "image" },
    
    
  ],
  
  insurancePlans: [
    { name: "MAX", price: 629, description: "Only pay Rs.2000 in case of any accidental damage." },
    { name: "PLUS", price: 569, description: "Only pay Rs.7999 in case of any accidental damage." },
    { name: "BASIC", price: 469, description: "Only pay Rs.9999 in case of any accidental damage." },
  ],
};

export default function Car2Page() {
  const [activePlan, setActivePlan] = useState("MAX");
  // State to track the currently displayed main media (image or video).
  // Initialize with the first media object from the 'allImages' array.
  const [currentMainMedia, setCurrentMainMedia] = useState(carDetails.allImages[0]);
   


  // State to hold the transform style for each card
    const [hoveredCard, setHoveredCard] = useState(null);

    // Mouse move handler
    const handleMouseMove = (e, id) => {
      const card = e.currentTarget;
      const { top, left, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 20; // 20 is a sensitivity factor
      const y = (e.clientY - top - height / 2) / 20; // 20 is a sensitivity factor

      setHoveredCard({
        id,
        transform: `perspective(1000px) rotateX(${y}deg) rotateY(${-x}deg) scale(1.05)`,
      });
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      setHoveredCard(null);
    };




  // Function to handle thumbnail clicks and update the main media
  const handleThumbnailClick = (mediaObject) => {
    setCurrentMainMedia(mediaObject);
  };

  return (
    <div className={styles.container}>
      
      {/* <Navbar /> */}

      {/* --- Main Content Section --- */}
      <div className={styles.contentWrapper}>
        {/* --- Left Column: Images --- */}
        <div className={styles.leftColumn}>
          {/* Main image/video display, conditionally rendering based on media type */}
          <div className={styles.mainImage}>
            {currentMainMedia.type === "video" ? (
              <video 
                src={currentMainMedia.src}
                className={styles.videoPlayer}
                controls
                autoPlay
                muted
                loop
              />
            ) : (
              <Image
                src={currentMainMedia.src}
                alt={carDetails.name}
                fill
                style={{ objectFit: 'cover' }}
                priority 
              />
            )}
          </div>

          {/* Thumbnails display */}
          <div className={styles.thumbnails}>
            {carDetails.allImages.map((media, index) => (
              <div 
                key={index} 
                className={`${styles.thumbnail} ${media.src === currentMainMedia.src ? styles.activeThumbnail : ''}`}
                onClick={() => handleThumbnailClick(media)} // Pass the entire media object
              >
                {/* Conditionally render thumbnail content based on media type */}
                {media.type === "video" ? (
                    // This is a thumbnail for the video. You can use an image with a play icon.
                    <div className={styles.videoThumbnailIcon}>
                      <Image
                          src="/video-thumbnail.png" // You'll need to create this thumbnail image
                          alt="Play Video"
                          fill
                          style={{ objectFit: 'cover' }}
                      />
                    </div>
                ) : (
                    // This is a standard image thumbnail
                    <Image
                        src={media.src}
                        alt={`${carDetails.name} - View ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- Right Column: Details & Actions --- */}
        <div className={styles.rightColumn}>
          <h1 className={styles.carName}>{carDetails.name}</h1>
          <p className={styles.priceTag}>
            <span className={styles.startingAt}>STARTING AT</span>
            <br />
            <span className={styles.priceValue}>Rs.{carDetails.pricePerDay}</span>
            <span className={styles.priceUnit}>/day</span>
          </p>
          <p className={styles.description}>{carDetails.description}</p>
          
          {/* --- Insurance Plans --- */}
          <div className={styles.insuranceSection}>
            <p className={styles.travelConfident}>Travel with confidence</p>
            <div className={styles.plansContainer}>
              {carDetails.insurancePlans.map(plan => (
                <div
                  key={plan.name}
                  className={`${styles.planBox} ${activePlan === plan.name ? styles.activePlan : ''}`}
                  onClick={() => setActivePlan(plan.name)}
                >
                  <span className={styles.planName}>{plan.name}</span>
                  <p className={styles.planPrice}>Rs.{plan.price}</p>
                  <p className={styles.planDesc}>{plan.description}</p>
                </div>
              ))}
            </div>
            <Link href="#" className={styles.learnMore}>Learn More &gt;</Link>
          </div>
          
          {/* --- Action Buttons --- */}
          <div className={styles.actionButtons}>
            <button className={styles.bookBtn}>Book now</button>
            <button className={styles.addCartBtn}>Add to cart</button>
          </div>
        </div>
      </div>


        {/* --- New "Stats" Section --- */}
            <div className={styles.statsSection}>
              
                <div className={styles.statsContainer}>
                    {statsData.map((stat, index) => (
                        <Counter 
                            key={index} 
                            value={stat.number} 
                            label={stat.label}
                            // Pass the styles object to the Counter component
                            styles={styles} 
                        />
                    ))}
                </div>
            </div>

        {/* --- New "Car Location" Section --- */}
            <div className={styles.locationSection}>
                <div className={styles.worldMapContainer}>
                    <Image
                        src="/chennai-map.png" // ✅ You need a single world map image here
                        alt="World Map"
                        fill
                        className={styles.worldMapImage}
                    />
                    {/* Text content placed on top of the map */}
                    <div className={styles.locationTextContent}>
                        <h2></h2>
                        
                    </div>
                </div>
            </div>



            {/* --- New "Blur Cards" Section --- */}
            <div className={styles.blurCardsSection}>
              <div className={styles.blurHeader}>
                <h3>Key Feature of INNOVA CRYSTA</h3>
              </div>
              <div className={styles.blurCardsContainer}>
                {blurCardsData.map((card) => (
                  <div 
                    key={card.id} 
                    className={`${styles.blurCard} ${styles[card.color]}`}
                  >
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardSubtext}>{card.subtext}</p>
                  </div>
                ))}
              </div>
            </div>


            {/* --- New "FAQ" Section --- */}
            <div className={styles.faqSection}>
              <div className={styles.faqHeader}>
                <h3>Looking for help? Here are our most frequently asked questions</h3>
              </div>
              <div className={styles.faqGrid}>
                {faqData.map((item) => (
                  <div key={item.id} className={styles.faqCard}>
                    <div className={styles.faqNumber}>{item.id}</div>
                    <h4 className={styles.faqQuestion}>{item.question}</h4>
                    <p className={styles.faqAnswer}>{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

          


           {/* --- Explore More Cars Section --- */}
<div className={styles.exploreSection}>
  <h2 className={styles.exploreTitle}>Explore more Cars</h2>
  <div className={styles.exploreCardsGrid}>
    {exploreCardsData.map((card) => (
      <Link 
        href="#" 
        key={card.id} 
        className={styles.exploreCardLink}
        onMouseMove={(e) => handleMouseMove(e, card.id)} // Keep magnetic effect logic
        onMouseLeave={handleMouseLeave}
        style={hoveredCard && hoveredCard.id === card.id ? { transform: hoveredCard.transform, zIndex: 10 } : null}
      >
        <div className={styles.exploreCard}>
          
          {/* Rating Badge (Star Icon & Text) */}
          <div className={styles.carRatingBadge}>
             <span role="img" aria-label="star">★</span> {card.rating}
          </div>

          <div className={styles.exploreCardImageWrapper}>
            <Image
              src={card.image}
              alt={card.title}
              fill
              className={styles.exploreCardImage}
            />
          </div>

          <div className={styles.exploreCardContent}>
            {/* Car Title */}
            <h3 className={styles.exploreCardTitle}>{card.title}</h3>

            {/* Price and Action Section */}
            <div className={styles.carActionRow}>
              <p className={styles.carPrice}>
                <span className={styles.carPriceAmount}>{card.price}</span>
                <span className={styles.carPriceUnit}> {card.unit}</span>

                <button className={styles.bookNowButton}>
                Book Now
              </button>
              </p>
              
              
            </div>
          </div>
        </div>
      </Link>
    ))}
  </div>
</div>

           


           {/* --- Animated Card Section with three cards --- 
           <h1 className={animatedCardStyles.sectionTitle}>Our Key Features</h1>
            <div className={animatedCardStyles.animatedCardSection}>
              
              
              <div className={animatedCardStyles.card}>
                <h3 className={animatedCardStyles.cardTitle}>Why Choose Us?</h3>
                <div className={animatedCardStyles.border}></div>
                <div className={animatedCardStyles.content}>
                  <div className={animatedCardStyles.logo}>
                    <div className={animatedCardStyles.logo1}>
                      
                      <svg viewBox="0 0 29.667 31.69" xmlns="/http://www.w3.org/2000/svg" id="logo-main">
                        <path transform="translate(0 0)" d="M12.827,1.628A1.561,1.561,0,0,1,14.31,0h2.964a1.561,1.561,0,0,1,1.483,1.628v11.9a9.252,9.252,0,0,1-2.432,6.852q-2.432,2.409-6.963,2.409T2.4,20.452Q0,18.094,0,13.669V1.628A1.561,1.561,0,0,1,1.483,0h2.98A1.561,1.561,0,0,1,5.947,1.628V13.191a5.635,5.635,0,0,0,.85,3.451,3.153,3.153,0,0,0,2.632,1.094,3.032,3.032,0,0,0,2.582-1.076,5.836,5.836,0,0,0,.816-3.486Z" data-name="Path 6" id="Path_6"></path>
                        <path transform="translate(-45.91 0)" d="M75.207,20.857a1.561,1.561,0,0,1-1.483,1.628h-2.98a1.561,1.561,0,0,1-1.483-1.628V1.628A1.561,1.561,0,0,1,70.743,0h2.98a1.561,1.561,0,0,1,1.483,1.628Z" data-name="Path 7" id="Path_7"></path>
                        <path transform="translate(0 -51.963)" d="M0,80.018A1.561,1.561,0,0,1,1.483,78.39h26.7a1.561,1.561,0,0,1,1.483,1.628v2.006a1.561,1.561,0,0,1-1.483,1.628H1.483A1.561,1.561,0,0,1,0,82.025Z" data-name="Path 8" id="Path_8"></path>
                      </svg>
                    </div>
                    <div className={animatedCardStyles.logo2}>
                     
                      <svg viewBox="0 0 101.014 23.535" xmlns="http://www.w3.org/2000/svg" id="logo-second">
                        <g transform="translate(-1029.734 -528.273)">
                          <path transform="translate(931.023 527.979)" d="M109.133,14.214l3.248-11.706A1.8,1.8,0,0,1,114.114,1.2h2.229a1.789,1.789,0,0,1,1.7,2.358L111.884,21.71a1.8,1.8,0,0,1-1.7,1.216h-3a1.8,1.8,0,0,1-1.7-1.216L99.317,3.554a1.789,1.789,0,0,1,1.7-2.358h2.229a1.8,1.8,0,0,1,1.734,1.312l3.248,11.706a.468.468,0,0,0,.9,0Z" data-name="Path 1" id="Path_1"></path>
                          <path transform="translate(888.72 528.773)" d="M173.783,22.535a10.77,10.77,0,0,1-7.831-2.933,10.387,10.387,0,0,1-3.021-7.813v-.562A13.067,13.067,0,0,1,164.2,5.372,9.315,9.315,0,0,1,167.81,1.4,10.176,10.176,0,0,1,173.136,0,9.105,9.105,0,0,1,180.2,2.812q2.576,2.812,2.577,7.973v.583a1.793,1.793,0,0,1-1.8,1.787H169.407a.466.466,0,0,0-.457.564,5.08,5.08,0,0,0,5.217,4.136A6.594,6.594,0,0,0,178.25,16.6a1.817,1.817,0,0,1,2.448.218l.557.62a1.771,1.771,0,0,1-.1,2.488,9.261,9.261,0,0,1-2.4,1.57,11.732,11.732,0,0,1-4.972,1.034ZM173.115,4.68A3.66,3.66,0,0,0,170.3,5.85,6.04,6.04,0,0,0,168.911,9.2h8.125V8.735a4.305,4.305,0,0,0-1.051-3,3.781,3.781,0,0,0-2.87-1.059Z" data-name="Path 2" id="Path_2"></path>
                          <path transform="translate(842.947 528.771)" d="M244.851,3.928a1.852,1.852,0,0,1-1.95,1.76c-.1,0-.2,0-.3,0a7.53,7.53,0,0,0-2.234.3,3.275,3.275,0,0,0-2.348,3.1V20.347a1.844,1.844,0,0,1-1.9,1.787h-2.366a1.844,1.844,0,0,1-1.9-1.787V1.751A1.391,1.391,0,0,1,233.294.4h3.043a1.4,1.4,0,0,1,1.428,1.265l.035.533a.282.282,0,0,0,.5.138A5.617,5.617,0,0,1,242.988,0h.031a1.832,1.832,0,0,1,1.864,1.813l-.032,2.114Z" data-name="Path 3" id="Path_3"></path>
                          <path transform="translate(814.555 528.773)" d="M287.2,16.127a1.869,1.869,0,0,0-1.061-1.677,12.11,12.11,0,0,0-3.406-1.095q-7.8-1.627-7.8-6.587a5.956,5.956,0,0,1,2.415-4.83A9.781,9.781,0,0,1,283.659,0a10.536,10.536,0,0,1,6.659,1.948,6.36,6.36,0,0,1,2.029,2.586,1.791,1.791,0,0,1-1.661,2.475h-2.291a1.754,1.754,0,0,1-1.624-1.137,2.7,2.7,0,0,0-.606-.922,3.435,3.435,0,0,0-2.526-.814,3.512,3.512,0,0,0-2.284.663,2.088,2.088,0,0,0-.808,1.687,1.786,1.786,0,0,0,.92,1.557,9.485,9.485,0,0,0,3.1,1.024,25.5,25.5,0,0,1,3.678.974q4.627,1.687,4.628,5.844a5.659,5.659,0,0,1-2.567,4.81,11.125,11.125,0,0,1-6.629,1.838,11.627,11.627,0,0,1-4.881-.974,8.173,8.173,0,0,1-3.345-2.671,6.843,6.843,0,0,1-.679-1.174,1.784,1.784,0,0,1,1.653-2.492h1.9a1.786,1.786,0,0,1,1.673,1.133,2.8,2.8,0,0,0,.925,1.237,4.587,4.587,0,0,0,2.87.824,4.251,4.251,0,0,0,2.536-.632,1.965,1.965,0,0,0,.859-1.657Z" data-name="Path 4" id="Path_4"></path>
                          <path transform="translate(772.607 528.773)" d="M348.648,22.535a10.77,10.77,0,0,1-7.832-2.933,10.386,10.386,0,0,1-3.021-7.813v-.562a13.067,13.067,0,0,1,1.273-5.854A9.314,9.314,0,0,1,342.676,1.4,10.174,10.174,0,0,1,348,0a9.1,9.1,0,0,1,7.063,2.812q2.576,2.812,2.577,7.973v.583a1.793,1.793,0,0,1-1.8,1.787H344.272a.467.467,0,0,0-.457.564,5.081,5.081,0,0,0,5.217,4.136,6.594,6.594,0,0,0,4.083-1.251,1.817,1.817,0,0,1,2.448.218l.557.62a1.771,1.771,0,0,1-.1,2.488,9.26,9.26,0,0,1-2.4,1.57,11.731,11.731,0,0,1-4.972,1.034ZM347.981,4.68a3.659,3.659,0,0,0-2.819,1.17A6.035,6.035,0,0,0,343.777,9.2H351.9V8.735a4.307,4.307,0,0,0-1.051-3,3.781,3.781,0,0,0-2.87-1.059Z" data-name="Path 5" id="Path_5"></path>
                        </g>
                      </svg>
                    </div>
                    <span className={animatedCardStyles.trail}></span>
                  </div>
                  <span className={animatedCardStyles.logoBottomText}>uiverse.io</span>
                </div>
                <span className={animatedCardStyles.bottomText}>universe of ui</span>
              </div>

              
              <div className={animatedCardStyles.card}>
                <div className={animatedCardStyles.border}></div>
                <div className={animatedCardStyles.content}>
                  <div className={animatedCardStyles.logo}>
                    <div className={animatedCardStyles.logo1}>
                      
                      <svg viewBox="0 0 29.667 31.69" xmlns="http://www.w3.org/2000/svg" id="logo-main">
                        <path transform="translate(0 0)" d="M12.827,1.628A1.561,1.561,0,0,1,14.31,0h2.964a1.561,1.561,0,0,1,1.483,1.628v11.9a9.252,9.252,0,0,1-2.432,6.852q-2.432,2.409-6.963,2.409T2.4,20.452Q0,18.094,0,13.669V1.628A1.561,1.561,0,0,1,1.483,0h2.98A1.561,1.561,0,0,1,5.947,1.628V13.191a5.635,5.635,0,0,0,.85,3.451,3.153,3.153,0,0,0,2.632,1.094,3.032,3.032,0,0,0,2.582-1.076,5.836,5.836,0,0,0,.816-3.486Z" data-name="Path 6" id="Path_6"></path>
                        <path transform="translate(-45.91 0)" d="M75.207,20.857a1.561,1.561,0,0,1-1.483,1.628h-2.98a1.561,1.561,0,0,1-1.483-1.628V1.628A1.561,1.561,0,0,1,70.743,0h2.98a1.561,1.561,0,0,1,1.483,1.628Z" data-name="Path 7" id="Path_7"></path>
                        <path transform="translate(0 -51.963)" d="M0,80.018A1.561,1.561,0,0,1,1.483,78.39h26.7a1.561,1.561,0,0,1,1.483,1.628v2.006a1.561,1.561,0,0,1-1.483,1.628H1.483A1.561,1.561,0,0,1,0,82.025Z" data-name="Path 8" id="Path_8"></path>
                      </svg>
                    </div>
                    <div className={animatedCardStyles.logo2}>
                      
                      <svg viewBox="0 0 101.014 23.535" xmlns="http://www.w3.org/2000/svg" id="logo-second">
                        <g transform="translate(-1029.734 -528.273)">
                          <path transform="translate(931.023 527.979)" d="M109.133,14.214l3.248-11.706A1.8,1.8,0,0,1,114.114,1.2h2.229a1.789,1.789,0,0,1,1.7,2.358L111.884,21.71a1.8,1.8,0,0,1-1.7,1.216h-3a1.8,1.8,0,0,1-1.7-1.216L99.317,3.554a1.789,1.789,0,0,1,1.7-2.358h2.229a1.8,1.8,0,0,1,1.734,1.312l3.248,11.706a.468.468,0,0,0,.9,0Z" data-name="Path 1" id="Path_1"></path>
                          <path transform="translate(888.72 528.773)" d="M173.783,22.535a10.77,10.77,0,0,1-7.831-2.933,10.387,10.387,0,0,1-3.021-7.813v-.562A13.067,13.067,0,0,1,164.2,5.372,9.315,9.315,0,0,1,167.81,1.4,10.176,10.176,0,0,1,173.136,0,9.105,9.105,0,0,1,180.2,2.812q2.576,2.812,2.577,7.973v.583a1.793,1.793,0,0,1-1.8,1.787H169.407a.466.466,0,0,0-.457.564,5.08,5.08,0,0,0,5.217,4.136A6.594,6.594,0,0,0,178.25,16.6a1.817,1.817,0,0,1,2.448.218l.557.62a1.771,1.771,0,0,1-.1,2.488,9.261,9.261,0,0,1-2.4,1.57,11.732,11.732,0,0,1-4.972,1.034ZM173.115,4.68A3.66,3.66,0,0,0,170.3,5.85,6.04,6.04,0,0,0,168.911,9.2h8.125V8.735a4.305,4.305,0,0,0-1.051-3,3.781,3.781,0,0,0-2.87-1.059Z" data-name="Path 2" id="Path_2"></path>
                          <path transform="translate(842.947 528.771)" d="M244.851,3.928a1.852,1.852,0,0,1-1.95,1.76c-.1,0-.2,0-.3,0a7.53,7.53,0,0,0-2.234.3,3.275,3.275,0,0,0-2.348,3.1V20.347a1.844,1.844,0,0,1-1.9,1.787h-2.366a1.844,1.844,0,0,1-1.9-1.787V1.751A1.391,1.391,0,0,1,233.294.4h3.043a1.4,1.4,0,0,1,1.428,1.265l.035.533a.282.282,0,0,0,.5.138A5.617,5.617,0,0,1,242.988,0h.031a1.832,1.832,0,0,1,1.864,1.813l-.032,2.114Z" data-name="Path 3" id="Path_3"></path>
                          <path transform="translate(814.555 528.773)" d="M287.2,16.127a1.869,1.869,0,0,0-1.061-1.677,12.11,12.11,0,0,0-3.406-1.095q-7.8-1.627-7.8-6.587a5.956,5.956,0,0,1,2.415-4.83A9.781,9.781,0,0,1,283.659,0a10.536,10.536,0,0,1,6.659,1.948,6.36,6.36,0,0,1,2.029,2.586,1.791,1.791,0,0,1-1.661,2.475h-2.291a1.754,1.754,0,0,1-1.624-1.137,2.7,2.7,0,0,0-.606-.922,3.435,3.435,0,0,0-2.526-.814,3.512,3.512,0,0,0-2.284.663,2.088,2.088,0,0,0-.808,1.687,1.786,1.786,0,0,0,.92,1.557,9.485,9.485,0,0,0,3.1,1.024,25.5,25.5,0,0,1,3.678.974q4.627,1.687,4.628,5.844a5.659,5.659,0,0,1-2.567,4.81,11.125,11.125,0,0,1-6.629,1.838,11.627,11.627,0,0,1-4.881-.974,8.173,8.173,0,0,1-3.345-2.671,6.843,6.843,0,0,1-.679-1.174,1.784,1.784,0,0,1,1.653-2.492h1.9a1.786,1.786,0,0,1,1.673,1.133,2.8,2.8,0,0,0,.925,1.237,4.587,4.587,0,0,0,2.87.824,4.251,4.251,0,0,0,2.536-.632,1.965,1.965,0,0,0,.859-1.657Z" data-name="Path 4" id="Path_4"></path>
                          <path transform="translate(772.607 528.773)" d="M348.648,22.535a10.77,10.77,0,0,1-7.832-2.933,10.386,10.386,0,0,1-3.021-7.813v-.562a13.067,13.067,0,0,1,1.273-5.854A9.314,9.314,0,0,1,342.676,1.4,10.174,10.174,0,0,1,348,0a9.1,9.1,0,0,1,7.063,2.812q2.576,2.812,2.577,7.973v.583a1.793,1.793,0,0,1-1.8,1.787H344.272a.467.467,0,0,0-.457.564,5.081,5.081,0,0,0,5.217,4.136,6.594,6.594,0,0,0,4.083-1.251,1.817,1.817,0,0,1,2.448.218l.557.62a1.771,1.771,0,0,1-.1,2.488,9.26,9.26,0,0,1-2.4,1.57,11.731,11.731,0,0,1-4.972,1.034ZM347.981,4.68a3.659,3.659,0,0,0-2.819,1.17A6.035,6.035,0,0,0,343.777,9.2H351.9V8.735a4.307,4.307,0,0,0-1.051-3,3.781,3.781,0,0,0-2.87-1.059Z" data-name="Path 5" id="Path_5"></path>
                        </g>
                      </svg>
                    </div>
                    <span className={animatedCardStyles.trail}></span>
                  </div>
                  <span className={animatedCardStyles.logoBottomText}>uiverse.io</span>
                </div>
                <span className={animatedCardStyles.bottomText}>universe of ui</span>
              </div>

            
              <div className={animatedCardStyles.card}>
                <div className={animatedCardStyles.border}></div>
                <div className={animatedCardStyles.content}>
                  <div className={animatedCardStyles.logo}>
                    <div className={animatedCardStyles.logo1}>
                      
                      <svg viewBox="0 0 29.667 31.69" xmlns="http://www.w3.org/2000/svg" id="logo-main">
                        <path transform="translate(0 0)" d="M12.827,1.628A1.561,1.561,0,0,1,14.31,0h2.964a1.561,1.561,0,0,1,1.483,1.628v11.9a9.252,9.252,0,0,1-2.432,6.852q-2.432,2.409-6.963,2.409T2.4,20.452Q0,18.094,0,13.669V1.628A1.561,1.561,0,0,1,1.483,0h2.98A1.561,1.561,0,0,1,5.947,1.628V13.191a5.635,5.635,0,0,0,.85,3.451,3.153,3.153,0,0,0,2.632,1.094,3.032,3.032,0,0,0,2.582-1.076,5.836,5.836,0,0,0,.816-3.486Z" data-name="Path 6" id="Path_6"></path>
                        <path transform="translate(-45.91 0)" d="M75.207,20.857a1.561,1.561,0,0,1-1.483,1.628h-2.98a1.561,1.561,0,0,1-1.483-1.628V1.628A1.561,1.561,0,0,1,70.743,0h2.98a1.561,1.561,0,0,1,1.483,1.628Z" data-name="Path 7" id="Path_7"></path>
                        <path transform="translate(0 -51.963)" d="M0,80.018A1.561,1.561,0,0,1,1.483,78.39h26.7a1.561,1.561,0,0,1,1.483,1.628v2.006a1.561,1.561,0,0,1-1.483,1.628H1.483A1.561,1.561,0,0,1,0,82.025Z" data-name="Path 8" id="Path_8"></path>
                      </svg>
                    </div>
                    <div className={animatedCardStyles.logo2}>
                      
                      <svg viewBox="0 0 101.014 23.535" xmlns="http://www.w3.org/2000/svg" id="logo-second">
                        <g transform="translate(-1029.734 -528.273)">
                          <path transform="translate(931.023 527.979)" d="M109.133,14.214l3.248-11.706A1.8,1.8,0,0,1,114.114,1.2h2.229a1.789,1.789,0,0,1,1.7,2.358L111.884,21.71a1.8,1.8,0,0,1-1.7,1.216h-3a1.8,1.8,0,0,1-1.7-1.216L99.317,3.554a1.789,1.789,0,0,1,1.7-2.358h2.229a1.8,1.8,0,0,1,1.734,1.312l3.248,11.706a.468.468,0,0,0,.9,0Z" data-name="Path 1" id="Path_1"></path>
                          <path transform="translate(888.72 528.773)" d="M173.783,22.535a10.77,10.77,0,0,1-7.831-2.933,10.387,10.387,0,0,1-3.021-7.813v-.562A13.067,13.067,0,0,1,164.2,5.372,9.315,9.315,0,0,1,167.81,1.4,10.176,10.176,0,0,1,173.136,0,9.105,9.105,0,0,1,180.2,2.812q2.576,2.812,2.577,7.973v.583a1.793,1.793,0,0,1-1.8,1.787H169.407a.466.466,0,0,0-.457.564,5.08,5.08,0,0,0,5.217,4.136A6.594,6.594,0,0,0,178.25,16.6a1.817,1.817,0,0,1,2.448.218l.557.62a1.771,1.771,0,0,1-.1,2.488,9.261,9.261,0,0,1-2.4,1.57,11.732,11.732,0,0,1-4.972,1.034ZM173.115,4.68A3.66,3.66,0,0,0,170.3,5.85,6.04,6.04,0,0,0,168.911,9.2h8.125V8.735a4.305,4.305,0,0,0-1.051-3,3.781,3.781,0,0,0-2.87-1.059Z" data-name="Path 2" id="Path_2"></path>
                          <path transform="translate(842.947 528.771)" d="M244.851,3.928a1.852,1.852,0,0,1-1.95,1.76c-.1,0-.2,0-.3,0a7.53,7.53,0,0,0-2.234.3,3.275,3.275,0,0,0-2.348,3.1V20.347a1.844,1.844,0,0,1-1.9,1.787h-2.366a1.844,1.844,0,0,1-1.9-1.787V1.751A1.391,1.391,0,0,1,233.294.4h3.043a1.4,1.4,0,0,1,1.428,1.265l.035.533a.282.282,0,0,0,.5.138A5.617,5.617,0,0,1,242.988,0h.031a1.832,1.832,0,0,1,1.864,1.813l-.032,2.114Z" data-name="Path 3" id="Path_3"></path>
                          <path transform="translate(814.555 528.773)" d="M287.2,16.127a1.869,1.869,0,0,0-1.061-1.677,12.11,12.11,0,0,0-3.406-1.095q-7.8-1.627-7.8-6.587a5.956,5.956,0,0,1,2.415-4.83A9.781,9.781,0,0,1,283.659,0a10.536,10.536,0,0,1,6.659,1.948,6.36,6.36,0,0,1,2.029,2.586,1.791,1.791,0,0,1-1.661,2.475h-2.291a1.754,1.754,0,0,1-1.624-1.137,2.7,2.7,0,0,0-.606-.922,3.435,3.435,0,0,0-2.526-.814,3.512,3.512,0,0,0-2.284.663,2.088,2.088,0,0,0-.808,1.687,1.786,1.786,0,0,0,.92,1.557,9.485,9.485,0,0,0,3.1,1.024,25.5,25.5,0,0,1,3.678.974q4.627,1.687,4.628,5.844a5.659,5.659,0,0,1-2.567,4.81,11.125,11.125,0,0,1-6.629,1.838,11.627,11.627,0,0,1-4.881-.974,8.173,8.173,0,0,1-3.345-2.671,6.843,6.843,0,0,1-.679-1.174,1.784,1.784,0,0,1,1.653-2.492h1.9a1.786,1.786,0,0,1,1.673,1.133,2.8,2.8,0,0,0,.925,1.237,4.587,4.587,0,0,0,2.87.824,4.251,4.251,0,0,0,2.536-.632,1.965,1.965,0,0,0,.859-1.657Z" data-name="Path 4" id="Path_4"></path>
                          <path transform="translate(772.607 528.773)" d="M348.648,22.535a10.77,10.77,0,0,1-7.832-2.933,10.386,10.386,0,0,1-3.021-7.813v-.562a13.067,13.067,0,0,1,1.273-5.854A9.314,9.314,0,0,1,342.676,1.4,10.174,10.174,0,0,1,348,0a9.1,9.1,0,0,1,7.063,2.812q2.576,2.812,2.577,7.973v.583a1.793,1.793,0,0,1-1.8,1.787H344.272a.467.467,0,0,0-.457.564,5.081,5.081,0,0,0,5.217,4.136,6.594,6.594,0,0,0,4.083-1.251,1.817,1.817,0,0,1,2.448.218l.557.62a1.771,1.771,0,0,1-.1,2.488,9.26,9.26,0,0,1-2.4,1.57,11.731,11.731,0,0,1-4.972,1.034ZM347.981,4.68a3.659,3.659,0,0,0-2.819,1.17A6.035,6.035,0,0,0,343.777,9.2H351.9V8.735a4.307,4.307,0,0,0-1.051-3,3.781,3.781,0,0,0-2.87-1.059Z" data-name="Path 5" id="Path_5"></path>
                        </g>
                      </svg>
                    </div>
                    <span className={animatedCardStyles.trail}></span>
                  </div>
                  <span className={animatedCardStyles.logoBottomText}>uiverse.io</span>
                </div>
                <span className={animatedCardStyles.bottomText}>universe of ui</span>
              </div>

            </div>

      {/* <Footer /> */}
    </div>
  );
}