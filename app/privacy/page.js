"use client";
import "./privacy.css";

export default function PrivacyPage() {
  return (
    <main className="privacy-container">
      <h1 className="privacy-title">Privacy Policy</h1>
      <p className="last-updated">Last Updated: September 07, 2025</p>
      
      <section className="privacy-section">
        <p>
        At MM MILES, your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your information when you use our services. By booking with MM MILES, you consent to the practices described below.
        </p>
      </section>

      <section className="privacy-section">
        <h2>1. Information We Collect</h2>
        <ul>
          <li>Personal details (Name, Email, Phone, Driving License)</li>
          <li>Payment details (only processed securely, not stored)</li>
          <li>Usage data (bookings, website/app interactions)</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To confirm and manage bookings</li>
          <li>For customer support</li>
          <li>To improve our services & ensure safety</li>
          <li>For legal compliance when required</li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>3. Data Protection & Security</h2>
        <ul><li>
          We take appropriate measures to safeguard your information with
          encryption, secure servers, and restricted access.
        </li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>4. Your Rights</h2>
        <ul>
        <li>
          You may access, update, or request deletion of your personal data by
          contacting our support team.
        </li>
        </ul>
      </section>

      <p className="privacy-footer">
        ⚠️ MM MILES is committed to protecting your privacy while ensuring safe
        and reliable car rental services.
      </p>
    </main>
  );
}
