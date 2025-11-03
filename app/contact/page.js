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
  faTwitter 
} from '@fortawesome/free-brands-svg-icons';
// Note: faTwitter is used instead of faX-twitter for wider compatibility and a cleaner look.
// You can use faXTwitter if you specifically install that icon pack.
// ------------------------------------

export default function ContactPage() {
  return (
    <div className={styles.ccontainer}>
      {/* Left Section: Customer Support & Contact Info */}
      <div className={styles.cleftSection}>
        <h1 className={styles.cmainTitle}>Customer Support</h1>
        
        <p className={styles.cphone}>Phone: 9790609111</p>
        <p className={styles.cemail}>Email: mmmiles.chennai@gmail.com</p>
        
        <h2 className={styles.csectionTitle}>Find us on</h2>
        <div className={styles.csocialIcons}>
          {/* Replaced Image tags with FontAwesomeIcon components */}
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedinIn} style={{ width: '24px', height: '24px' }} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} style={{ width: '24px', height: '24px' }} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faPinterestP} style={{ width: '24px', height: '24px' }} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebookF} style={{ width: '24px', height: '24px' }} />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} style={{ width: '24px', height: '24px' }} />
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