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
          const STORAGE_BASE_URL = "/api/sb/storage/v1/object/public/car-images/";
          const mappedCars = json.data.map(car => {
            const images = car.vehicle_images || [];
            const primaryImage = images.find((img) => img.is_primary) || images[0];
            let imgUrl = "/cars.jpg";
            if (primaryImage?.image_url) {
              imgUrl = primaryImage.image_url.startsWith("http")
                ? primaryImage.image_url
                : `${STORAGE_BASE_URL}${primaryImage.image_url}`;
            }

            return {
              id: car.id,
              name: `${car.make} ${car.model}`,
              year: car.model_year,
              plate: car.registration_number,
              status: car.available_status ? 'live' : 'blocked',
              hostId: car.host_id || 'N/A',
              hostName: car.hosts?.full_name || 'N/A',
              hostPhone: car.hosts?.phone || 'N/A',
              address: car.location_name || 'Location not provided',
              img: imgUrl
            };
          });
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
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="title" style={{ margin: 0 }}>Cars</h1>
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
        <div className="cars-grid">
          {cars.map((car) => (
            <div className="car-card" key={car.id}>
              <div className="car-top-section">
                <img src={car.img} className="car-img" alt={car.name} />
                <div className="car-right">
                  <h3 className="car-title">
                    {car.name} <span>( {car.year} )</span>
                  </h3>
                  <span className="plate">{car.plate}</span>
                  <div className="status-row">
                    <span className={`status ${car.status}`}>
                      {car.status}
                    </span>
                    <span
                      className="menu-dot"
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
              <div className="divider"></div>
              <div className="car-details">
                <div className="details-col left">
                  <p><b>Host ID:</b> #{car.hostId}</p>
                  <p><b>Host Name:</b> {car.hostName}</p>
                  <p><b>Host Phone:</b> {car.hostPhone}</p>
                </div>
                <div className="details-col right">
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
        <div className="popup-overlay" onClick={() => setSelectedCar(null)}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <h3 className="popup-title">
              {selectedCar.name} <span>( {selectedCar.year} )</span>
            </h3>
            <div className="popup-plate">
              {selectedCar.plate}
            </div>
            <div className="popup-actions">
              <div className="popup-item">
                <img src="/block.png" />
                <span>BLOCK</span>
              </div>
              <div className="popup-item" onClick={() => setActionType("maintain")}>
                <img src="/maintain.png" />
                <span>MAINTENANCE</span>
              </div>
              <div className="popup-item" onClick={() => setActionType("pause")}>
                <img src="/pause.png" />
                <span>PAUSE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= POPUP 2 ================= */}
      {selectedCar && actionType && (
        <div className="popup-overlay" onClick={() => setActionType(null)}>
          <div className="form-popup" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <img src={actionType === "pause" ? "/pause.png" : "/maintain.png"} className="form-icon" />
              <h3>{actionType === "pause" ? "PAUSE" : "MAINTENANCE"}</h3>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>FROM</label>
                <input type="datetime-local" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>TO</label>
                <input type="datetime-local" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
            </div>
            <div className="form-group full">
              <label>DESC</label>
              <input type="text" />
            </div>
            <div className="form-actions">
              <button className="cancel" onClick={() => setActionType(null)}>Cancel</button>
              <button className="submit" onClick={() => setShowConfirm(true)}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CONFIRM POPUP ================= */}
      {showConfirm && (
        <div className="popup-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <h3>SUCCESS</h3>
            <p>Request submitted successfully</p>
            <div className="confirm-details">
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