"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Calendar,
  LogOut,
  User,
  Trash2,
  Plus,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Settings,
  RefreshCw,
  Phone,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";
import "./hub-portal.css";

/* ─────────── Face-value time helpers ─────────── */

function parseFaceValueTime(isoString) {
  if (!isoString) return "";
  const m = isoString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return "";
  const [, year, month, day, hour, min] = m;
  return formatDisplayTime(
    parseInt(day), parseInt(month), parseInt(year),
    parseInt(hour), parseInt(min)
  );
}

function formatDisplayTime(day, month, year, hour24, min) {
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const h12 = hour24 % 12 || 12;
  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");
  const mn = String(min).padStart(2, "0");
  return `${dd}/${mm}/${year} ${h12}:${mn} ${ampm}`;
}

function buildDateTimeLocal(date, hour, minute, ampm) {
  if (!date) return "";
  let h24 = parseInt(hour);
  if (ampm === "PM" && h24 !== 12) h24 += 12;
  if (ampm === "AM" && h24 === 12) h24 = 0;
  return `${date}T${String(h24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/* ─────────── Constants ─────────── */
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ["00", "15", "30", "45"];

/* ─────────── Component ─────────── */
export default function HubPortalPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login
  const [loginStep, setLoginStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Logs Pagination
  const [activeTab, setActiveTab] = useState("offline");
  const [offlineBookings, setOfflineBookings] = useState([]);
  const [onlineBookings, setOnlineBookings] = useState([]);
  const [offlinePage, setOfflinePage] = useState(1);
  const [onlinePage, setOnlinePage] = useState(1);
  const [hasMoreOffline, setHasMoreOffline] = useState(false);
  const [hasMoreOnline, setHasMoreOnline] = useState(false);
  const [isFetchingLogs, setIsFetchingLogs] = useState(false);

  // New Booking Form
  const [startDate, setStartDate] = useState("");
  const [startHour, setStartHour] = useState("10");
  const [startMinute, setStartMinute] = useState("00");
  const [startAmpm, setStartAmpm] = useState("AM");

  const [endDate, setEndDate] = useState("");
  const [endHour, setEndHour] = useState("6");
  const [endMinute, setEndMinute] = useState("00");
  const [endAmpm, setEndAmpm] = useState("PM");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deletion Confirmation
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, reg: "" });
  const [deleteInput, setDeleteInput] = useState("");

  // ── Auth ──
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
          fetchAllLogs(token);
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

  // ── Data Fetching ──
  const fetchAllLogs = (token = sessionStorage.getItem("admin_token")) => {
    setOfflinePage(1);
    setOnlinePage(1);
    fetchOfflineBookings(token, 1, false);
    fetchOnlineBookings(token, 1, false);
  };

  const fetchOfflineBookings = async (token = sessionStorage.getItem("admin_token"), page = 1) => {
    setIsFetchingLogs(true);
    try {
      const res = await fetch(`/api/hub/bookings?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOfflineBookings(data.bookings || []);
        setHasMoreOffline(data.hasMore);
        setOfflinePage(page);
        // Store total total for pagination if needed, but hasMore is enough for Prev/Next
      } else {
        toast.error(data.error || "Failed to fetch offline bookings");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingLogs(false);
    }
  };

  const fetchOnlineBookings = async (token = sessionStorage.getItem("admin_token"), page = 1) => {
    setIsFetchingLogs(true);
    try {
      const res = await fetch(`/api/hub/online-bookings?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to fetch online bookings");
      } else {
        setOnlineBookings(data.bookings || []);
        setHasMoreOnline(data.hasMore);
        setOnlinePage(page);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error fetching online bookings");
    } finally {
      setIsFetchingLogs(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    if (activeTab === "offline") {
      fetchOfflineBookings(sessionStorage.getItem("admin_token"), newPage);
    } else {
      fetchOnlineBookings(sessionStorage.getItem("admin_token"), newPage);
    }
  };

  // ── Admin check + OTP ──
  const handleCheckAdmin = async () => {
    if (!phone || phone.length < 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    setIsLoggingIn(true);
    const cleanPhone = phone.startsWith("91") ? phone : `91${phone}`;

    try {
      // consolidate: check admin + send otp in one secure server call
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
        fetchAllLogs(data.token);
      } else {
        toast.error(data.error || "Invalid OTP");
      }
    } catch {
      toast.error("Verification failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ── Vehicle search ──
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchQuery.length > 2) searchVehicles();
      else setSearchResults([]);
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const searchVehicles = async () => {
    setIsSearching(true);
    try {
      const res = await fetch(`/api/hub/vehicles/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` },
      });
      const data = await res.json();
      setSearchResults(data.vehicles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // ── Booking creation / deletion ──
  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!selectedVehicle) {
      toast.error("Select a vehicle first");
      return;
    }

    const start = buildDateTimeLocal(startDate, startHour, startMinute, startAmpm);
    const end = buildDateTimeLocal(endDate, endHour, endMinute, endAmpm);

    if (!start || !end) {
      toast.error("Please set both start and end dates/times");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/hub/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({
          vehicle_id: selectedVehicle.id,
          start_time: start,
          end_time: end,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Offline booking created!");
        setStartDate(""); setEndDate("");
        setStartHour("10"); setStartMinute("00"); setStartAmpm("AM");
        setEndHour("6"); setEndMinute("00"); setEndAmpm("PM");
        setSelectedVehicle(null);
        setSearchQuery("");
        setSearchResults([]);
        fetchAllLogs();
      } else if (res.status === 409) {
        toast.error(data.error || "Time overlap detected!", { icon: "⚠️", duration: 5000 });
      } else {
        toast.error(data.error || "Failed to create booking");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBooking = (id, reg) => {
    setDeleteModal({ isOpen: true, id, reg });
    setDeleteInput("");
  };

  const executeDelete = async () => {
    if (deleteInput !== "DELETE LOG") {
      toast.error("Type 'DELETE LOG' to confirm");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/hub/bookings?id=${deleteModal.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` },
      });
      if (res.ok) {
        toast.success("Log deleted");
        setDeleteModal({ isOpen: false, id: null, reg: "" });
        fetchOfflineBookings(sessionStorage.getItem("admin_token"), offlinePage);
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Error deleting log");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAdmin(false);
    setAdminData(null);
    setLoginStep(1);
    setPhone("");
    setOtp(["", "", "", ""]);
  };

  // ── Helpers ──
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

  const getTodayStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  };

  if (loading) return null;

  /* ═══════════════════ LOGIN SCREEN ═══════════════════ */
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

  /* ═══════════════════ DASHBOARD ═══════════════════ */
  return (
    <div className="portal-wrapper">
      <header className="portal-header">
        <div className="portal-header-left">
          <Image src="/mlogo.png" alt="Logo" width={90} height={27} />
          <span className="portal-admin-tag">
            <User size={12} /> {adminData?.name || "Hub Admin"}
          </span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={14} style={{ marginRight: 4 }} /> Logout
        </button>
      </header>

      <main className="portal-main-content">
        <div className="portal-grid">
          {/* Left: Create Offline Booking */}
          <section className="portal-panel">
            <h2 className="panel-title"><Plus size={20} /> New Offline Booking</h2>
            <div className="portal-form-group">
              <label className="portal-label">Search Vehicle (Reg No.)</label>
              <div style={{ position: "relative" }}>
                <Search size={18} className="input-icon" />
                <input
                  type="text" className="portal-input" placeholder="e.g. TN01AB1234"
                  style={{ paddingLeft: "3rem" }} value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            {isSearching && <p className="searching-text">Searching vehicles...</p>}
            <div className="search-results">
              {searchResults.map((v) => (
                <div key={v.id} className={`vehicle-result-card ${selectedVehicle?.id === v.id ? "selected" : ""}`} onClick={() => setSelectedVehicle(v)}>
                  {selectedVehicle?.id === v.id && <CheckCircle2 size={18} className="check-icon" />}
                  <div className="v-info" style={{ marginLeft: 0 }}>
                    <h4>{v.make} {v.model}</h4>
                    <p><span className="reg-badge">{v.registration_number}</span></p>
                  </div>
                </div>
              ))}
            </div>

            {selectedVehicle && (
              <form className="booking-form animate-fadeIn" onSubmit={handleCreateBooking}>
                <div className="selected-vehicle-banner">
                  <CheckCircle2 size={16} />
                  <span>{selectedVehicle.make} {selectedVehicle.model}</span>
                </div>
                <div className="datetime-picker-group">
                  <label className="portal-label"><Clock size={14} /> Pickup (Start)</label>
                  <div className="datetime-row">
                    <input type="date" className="portal-input date-input" value={startDate} min={getTodayStr()} onChange={(e) => setStartDate(e.target.value)} />
                    <div className="time-selectors">
                      <select className="time-select" value={startHour} onChange={(e) => setStartHour(e.target.value)}>{HOURS.map(h => <option key={h} value={h}>{h}</option>)}</select>
                      <span className="time-colon">:</span>
                      <select className="time-select" value={startMinute} onChange={(e) => setStartMinute(e.target.value)}>{MINUTES.map(m => <option key={m} value={m}>{m}</option>)}</select>
                      <div className="ampm-toggle">
                        <button type="button" className={`ampm-btn ${startAmpm === "AM" ? "active" : ""}`} onClick={() => setStartAmpm("AM")}>AM</button>
                        <button type="button" className={`ampm-btn ${startAmpm === "PM" ? "active" : ""}`} onClick={() => setStartAmpm("PM")}>PM</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="datetime-picker-group">
                  <label className="portal-label"><Clock size={14} /> Drop-off (End)</label>
                  <div className="datetime-row">
                    <input type="date" className="portal-input date-input" value={endDate} min={startDate || getTodayStr()} onChange={(e) => setEndDate(e.target.value)} />
                    <div className="time-selectors">
                      <select className="time-select" value={endHour} onChange={(e) => setEndHour(e.target.value)}>{HOURS.map(h => <option key={h} value={h}>{h}</option>)}</select>
                      <span className="time-colon">:</span>
                      <select className="time-select" value={endMinute} onChange={(e) => setEndMinute(e.target.value)}>{MINUTES.map(m => <option key={m} value={m}>{m}</option>)}</select>
                      <div className="ampm-toggle">
                        <button type="button" className={`ampm-btn ${endAmpm === "AM" ? "active" : ""}`} onClick={() => setEndAmpm("AM")}>AM</button>
                        <button type="button" className={`ampm-btn ${endAmpm === "PM" ? "active" : ""}`} onClick={() => setEndAmpm("PM")}>PM</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="portal-form-group">
                  <label className="portal-label">Reason</label>
                  <div className="reason-badge"><AlertTriangle size={14} /> OFFLINE BOOKING</div>
                </div>
                <button className="portal-btn" type="submit" disabled={isSubmitting}>{isSubmitting ? "Processing..." : "Confirm Booking"}</button>
              </form>
            )}
          </section>

          {/* Right: Booking Logs with Tabs */}
          <section className="portal-panel">
            <div className="panel-header-row" style={{ marginBottom: "1.5rem" }}>
              <div className="log-tabs">
                <button className={`log-tab ${activeTab === 'offline' ? 'active' : ''}`} onClick={() => setActiveTab('offline')}>
                  <Settings size={16} /> Offline Logs
                </button>
                <button className={`log-tab ${activeTab === 'online' ? 'active' : ''}`} onClick={() => setActiveTab('online')}>
                  <Globe size={16} /> Online Bookings
                </button>
              </div>
              <button className="refresh-btn" onClick={() => activeTab === 'offline' ? fetchOfflineBookings() : fetchOnlineBookings()} title="Refresh">
                <RefreshCw size={16} />
              </button>
            </div>

            {isFetchingLogs ? (
               <div className="empty-state"><p>Loading bookings...</p></div>
            ) : activeTab === "offline" ? (
              /* OFFLINE TABLE */
              offlineBookings.length === 0 ? (
                <div className="empty-state"><Calendar size={48} style={{ opacity: 0.15 }} /><p>No offline bookings found</p></div>
              ) : (
                <div className="bookings-table-container">
                  <table className="bookings-table">
                    <thead><tr><th>Vehicle</th><th>Duration</th><th>Created</th><th></th></tr></thead>
                    <tbody>
                      {offlineBookings.map((b) => (
                        <tr key={b.id}>
                          <td><div className="cell-vehicle"><span className="cell-name">{b.vehicles?.make} {b.vehicles?.model}</span><span className="reg-badge">{b.vehicles?.registration_number}</span></div></td>
                          <td><div className="cell-time"><Clock size={12} /> {parseFaceValueTime(b.start_time)}</div><div className="cell-time"><ArrowRight size={12} /> {parseFaceValueTime(b.end_time)}</div></td>
                          <td className="cell-created">{parseFaceValueTime(b.created_at)?.split(" ").slice(0, 1).join("")}</td>
                          <td><button className="delete-btn" onClick={() => handleDeleteBooking(b.id, b.vehicles?.registration_number)} title="Delete"><Trash2 size={15} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {(offlinePage > 1 || hasMoreOffline) && (
                    <div className="pagination-controls">
                      <button 
                        className="pagination-btn" 
                        onClick={() => handlePageChange(offlinePage - 1)}
                        disabled={offlinePage === 1 || isFetchingLogs}
                      >
                        <ChevronLeft size={16} /> Previous
                      </button>
                      <span className="page-indicator">Page {offlinePage}</span>
                      <button 
                        className="pagination-btn" 
                        onClick={() => handlePageChange(offlinePage + 1)}
                        disabled={!hasMoreOffline || isFetchingLogs}
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              /* ONLINE TABLE */
              onlineBookings.length === 0 ? (
                <div className="empty-state"><Globe size={48} style={{ opacity: 0.15 }} /><p>No online bookings found</p></div>
              ) : (
                <div className="bookings-table-container">
                  <table className="bookings-table">
                    <thead><tr><th>Vehicle</th><th>Customer</th><th>Trip</th><th>Status</th></tr></thead>
                    <tbody>
                      {onlineBookings.map((b) => (
                        <tr key={b.id}>
                          <td><div className="cell-vehicle"><span className="cell-name">{b.vehicles?.make} {b.vehicles?.model}</span><span className="reg-badge">{b.vehicles?.registration_number}</span></div></td>
                          <td>
                            <div className="cell-customer">
                                <span className="cell-name">{b.customers?.first_name} {b.customers?.last_name}</span>
                                <span className="cell-subtext"><Phone size={10} /> {b.customers?.phone}</span>
                            </div>
                          </td>
                          <td>
                            <div className="cell-time"><Clock size={12} /> {parseFaceValueTime(b.start_time)}</div>
                            <div className="cell-time"><ArrowRight size={12} /> {parseFaceValueTime(b.end_time)}</div>
                          </td>
                          <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {(onlinePage > 1 || hasMoreOnline) && (
                    <div className="pagination-controls">
                      <button 
                        className="pagination-btn" 
                        onClick={() => handlePageChange(onlinePage - 1)}
                        disabled={onlinePage === 1 || isFetchingLogs}
                      >
                        <ChevronLeft size={16} /> Previous
                      </button>
                      <span className="page-indicator">Page {onlinePage}</span>
                      <button 
                        className="pagination-btn" 
                        onClick={() => handlePageChange(onlinePage + 1)}
                        disabled={!hasMoreOnline || isFetchingLogs}
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )
            )}
          </section>
        </div>
      </main>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteModal.isOpen && (
        <div className="modal-overlay animate-fadeIn">
          <div className="modal-card">
            <div className="modal-header-danger">
              <AlertTriangle size={32} />
              <h3>Delete Booking Log</h3>
            </div>
            <div className="modal-body">
              <div className="v-pill-large">{deleteModal.reg}</div>
              <p className="danger-notice">This log will be permanently removed.</p>
              
              <div className="confirmation-input-section">
                <label className="portal-label">Type <strong>DELETE LOG</strong> to confirm:</label>
                <input 
                  type="text" 
                  className="portal-input" 
                  placeholder="DELETE LOG" 
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && deleteInput === "DELETE LOG" && executeDelete()}
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-pill" onClick={() => setDeleteModal({ isOpen: false, id: null, reg: "" })}>Cancel</button>
              <button 
                className={`delete-pill-final ${deleteInput === "DELETE LOG" ? "active" : ""}`}
                disabled={deleteInput !== "DELETE LOG" || isSubmitting}
                onClick={executeDelete}
              >
                {isSubmitting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
