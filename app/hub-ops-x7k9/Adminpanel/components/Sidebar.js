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
      <div className="mobile-nav">
        <img src="/mlogo.png" className="logo-img mobile-logo" alt="Logo" />
        <div
          className={`hamburger ${open ? "active" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* ── SIDEBAR (desktop always visible, mobile slide-in) ── */}
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div>
          <div className="logo desktop-logo">
            <img src="/mlogo.png" className="logo-img" alt="Logo" />
          </div>

          <div className="menu">
            {items.map((item) => (
              <button
                key={item.key}
                className={`item ${activeSection === item.key ? "active" : ""}`}
                onClick={() => handleNav(item.key)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <button className="logout" style={{ marginTop: "auto" }} onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* ── OVERLAY (mobile only) ── */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </>
  );
}