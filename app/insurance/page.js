"use client";
import "./insurance.css";

export default function RenterInsurance() {
  return (
    <main className="refund-container">
      <h1 className="refund-title"> Insurance & Protection Policy</h1>
      <p className="refund-subtitle">Effective Date: 01-10-2025</p>

      <section className="refund-section">
        <h2>1. Platform Role Clarification</h2>
        <ul>
          <li>MM Miles is a technology platform that connects vehicle owners (“Hosts”) with renters (“Users”).</li>
          <li>MM Miles does not own the vehicles listed on the platform and is not the primary insurer of such vehicles.</li>
          <li>All vehicles listed are owned by independent Hosts.</li>
          
        </ul>
      </section>

      <section className="refund-section">
        <h2>2. Base Vehicle Insurance</h2>
        
            <p>Each vehicle listed on MM Miles is required to maintain valid:</p>
            <ul>
        <li>Commercial Comprehensive Motor Insurance</li>
        <li>Third-party liability coverage as per Indian law</li>
        <li>Self-drive rental usage endorsement (where applicable)</li>
          </ul>
          <p>Insurance is maintained by the Host (vehicle owner).</p>
      </section>

     <section className="refund-section">
        <h2>3. Mandatory Renter Protection Plan</h2>
        <ul>
          <li>All renters must select a Damage Protection Plan at the time of booking. Bookings will not be confirmed without selecting a protection plan.</li>
          <li>The selected plan limits the renter’s financial liability in case of accidental damage.</li>
        </ul>
      </section>

      <section className="refund-section">
        <h2>4. Standard Damage Liability (Mandatory for All Bookings)</h2>
        <ul>
          <li>If any accidental external damage occurs during the trip, Renter must pay ₹4,500 per incident to the Host.</li>
          <li>Subject to vehicle inspection and verification.</li>
          <li>Covers minor dents, scratches, and external body damage.</li>
          <li>Not applicable in cases of:</li>
          <p>• Negligence</p>
          <p>• Drunk driving / intoxication</p>
          <p>• Violation of rental terms</p>
          <p>• Rash or illegal driving</p>
        </ul>
      </section>

      <section className="refund-section">
        <h2>5. What Is Covered</h2>
        <ul>
        <p>✔ Accidental collision damage</p>
        <p>✔ External body panel damage</p>
        <p>✔ Natural calamities (flood, fire, cyclone)</p>
        <p>✔ Theft (with FIR submission) processed under host’s insurance</p>
        <p>✔ Third-party claims (with FIR submission) processed under host’s insurance</p>
        </ul>
      </section>

      <section className="refund-section">
        <h2>6. Exclusions – Full Renter Liability Applies</h2>
        <p>Protection becomes void if:</p>
        <ul>
        <p>❌ Driving under influence of alcohol or drugs</p> 
        <p>❌ Driving without valid license</p> 
        <p>❌ Unauthorized driver operating vehicle</p> 
        <p>❌ Off-road or prohibited terrain usage</p> 
        <p>❌ Engine damage due to waterlogging negligence</p> 
        <p>❌ Interior damage (burns, stains, misuse)</p> 
        <p>❌ Tyre/clutch/suspension damage due to rash driving</p> 
        <p>❌ Failure to report accident within 2 hours</p> 
        </ul>
        <p>In such cases, renter is liable for full repair/replacement cost.</p>
      </section>

      <section className="refund-section">
        <h2>7. Accident & Claim Procedure</h2>
        <p>In case of accident or damage, renter must:</p>
        <ul>
        <p>1. Inform MM Miles within 2 hours</p>
          <p>2.	Share photos and videos immediately</p>
          <p>3.	File FIR where required</p>
           <p>4. Cooperate with Host, MM Miles, and insurer</p>
        </ul>
        <p>Failure to follow procedure may result in loss of protection benefits.</p>
      </section>

      <section className="refund-section">
        <h2>8. Payment Terms</h2>
        <ul>
        <li>Damage assessment will be conducted via authorized service centers.</li>
        <li>Renter must pay applicable liability amount immediately on the end of the trip.</li>
        <li>Non-payment may result in legal recovery action.</li>
        </ul>

        <section className="refund-section">
        <h2>9. Third-Party Liability Disclaimer</h2>
        <ul>
        <li>Third-party claims are processed under the Host’s motor insurance policy.</li>
        <li>MM Miles acts only as a platform facilitator and shall not be directly liable for third-party claims unless proven negligent under applicable law.</li>
        </ul>
      </section>

       <section className="refund-section">
        <h2>10. Jurisdiction</h2>
        <ul>
        <li>All disputes shall be subject to courts located in Chennai, Tamil Nadu</li>
        </ul>
      </section>


      </section>
    </main>
  );
}
