"use client";
import Image from "next/image";
import "./about.css";

export default function AboutPage() {
  return (
    <div className="about-page">
      
      {/* Banner Section */}
      <section className="about-banner">
        <div className="banner-text">
          <h1>We’re Here to Drive With You</h1>
          <p>Your Drive.<br />Our Commitment.</p>
        </div>
        <div className="banner-img">
          <Image src="/about banner.png" alt="Car Banner" width={500} height={300} />
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="about-text">
          <h2>About Us</h2>
          <p>
            At MM Miles, we bring car rentals simple, affordable, and
            convenient. From luxury cars to budget-friendly rides, we ensure
            you get the best driving experience.
          </p>
          <p>
            Flexible plans, effortless booking, and 24/7 support — everything
            to make your trip smooth, whether it’s business or leisure.
          </p>
        </div>
        <div className="about-img">
          <Image src="/about car.png" alt="Car Illustration" width={300} height={200} />
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="team-member">
          <Image src="/ko1.jpg" alt="Team Member" width={120} height={120} className="team-img" />
          <h4>Harisha</h4>
          <p>CEO & Founder</p>
        </div>
        <div className="team-member">
          <Image src="/1.jpg" alt="Team Member" width={120} height={120} className="team-img" />
          <h4>Tushara</h4>
          <p>Co-Founder</p>
        </div>
      </section>

      {/* Vision & Mission */}
<section className="vision-mission">
  <div className="vision">
    <Image src="/vision.png" alt="Vision Icon" width={80} height={80} className="vm-icon" />
    <h3>Our Vision</h3>
    <p>
      Advance sustainable mobility with innovative car rental solutions.
    </p>
  </div>
  <div className="mission">
    <Image src="/mission.png" alt="Mission Icon" width={80} height={80} className="vm-icon" />
    <h3>Our Mission</h3>
    <p>
      To provide travelers with freedom, comfort, and affordability
      through modern car rental services.
    </p>
  </div>
</section>


    {/* Goals / Commitments */}
<section className="goals-section">
  <h3>Our Commitment to UN SDG Goals</h3>
  <div className="goals">
    <div className="goal">
      <Image src="/viewers.png" alt="Sustainability Goal" width={60} height={60} className="goal-icon" />
      <p>50 Million+ Rides</p>
    </div>
    <div className="goal">
      <Image src="/viewers.png" alt="Customer Goal" width={60} height={60} className="goal-icon" />
      <p>15 Million+ Customers</p>
    </div>
    <div className="goal">
      <Image src="/viewers.png" alt="Miles Driven Goal" width={60} height={60} className="goal-icon" />
      <p>2 Billion+ Miles Driven</p>
    </div>
  </div>
</section>
    </div>
  );
}
