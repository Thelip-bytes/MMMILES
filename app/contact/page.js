// File: app/contact/page.jsx

import React from 'react';
import Link from 'next/link';
// Remove the Image import since we are using FA icons
import Image from 'next/image'; 
import styles from './contact.module.css'; // Import the CSS module

// --- NEW IMPORTS FOR FONT AWESOME ---
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLinkedinIn, 
  faInstagram, 
  faPinterestP, 
  faFacebookF, 
  faTwitter, 
  faWhatsapp
} from '@fortawesome/free-brands-svg-icons';
// Note: faTwitter is used instead of faX-twitter for wider compatibility and a cleaner look.
// You can use faXTwitter if you specifically install that icon pack.
// ------------------------------------


export const metadata = {
  title: "Contact MM Miles | Self Drive Car Rental Chennai",
  description:
    "Contact MM Miles for self drive car rental in Chennai. Call +91 80509 53607, WhatsApp or email support@mmmiles.com. Available 24/7 for bookings and support.",
  alternates: {
    canonical: "https://www.mmmiles.com/contact",
  },
  openGraph: {
    title: "Contact MM Miles | Car Rental Chennai",
    description:
      "Get in touch with MM Miles. Call, WhatsApp or email — available 24/7 for bookings and support.",
    url: "https://www.mmmiles.com/contact",
  },
};


export default function ContactPage() {
  return (
    <div className={styles.ccontainer}>
      {/* Left Section: Customer Support & Contact Info */}
      <div className={styles.cleftSection}>
        <h1 className={styles.cmainTitle}>Customer Support</h1>
        
        <p className={styles.cphone}>Phone: 8050953607</p>
        <p className={styles.cemail}>Email: Support@mmmiles.com</p>
        
        <h2 className={styles.csectionTitle}>Find us on</h2>
        <div className={styles.csocialIcons}>
          {/* Replaced Image tags with FontAwesomeIcon components */}
          <a href="https://www.linkedin.com/company/mm-miles/?viewAsMember=true" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedinIn} style={{ width: '24px', height: '24px' }} />
          </a>
          <a href="https://www.instagram.com/mmmiles_official?igsh=NDI1dDgxamt6bWZ4" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} style={{ width: '24px', height: '24px' }} />
          </a>
          <a href="https://wa.me/+918050953607" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faWhatsapp} style={{ width: '24px', height: '24px' }} />
          </a>
          
          
        </div>
        
        <h2 className={styles.csectionTitle}>Corporate Office</h2>
        <p className={styles.caddress}>
          Plot No: 51, VGN Nagar phase-4, No: 62, Gurusamy Road, Nolambur, Ambattur Taluk, Tiruvallur district, Chennai-95, Tamilnadu.
        </p>
        
        
      </div>

      {/* Right Section: Image and Features */}
      <div className={styles.crightSection}>
        
        <div className={styles.cmainImageContainer}>
          {/* Use Image for the main car photo */}
          <Image src="/car-on-phone.jpg" alt="Car on Phone" layout="responsive" width={500} height={400} />
        </div>
        
      </div>
    </div>
  );
}