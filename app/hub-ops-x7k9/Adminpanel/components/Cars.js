"use client";
import { useState, useEffect } from "react";

export default function Cars() {
  const [selectedCar, setSelectedCar] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCars = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch('/api/hub/cars');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const mappedCars = json.data.map(car => ({
            id: car.id,
            name: `${car.make} ${car.model}`,
            year: car.model_year,
            plate: car.registration_number,
            status: car.available_status ? 'live' : 'blocked',
            hostId: car.host_id || 'N/A',
            hostName: car.hosts?.full_name || 'N/A',
            hostPhone: car.hosts?.phone || 'N/A',
            address: car.location_name || 'Location not provided'
          }));
          setCars(mappedCars);
          sessionStorage.setItem('ap_cars', JSON.stringify(mappedCars));
        }
      }
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    } finally {
      setIsLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Attempt to load from cache to prevent the "Loading..." flash
    const cachedCars = sessionStorage.getItem('ap_cars');
    if (cachedCars) {
      setCars(JSON.parse(cachedCars));
      setIsLoading(false);
    }

    // Always fetch in background to stay synced with DB
    fetchCars(false);
  }, []);

  return (
    <div className="ap-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="ap-title" style={{ margin: 0 }}>Cars</h1>
        <button 
          onClick={() => fetchCars(true)} 
          disabled={isRefreshing}
          style={{
            backgroundColor: '#c6a76e',
            color: 'black',
            borderRadius: '18px',
            padding: '6px 16px',
            fontSize: '12px',
            border: 'none',
            cursor: isRefreshing ? 'not-allowed' : 'pointer',
            fontFamily: "'Poppins', sans-serif",
            opacity: isRefreshing ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isRefreshing ? (
            <>
              <span style={{ width: '14px', height: '14px', border: '2px solid #000', borderBottomColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}></span>
              Syncing Database...
            </>
          ) : (
            '↻ Refresh Cars'
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      {isLoading ? (
        <p style={{ padding: "20px" }}>Loading cars...</p>
      ) : (
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
                  <p><b>Host ID:</b> #{car.hostId}</p>
                  <p><b>Host Name:</b> {car.hostName}</p>
                  <p><b>Host Phone:</b> {car.hostPhone}</p>
                </div>
                <div className="ap-details-right">
                  <p>
                    <b>Host Address:</b> {car.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
                <span>MAINTENANCE</span>
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
              <h3>{actionType === "pause" ? "PAUSE" : "MAINTENANCE"}</h3>
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