import React from "react";
import "./AdvantageSection.css"; // Import the CSS file

const AdvantageSection = () => {
  return (
    <div className="advantage-body">
    <section className="advantage-section">
      <div className="advantage-container">
        <h2>Smart Choice, Drive More, Worry Less </h2>
        <p className="subtitle">The Self-Drive Advantage</p>

        <div className="advantage-grid">
          <div className="advantage-card">
            <img src="/1.jpg" alt="Car" />
            <p>Unlimited km to drive</p>
          </div>
          <div className="advantage-card">
            <img src="/2.jpg" alt="Location" />
            <p>100+ Locations in 15 cities</p>
          </div>
          <div className="advantage-card">
            <img src="/3.jpg" alt="Delivery" />
            <p>Home and Airport Delivery</p>
          </div>
          <div className="advantage-card">
            <img src="/4.jpg" alt="Privacy" />
            <p>Privacy &amp; Freedom</p>
          </div>
          <div className="advantage-card">
            <img src="/5.jpg" alt="Happy" />
            <p>Happy Faces of Our Customers</p>
          </div>
          <div className="advantage-card">
            <img src="/6.jpg" alt="City" />
            <p>15+ Cities Across India</p>
          </div>
          <div className="advantage-card">
            <img src="/7.jpg" alt="Insurance" />
            <p>Fully Covered Insurance</p>
          </div>
          <div className="advantage-card">
            <img src="/8.jpg" alt="Rating" />
            <p>4.5 / 5 <br></br>20k+ reviewers</p>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default AdvantageSection;