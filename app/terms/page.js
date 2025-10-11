"use client";
import "./terms.css";

export default function TermsPage() {
  return (
    <main className="terms-container">
      <h1 className="terms-title">Terms of Use</h1>
      <p className="last-updated">Last Updated: September 07, 2025</p>

      <section className="privacy-section">
        <p>
       These Terms & Conditions (“Agreement”) govern the use of vehicles provided by MM MILES (“Company”) to customers (“Renter/Driver”). By booking or driving a vehicle from MM MILES, you agree to comply with the following :
        </p>
      </section>

      <section className="terms-section">
        <h2>1. Eligibility & Documentation</h2>
        <ul>
          <li>Minimum driver age is 21 years.</li>
          <li>Renter must present a valid driving license and government-issued ID proof (Aadhar/Passport/PAN).</li>
          <li>Only drivers listed at the time of booking are authorized to drive. Unauthorized driving will void insurance and attract penalties.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>2. Booking, Payment & Security Deposit</h2>
        <ul>
          <li>A booking is confirmed only after full payment of rental charges and security deposit.</li>
          <li>Security deposit is refundable, subject to deductions for damages, fuel shortage, fines, tolls, or late returns.</li>
          <li>Extension of booking is subject to availability and must be approved in advance.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>3. Vehicle Usage & Prohibited Activities</h2>
        <ul>
          <li>The vehicle must be used responsibly and returned in the same condition.</li>
          <li>The vehicle must not be used for :</li>
          <p>-  Racing, speed testing, or off-roading.</p>
          <p>-  Commercial passenger or goods transport.</p>
          <p>-  Driving under the influence of alcohol, drugs, or narcotics.</p>
          <p>-  Illegal activities, carrying hazardous items, or towing.</p>
          <p>-	Exceeding permitted geographical limits without approval.</p>
          <li>Speed Limit: 120 km/h. Breach may attract penalties, fines, and repeated violations may lead to permanent blacklisting.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>4. Fuel, Kilometers & Maintenance</h2>
        <ul>
          <li>Vehicles are provided with fuel; renters must return them with the same level.</li>
          <li>Each booking includes a fixed kilometer limit. Extra kilometers will be charged at the agreed rate.</li>
          <li>Renters must immediately report any mechanical issues, warning lights, or breakdowns.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>5. Insurance, Damage & Liability</h2>
        <ul>
          <li>All vehicles are insured with standard motor insurance.</li>
          <li>In case of an accident :</li>
          <p>-  The renter must immediately inform MM MILES and local authorities.</p>
          <p>-  An FIR may be required where applicable.</p>
          <p>-  Insurance claims are subject to terms of the insurer.</p>
          <li>Renter is liable for :</li>
          <p>-  Damages due to negligent or unauthorized use.</p>
          <p>-	Insurance deductibles not covered by policy.</p>
          <p>-	Tyre damage, interior damage, or loss of accessories.</p>
          <p>-	Traffic fines, challans, and penalties incurred during rental.</p>
        </ul>
      </section>

      <section className="terms-section">
        <h2>6. Theft, Loss & Accidents</h2>
        <ul>
          <li>In case of theft or total loss of vehicle, renter must file an FIR and cooperate with insurance claim.</li>
          <li>Until insurance settlement, renter remains liable for the vehicle.</li>
          <li>Any delay or non-cooperation may result in forfeiture of the security deposit and additional recovery charges.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>7. Late Return & Cancellation</h2>
        <ul>
          <li>Late returns will attract :</li>
          <p>-  Hourly charges for delays up to 4 hours.</p>
          <p>-	Full-day charges if beyond 4 hours.</p>
          <li>Cancellation Policy :</li>
          <p>-	More than 24 hrs before trip: 90% refund.</p>
          <p>-	Within 24 hrs: 50% refund.</p>
          <p>-	No-show: No refund.</p>
          <li>Any delay or non-cooperation may result in forfeiture of the security deposit and additional recovery charges.</li>
        </ul>
      </section>

       <section className="terms-section">
        <h2>8. Cleanliness & Conduct</h2>
        <ul>
          <li>Smoking, alcohol, or drug consumption inside the vehicle is strictly prohibited.</li>
          <li>Extra cleaning charges apply for stains, spills, or foul odor.</li>
          <li>Renters are expected to treat the vehicle with care and return it in good condition.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>9. Privacy, Tracking & Data</h2>
        <ul>
          <li>Vehicles may be GPS-enabled for safety and misuse prevention.</li>
          <li>By renting with MM MILES, you consent to data collection related to driving behavior, trip records, and location tracking./</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>10. Indemnity & Governing Law</h2>
        <ul>
          <li>The renter agrees to indemnify and hold MM MILES harmless from all claims, damages, losses, or legal costs arising from misuse of the vehicle.</li>
          <li>This agreement is governed by the laws of Tamil Nadu, India.</li>
          <li>All disputes shall be subject to the exclusive jurisdiction of courts in Chennai.</li>
        </ul>
      </section>

      <p className="terms-footer">
        ⚠️ MM MILES reserves the right to cancel, terminate, or refuse bookings in case of invalid documents, unsafe driving, or breach of these Terms & Conditions.</p>
      <p>Drive safe. Drive responsibly. Drive with MM MILES.</p>
    </main>
  );
}
