"use client";
import { useState } from "react";

export default function Bookings() {
  const [viewBooking, setViewBooking] = useState(null);
  const [extendBooking, setExtendBooking] = useState(null);
  const [successPopup, setSuccessPopup] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const bookings = [
    { id: 1, name: "Harish", phone: "9945686287", duration: "32hours", car: "KA16ES3033", price: "Rs. 2999", status: "completed" },
    { id: 2, name: "Dilip", phone: "9945686287", duration: "22hours", car: "KA16ES3022", price: "Rs. 2099", status: "ongoing" },
    { id: 3, name: "Tushara", phone: "9945686287", duration: "14hours", car: "TN16ES3022", price: "Rs. 1099", status: "in2days" },
  ];

  return (
    <div className="ap-booking-container">
      <h1 className="ap-booking-title">Bookings</h1>

      <div className="ap-booking-search">
        <input placeholder="Type name, number plate, etc" />
        <span>🔍</span>
      </div>

      <div className="ap-booking-list">
        {bookings.map((b, index) => (
          <div className="ap-booking-row" key={b.id}>
            <div className="ap-booking-left">
              <span className="ap-col ap-index">{index + 1}.</span>
              <span className="ap-col ap-name">{b.name}</span>
              <span className="ap-col ap-phone">{b.phone}</span>
              <span className="ap-col ap-duration">{b.duration}</span>
              <span className="ap-col ap-car">{b.car}</span>
              <span className="ap-col ap-price">{b.price}</span>
            </div>
            <div className="ap-booking-actions">
              <button className="ap-btn view" onClick={() => { setViewBooking(b); setFromDate(""); setToDate(""); }}>View Date</button>
              {b.status !== "completed" && (
                <button className="ap-btn extend" onClick={() => { setExtendBooking(b); setFromDate(""); setToDate(""); }}>EXTEND</button>
              )}
              <button className={`ap-btn status ${b.status}`}>
                {b.status === "completed" ? "Finished" : b.status === "ongoing" ? "Ongoing" : "Upcoming"}
              </button>
              <button className="ap-btn contact">Contact Host</button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW POPUP */}
      {viewBooking && (
        <div className="ap-popup-overlay" onClick={() => setViewBooking(null)}>
          <div className="ap-popup-box ap-date-popup" onClick={(e) => e.stopPropagation()}>
            <h3 className="ap-popup-title">Car Number : <span>{viewBooking.car}</span></h3>
            <div className="ap-date-row">
              <div className="ap-date-field">
                <label>FROM</label>
                <input type="datetime-local" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="ap-date-field">
                <label>TO</label>
                <input type="datetime-local" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
            </div>
            <div className="ap-popup-buttons">
              <button className="ap-btn-cancel" onClick={() => setViewBooking(null)}>Cancel</button>
              <button className="ap-btn-delete">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* EXTEND POPUP */}
      {extendBooking && (
        <div className="ap-popup-overlay" onClick={() => setExtendBooking(null)}>
          <div className="ap-popup-box ap-date-popup" onClick={(e) => e.stopPropagation()}>
            <h3 className="ap-popup-title">Car Number : <span>{extendBooking.car}</span></h3>
            <div className="ap-date-row">
              <div className="ap-date-field">
                <label>FROM</label>
                <input type="datetime-local" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="ap-date-field">
                <label>TO</label>
                <input type="datetime-local" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
            </div>
            <div className="ap-popup-buttons">
              <button className="ap-btn-extend" onClick={() => { setExtendBooking(null); setSuccessPopup(true); setTimeout(() => setSuccessPopup(false), 2000); }}>Extend</button>
              <button className="ap-btn-cancel" onClick={() => setExtendBooking(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {successPopup && (
        <div className="ap-popup-overlay">
          <div className="ap-popup-box ap-success-popup">
            <h3 className="ap-success-text">Successfully Extended the Car</h3>
          </div>
        </div>
      )}
    </div>
  );
}