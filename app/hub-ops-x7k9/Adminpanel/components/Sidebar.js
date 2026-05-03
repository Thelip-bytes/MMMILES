"use client";
import { useState } from "react";

export default function Sidebar({ activeSection, onNavigate, onLogout }) {
  const [open, setOpen] = useState(false);

  const items = [
    { key: "home", label: "Home" },
    { key: "cars", label: "Cars" },
    { key: "bookings", label: "Bookings" },
    { key: "offline", label: "Offline Booking" },
    { key: "maintenance", label: "Maintenance" },
  ];

  const handleNav = (key) => {
    onNavigate(key);
    setOpen(false);
  };

  return (
    <>
      {/* ── MOBILE TOP NAV BAR ── */}
      <div className="ap-mobile-nav">
        <img src="/mlogo.png" className="ap-logo-img ap-mobile-logo" alt="Logo" />
        <div
          className={`ap-hamburger ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* ── SIDEBAR (desktop always visible, mobile slide-in) ── */}
      <div className={`ap-sidebar ${open ? "open" : ""}`}>
        <div>
          <div className="ap-logo ap-desktop-logo">
            <img src="/mlogo.png" className="ap-logo-img" alt="Logo" />
          </div>

          <div className="ap-menu">
            {items.map((item) => (
              <button
                key={item.key}
                className={`ap-menu-item ${activeSection === item.key ? "active" : ""}`}
                onClick={() => handleNav(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <button className="ap-logout-btn" style={{ marginTop: "auto" }} onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* ── OVERLAY (mobile only) ── */}
      {open && <div className="ap-overlay" onClick={() => setOpen(false)} />}
    </>
  );
}