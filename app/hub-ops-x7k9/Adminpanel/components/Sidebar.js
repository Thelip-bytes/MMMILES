"use client";

export default function Sidebar({ activeSection, onNavigate, onLogout }) {
  const items = [
    { key: "home", label: "Home" },
    { key: "cars", label: "Cars" },
    { key: "bookings", label: "Bookings" },
    { key: "offline", label: "Offline Booking" },
    { key: "maintainance", label: "Maintainance" },
    { key: "paused", label: "Paused Cars" },
  ];

  return (
    <div className="ap-sidebar">
      <div>
        <div className="ap-logo">
          <img src="/mlogo.png" className="ap-logo-img" alt="Logo" />
        </div>

        <div className="ap-menu">
          {items.map((item) => (
            <button
              key={item.key}
              className={`ap-menu-item ${activeSection === item.key ? "active" : ""}`}
              onClick={() => onNavigate(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <button className="ap-logout-btn" style={{ marginTop: 'auto' }} onClick={onLogout}>Logout</button>
    </div>
  );
}