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
          <li>Cancelling a booking will stop any future charges, but no refunds will be issued for unused rental periods.
          </li>
        </ul>
      </section>

      <section className="refund-section">
        <h2>2. Cancellations by the Customer</h2>
        <ul>
        <li>More than 24 hours before scheduled pickup: Customers may cancel and receive a full refund of the rental fee.</li>
        <li>Within 24 hours of scheduled pickup: The booking is non-refundable. The customer may reschedule (subject to vehicle availability) but no refund will be issued.</li>
        <li>No-show (failure to pick up vehicle): No refund will be provided.</li>
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
        <li>Returning vehicles before the agreed date/time will entitle the renter to a partial refund for unused time.</li>
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
