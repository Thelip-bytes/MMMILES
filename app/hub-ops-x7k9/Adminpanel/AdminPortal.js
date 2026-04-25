"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ShieldCheck, LogOut, User } from "lucide-react";
import toast from "react-hot-toast";

// Admin Panel Components
import Sidebar from "./components/Sidebar";
import HomeSection from "./components/Home";
import Cars from "./components/Cars";
import Bookings from "./components/Bookings";
import OfflineBooking from "./components/OfflineBooking";
import Maintainance from "./components/Maintainance";
import Paused from "./components/Paused";

import "./styles/hub-portal.css";

export default function HubPortalPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  // Login state
  const [loginStep, setLoginStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    document.body.classList.add("hide-nav-footer");
    const token = sessionStorage.getItem("admin_token");
    const storedAdmin = sessionStorage.getItem("admin_info");

    if (token && storedAdmin) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        if (payload.exp > Math.floor(Date.now() / 1000)) {
          setIsAdmin(true);
          setAdminData(JSON.parse(storedAdmin));
        } else {
          sessionStorage.clear();
        }
      } catch {
        sessionStorage.clear();
      }
    }
    setLoading(false);
    return () => document.body.classList.remove("hide-nav-footer");
  }, []);

  const handleCheckAdmin = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    setIsLoggingIn(true);
    const cleanPhone = phone.startsWith("91") ? phone : `91${phone}`;

    try {
      const res = await fetch("/api/hub/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      const data = await res.json();

      if (res.ok) {
        setLoginStep(2);
        toast.success("OTP sent to WhatsApp");
      } else {
        toast.error(data.error || "Access Denied");
      }
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleVerifyOtp = async (entered = otp.join("")) => {
    if (entered.length < 4) return;
    setIsLoggingIn(true);
    const cleanPhone = phone.startsWith("91") ? phone : `91${phone}`;

    try {
      const res = await fetch("/api/hub/admin-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, otp: entered }),
      });
      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem("admin_token", data.token);
        sessionStorage.setItem("admin_info", JSON.stringify(data.admin));
        setAdminData(data.admin);
        setIsAdmin(true);
        toast.success(`Welcome, ${data.admin.name || "Admin"}`);
      } else {
        toast.error(data.error || "Invalid OTP");
      }
    } catch {
      toast.error("Verification failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAdmin(false);
    setAdminData(null);
    setLoginStep(1);
    setPhone("");
    setOtp(["", "", "", ""]);
    setActiveSection("home");
  };

  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) document.getElementById(`otp-hub-${index + 1}`)?.focus();
      if (newOtp.every((d) => d !== "")) handleVerifyOtp(newOtp.join(""));
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{4}$/.test(pasted)) {
      setOtp(pasted.split(""));
      handleVerifyOtp(pasted);
      document.getElementById("otp-hub-3")?.focus();
    }
    e.preventDefault();
  };

  if (loading) return null;

  if (!isAdmin) {
    return (
      <main className="portal-login-container">
        <div className="portal-login-card animate-fadeIn">
          <div className="portal-logo">
            <Image src="/mlogo.png" alt="MM Miles" width={140} height={42} />
          </div>
          <h1 className="portal-title">HUB OPS</h1>
          <p className="portal-subtitle">Secure Admin Access Only</p>
          {loginStep === 1 ? (
            <div className="animate-fadeIn">
              <div className="portal-form-group">
                <label className="portal-label">Admin Phone Number</label>
                <div style={{ position: "relative" }}>
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel"
                    className="portal-input"
                    placeholder="Enter 10-digit number"
                    style={{ paddingLeft: "3.5rem" }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === "Enter" && handleCheckAdmin()}
                    maxLength={10}
                  />
                </div>
              </div>
              <button className="portal-btn" onClick={handleCheckAdmin} disabled={isLoggingIn}>
                {isLoggingIn ? "Verifying..." : "Send Verification Code"}
              </button>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <p className="otp-sent-text">OTP sent to <strong>+91 {phone}</strong></p>
              <div className="otp-display-group">
                {otp.map((digit, i) => (
                  <input
                    key={i} id={`otp-hub-${i}`} type="text" inputMode="numeric" maxLength={1}
                    className="otp-box-portal" value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onPaste={handleOtpPaste}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) document.getElementById(`otp-hub-${i - 1}`)?.focus();
                    }}
                  />
                ))}
              </div>
              <button className="portal-btn" onClick={() => handleVerifyOtp()} disabled={isLoggingIn}>
                {isLoggingIn ? "Verifying..." : "Access Portal"}
              </button>
              <p className="go-back-link" onClick={() => { setLoginStep(1); setOtp(["","","",""]); }}>← Go Back</p>
            </div>
          )}
          <div className="secured-badge">
            <ShieldCheck size={14} /> <span>Secured by OTP Verification</span>
          </div>
        </div>
      </main>
    );
  }

  // Admin Dashboard View
  return (
    <div className="ap-frame">
      <Sidebar 
        activeSection={activeSection} 
        onNavigate={setActiveSection} 
        onLogout={handleLogout} 
      />

      <div className="ap-panel">
        <header className="portal-header" style={{ background: 'transparent', boxShadow: 'none', padding: '0 0 20px 0' }}>
          <div className="portal-header-left">
            <span className="portal-admin-tag">
              <User size={12} /> {adminData?.name || "Hub Admin"}
            </span>
          </div>
        </header>

        {activeSection === "home" && <HomeSection />}
        {activeSection === "cars" && <Cars />}
        {activeSection === "bookings" && <Bookings />}
        {activeSection === "offline" && <OfflineBooking />}
        {activeSection === "maintainance" && <Maintainance />}
        {activeSection === "paused" && <Paused />}
      </div>
    </div>
  );
}
