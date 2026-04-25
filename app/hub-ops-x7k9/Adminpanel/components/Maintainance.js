"use client";
import { useState } from "react";

export default function Maintainance() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [data, setData] = useState([
    { id: 1, car: "KA16ES3033", model: "Innova crysta", color: "White" },
    { id: 2, car: "KA16ES3033", model: "Innova crysta", color: "White" },
    { id: 3, car: "KA16ES3033", model: "Innova crysta", color: "White" },
    { id: 5, car: "KA16ES3033", model: "Innova crysta", color: "White" },
    { id: 6, car: "KA16ES3033", model: "Innova crysta", color: "White" },
    { id: 4, car: "KA16ES3033", model: "Innova crysta", color: "White" }
  ]);

  const handleDelete = () => {
    setData(prev => prev.filter(item => item.id !== selectedCar.id));
    setSelectedCar(null);
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); }, 2000);
  };

  return (
    <div className="ap-maint-container">
      <h1 className="ap-maint-title">Maintainance</h1>

      <div className="ap-maint-top">
        <div className="ap-maint-search">
          <input placeholder="Type name, number plate, etc" />
          <span>🔍</span>
        </div>
        <button className="ap-maint-btn add">ADD CARS</button>
      </div>

      <div className="ap-maint-list">
        {data.map((item, index) => (
          <div className="ap-maint-row" key={item.id}>
            <div className="ap-maint-grid">
              <span className="ap-maint-gridp">{index + 1}.</span>
              <span className="ap-maint-gridp">{item.car}</span>
              <span className="ap-maint-gridp">{item.model}</span>
              <span className="ap-maint-gridp">{item.color}</span>
            </div>
            <div className="ap-maint-actions">
              <button
                className="ap-maint-btn"
                onClick={() => { setSelectedCar(item); setFromDate(""); setToDate(""); }}
              >
                View Dates
              </button>
              <button className="ap-maint-btn">Contact Host</button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MAIN POPUP ================= */}
      {selectedCar && (
        <div className="ap-popup-overlay" onClick={() => setSelectedCar(null)}>
          <div className="ap-maint-popup-box" onClick={(e) => e.stopPropagation()}>
            <div className="ap-maint-popup-content">
              <h3 className="ap-maint-popup-title">Car Number : <span>{selectedCar.car}</span></h3>
              <div className="ap-maint-date-row">
                <div className="ap-maint-date-field">
                  <label>FROM</label>
                  <input type="datetime-local" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div className="ap-maint-date-field">
                  <label>TO</label>
                  <input type="datetime-local" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
              </div>
              <div className="ap-maint-popup-buttons">
                <button className="ap-maint-btn danger" onClick={handleDelete}>Delete</button>
                <button className="ap-maint-btn cancel" onClick={() => setSelectedCar(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SUCCESS POPUP ================= */}
      {showSuccess && (
        <div className="ap-popup-overlay">
          <div className="ap-maint-popup-box small">
            <div className="ap-success-box">
              <div className="ap-success-icon">✔</div>
              <h3 className="ap-success-text">Successfully Deleted</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}