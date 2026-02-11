"use client";
import "./refund.css";

export default function RefundPolicyPage() {
  return (
    <main className="refund-container">
      <h1 className="refund-title">Refund and Cancellation Policy</h1>
      <p className="refund-subtitle">Your satisfaction is our priority</p>

      <section className="refund-section">
        <h2>1. General Policy</h2>
        <ul>
          <li>All rental payments are billed upfront at the time of booking.</li>
          <li>Payments are non-refundable once processed, except as specified below.</li>
          
        </ul>
      </section>

      <section className="refund-section">
        <h2>2. Cancellations by the Customer</h2>
        <ul>
        <li>More than 24 hours before scheduled pickup: are eligible for a 90% refund of the rental fees.</li>
        <li>Cancellations made less than 24 hours but more than 4 hours before pickup will receive a 50% refund of the rental fees.</li>
        <li>Cancellations made within 4 hours of the scheduled pickup time are non-refundable, as the vehicle and resources are fully committed for your journey.</li>
          </ul>
      </section>

     <section className="refund-section">
        <h2>3. Cancellations by MM Miles</h2>
        <ul>
          <li>If MM Miles is unable to provide the reserved vehicle due to mechanical issues, unavailability, or other reasons, we will :</li>
          <p>-  Provide a vehicle of similar or higher category at no additional cost, OR</p>
          <p>-  Issue a full refund of the rental fee if no suitable replacement is available.</p>
        </ul>
      </section>

      <section className="refund-section">
        <h2>4. Early Returns</h2>
        <ul>
        <li>Returning vehicles before the agreed date/time will entitle the renter to a no refund for unused time.</li>
        </ul>
      </section>

      <section className="refund-section">
        <h2>5. Modifications</h2>
        <ul>
        <li>Booking modifications (dates, times, or vehicle type) are subject to availability and may result in adjusted fees.</li> 
        <li>Refunds will not apply for downgrades or shortened rental periods.</li>
        </ul>
      </section>

      <section className="refund-section">
        <h2>6. Exceptions</h2>
        <ul>
        <li>Refunds may not be considered on a case-by-case in the event of :</li>
          <p>- Verified duplicate charges</p>
          <p>- Extenuating circumstances, at MM Miles’ sole discretion</p>
        </ul>
      </section>

      <section className="refund-section">
        <h2>7. Refund Processing</h2>
        <ul>
        <li>Approved refunds will be processed back to the original payment method within 2–3 business days.</li>
        </ul>
      </section>
    </main>
  );
}
