"use client";
import { useState } from "react";

export default function Cars() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const cars = [
    { id: 1, name: "Maruthi suzuki swift", year: 2025, plate: "TN-11-ES-3022", status: "live" },
    { id: 2, name: "Maruthi suzuki swift", year: 2023, plate: "TN-11-ES-4444", status: "blocked" },
    { id: 3, name: "Maruthi suzuki swift", year: 2025, plate: "TN-11-ES-3022", status: "paused" },
    { id: 4, name: "Maruthi suzuki swift", year: 2025, plate: "TN-11-ES-3022", status: "maintain" },
  ];

  return (
    <div className="ap-container">
      <h1 className="ap-title">Cars</h1>

      <div className="ap-cars-grid">
        {cars.map((car) => (
          <div className="ap-car-card" key={car.id}>
            <div className="ap-car-top">
              <img src="/cars.jpg" className="ap-car-img" />
              <div className="ap-car-right">
                <h3 className="ap-car-title">
                  {car.name} <span>( {car.year} )</span>
                </h3>
                <span className="ap-plate">{car.plate}</span>
                <div className="ap-status-row">
                  <span className={`ap-status ${car.status}`}>
                    {car.status}
                  </span>
                  <span
                    className="ap-menu-dot"
                    onClick={() => {
                      setSelectedCar(car);
                      setActionType(null);
                    }}
                  >
                    ⋮
                  </span>
                </div>
              </div>
            </div>
            <div className="ap-divider"></div>
            <div className="ap-car-details">
              <div className="ap-details-left">
                <p><b>Host ID:</b> #24</p>
                <p><b>Host Name:</b> Harisha</p>
                <p><b>Host Phone:</b> 9945686287</p>
              </div>
              <div className="ap-details-right">
                <p>
                  <b>Host Address:</b> Plot No: 51, VGN Nagar phase-4,
                  No: 62, Gurusamy Road, Nolambur, Ambattur Taluk,
                  Tiruvallur district, Chennai-95, Tamilnadu
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= POPUP 1 ================= */}
      {selectedCar && !actionType && (
        <div className="ap-popup-overlay" onClick={() => setSelectedCar(null)}>
          <div className="ap-popup-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="ap-popup-title">
              {selectedCar.name} <span>( {selectedCar.year} )</span>
            </h3>
            <div className="ap-popup-plate">
              {selectedCar.plate}
            </div>
            <div className="ap-popup-actions">
              <div className="ap-popup-item">
                <img src="/block.png" />
                <span>BLOCK</span>
              </div>
              <div className="ap-popup-item" onClick={() => setActionType("maintain")}>
                <img src="/maintain.png" />
                <span>MAINTAINANCE</span>
              </div>
              <div className="ap-popup-item" onClick={() => setActionType("pause")}>
                <img src="/pause.png" />
                <span>PAUSE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= POPUP 2 ================= */}
      {selectedCar && actionType && (
        <div className="ap-popup-overlay" onClick={() => setActionType(null)}>
          <div className="ap-form-popup" onClick={(e) => e.stopPropagation()}>
            <div className="ap-form-header">
              <img src={actionType === "pause" ? "/pause.png" : "/maintain.png"} className="ap-form-icon" />
              <h3>{actionType === "pause" ? "PAUSE" : "MAINTAINANCE"}</h3>
            </div>
            <div className="ap-form-row">
              <div className="ap-form-group">
                <label>FROM</label>
                <input type="datetime-local" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="ap-form-group">
                <label>TO</label>
                <input type="datetime-local" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
            </div>
            <div className="ap-form-group full">
              <label>DESC</label>
              <input type="text" />
            </div>
            <div className="ap-form-actions">
              <button className="ap-form-cancel" onClick={() => setActionType(null)}>Cancel</button>
              <button className="ap-form-submit" onClick={() => setShowConfirm(true)}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIRM POPUP ================= */}
      {showConfirm && (
        <div className="ap-popup-overlay" onClick={() => setShowConfirm(false)}>
          <div className="ap-confirm-box" onClick={(e) => e.stopPropagation()}>
            <h3>SUCCESS</h3>
            <p>Request submitted successfully</p>
            <div className="ap-confirm-details">
              <div>
                <span>FROM</span>
                <p>{new Date(fromDate).toLocaleString()}</p>
              </div>
              <div>
                <span>TO</span>
                <p>{new Date(toDate).toLocaleString()}</p>
              </div>
            </div>
            <button onClick={() => { setShowConfirm(false); setSelectedCar(null); setActionType(null); }}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}