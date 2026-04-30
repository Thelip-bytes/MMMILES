"use client";
import { useState, useEffect } from "react";

export default function Bookings() {
  const [viewBooking, setViewBooking] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchBookings = async (isManual = false, targetPage = 1) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/hub/bookings/list?page=${targetPage}&limit=10`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const now = new Date();
          const mappedBookings = json.data.map(b => {
            const start = new Date(b.start_time);
            const end = new Date(b.end_time);
            
            const diffInMs = end - start;
            const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60));
            
            const days = Math.floor(diffInHours / 24);
            const remainingHours = diffInHours % 24;
            let durationStr = '';
            if (days > 0) durationStr += `${days}d `;
            if (remainingHours > 0 || days === 0) durationStr += `${remainingHours}h`;

            let calculatedStatus = 'upcoming';
            if (b.status === 'completed' || b.status === 'cancelled' || now > end) {
              calculatedStatus = 'completed';
            } else if (now >= start && now <= end) {
              calculatedStatus = 'ongoing';
            }

            return {
              id: b.id,
              name: `${b.first_name || ''} ${b.last_name || ''}`.trim() || 'Unknown',
              phone: b.phone || 'N/A',
              duration: durationStr.trim(),
              car: b.registration_number || 'N/A',
              price: `Rs. ${b.total_amount || 0}`,
              status: calculatedStatus,
              start_time: b.start_time,
              end_time: b.end_time
            };
          });
          
          setBookings(mappedBookings);
          setPage(targetPage);
          setHasMore(json.hasMore);
          
          sessionStorage.setItem('ap_bookings', JSON.stringify({
            data: mappedBookings,
            page: targetPage,
            hasMore: json.hasMore
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const cached = sessionStorage.getItem('ap_bookings');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setBookings(parsed.data || []);
        setPage(parsed.page || 1);
        setHasMore(parsed.hasMore || false);
        setIsLoading(false);
        fetchBookings(false, parsed.page || 1);
      } catch (e) {
        fetchBookings(false, 1);
      }
    } else {
      fetchBookings(false, 1);
    }
  }, []);

  return (
    <div className="ap-booking-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="ap-booking-title" style={{ margin: 0 }}>Bookings</h1>
        <button 
          onClick={() => fetchBookings(true, page)} 
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
            '↻ Refresh Bookings'
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      <div className="ap-booking-search">
        <input placeholder="Type name, number plate, etc" />
        <span>🔍</span>
      </div>

      {isLoading ? (
        <p style={{ padding: "20px" }}>Loading bookings...</p>
      ) : (
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
              <button className="ap-btn view" onClick={() => { 
                setViewBooking(b); 
                // Format dates to datetime-local format (YYYY-MM-DDThh:mm)
                const sDate = new Date(b.start_time);
                const eDate = new Date(b.end_time);
                
                // Need to pad numbers
                const pad = (n) => n.toString().padStart(2, '0');
                
                if (b.start_time && b.end_time) {
                  setFromDate(`${sDate.getFullYear()}-${pad(sDate.getMonth() + 1)}-${pad(sDate.getDate())}T${pad(sDate.getHours())}:${pad(sDate.getMinutes())}`);
                  setToDate(`${eDate.getFullYear()}-${pad(eDate.getMonth() + 1)}-${pad(eDate.getDate())}T${pad(eDate.getHours())}:${pad(eDate.getMinutes())}`);
                } else {
                  setFromDate(""); 
                  setToDate("");
                }
              }}>View Date</button>
              <button className={`ap-btn status ${b.status}`}>
                {b.status === "completed" ? "Finished" : b.status === "ongoing" ? "Ongoing" : "Upcoming"}
              </button>
              <button className="ap-btn contact">Contact Host</button>
            </div>
          </div>
        ))}
        
        {(page > 1 || hasMore) && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '20px', padding: '15px 0' }}>
            <button 
              onClick={() => fetchBookings(true, page - 1)}
              disabled={page === 1 || isRefreshing}
              style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #c6a76e', background: 'transparent', color: '#333', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, fontWeight: '500' }}
            >
              Previous
            </button>
            <span style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>Page {page}</span>
            <button 
              onClick={() => fetchBookings(true, page + 1)}
              disabled={!hasMore || isRefreshing}
              style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #c6a76e', background: 'transparent', color: '#333', cursor: !hasMore ? 'not-allowed' : 'pointer', opacity: !hasMore ? 0.5 : 1, fontWeight: '500' }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      )}

      {/* VIEW POPUP */}
      {viewBooking && (
        <div className="ap-popup-overlay" onClick={() => setViewBooking(null)}>
          <div className="ap-popup-box ap-date-popup" onClick={(e) => e.stopPropagation()}>
            <h3 className="ap-popup-title">Car Number : <span>{viewBooking.car}</span></h3>
            <div className="ap-date-row" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', width: '100%', boxSizing: 'border-box' }}>
              <div className="ap-date-field" style={{ flex: 1, minWidth: '130px', maxWidth: '100%' }}>
                <label>FROM</label>
                <div style={{ background: '#e8e6e1', padding: '10px 12px', borderRadius: '8px', color: '#333', fontSize: '14px', fontWeight: '500', width: '100%', boxSizing: 'border-box', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {fromDate ? new Date(fromDate).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '') : 'N/A'}
                </div>
              </div>
              <div className="ap-date-field" style={{ flex: 1, minWidth: '130px', maxWidth: '100%' }}>
                <label>TO</label>
                <div style={{ background: '#e8e6e1', padding: '10px 12px', borderRadius: '8px', color: '#333', fontSize: '14px', fontWeight: '500', width: '100%', boxSizing: 'border-box', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {toDate ? new Date(toDate).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '') : 'N/A'}
                </div>
              </div>
            </div>
            <div className="ap-popup-buttons">
              <button className="ap-btn-cancel" onClick={() => setViewBooking(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}