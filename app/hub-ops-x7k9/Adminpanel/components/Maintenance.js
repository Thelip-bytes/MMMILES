"use client";
import { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Clock, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Settings,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

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

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ["00", "15", "30", "45"];

export default function Maintenance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [Maintenances, setMaintenances] = useState([]);
  const [maintenancePage, setmaintenancePage] = useState(1);
  const [hasMoremaintenance, setHasMoremaintenance] = useState(false);
  const [isFetchingLogs, setIsFetchingLogs] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [startHour, setStartHour] = useState("10");
  const [startMinute, setStartMinute] = useState("00");
  const [startAmpm, setStartAmpm] = useState("AM");

  const [endDate, setEndDate] = useState("");
  const [endHour, setEndHour] = useState("6");
  const [endMinute, setEndMinute] = useState("00");
  const [endAmpm, setEndAmpm] = useState("PM");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, reg: "" });
  const [deleteInput, setDeleteInput] = useState("");

  useEffect(() => {
    fetchAllLogs();
  }, []);

  const fetchAllLogs = (token = sessionStorage.getItem("admin_token")) => {
    if (!token) return;
    
    const maintenanceCache = sessionStorage.getItem('ap_maintenance_bookings');
    if (maintenanceCache) {
      try {
        const parsed = JSON.parse(maintenanceCache);
        setMaintenances(parsed.data || []);
        setmaintenancePage(parsed.page || 1);
        setHasMoremaintenance(parsed.hasMore || false);
      } catch (e) {}
    } else {
      setmaintenancePage(1);
    }
    
    // Always background sync page 1
    fetchMaintenances(token, 1, false);
  };

  const fetchMaintenances = async (token = sessionStorage.getItem("admin_token"), page = 1, showLoading = true) => {
    if (showLoading && !sessionStorage.getItem('ap_maintenance_bookings')) setIsFetchingLogs(true);
    try {
      const res = await fetch(`/api/hub/bookings?reason=MAINTENANCE&page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setMaintenances(data.bookings || []);
        setHasMoremaintenance(data.hasMore);
        setmaintenancePage(page);
        sessionStorage.setItem('ap_maintenance_bookings', JSON.stringify({
          data: data.bookings || [],
          page: page,
          hasMore: data.hasMore
        }));
      } else {
        toast.error(data.error || "Failed to fetch Maintenances");
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setIsFetchingLogs(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    fetchMaintenances(sessionStorage.getItem("admin_token"), newPage);
  };

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
          reason: "MAINTENANCE",
          start_time: start,
          end_time: end,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Maintenance log created!");
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
        toast.error(data.error || "Failed to create log");
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
      const res = await fetch(`/api/hub/bookings?id=${deleteModal.id}&reason=MAINTENANCE`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` },
      });
      if (res.ok) {
        toast.success("Log deleted");
        setDeleteModal({ isOpen: false, id: null, reg: "" });
        fetchMaintenances(sessionStorage.getItem("admin_token"), maintenancePage);
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Error deleting log");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTodayStr = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  };

  return (
    <div className="portal-grid">
      {/* Left: Create Maintenance */}
      <section className="portal-panel">
        <h2 className="panel-title"><Plus size={20} /> New Maintenance Log</h2>
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
              <div className="reason-badge" style={{ backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeeba' }}>
                <Settings size={14} /> MAINTENANCE
              </div>
            </div>
            <button className="portal-btn" type="submit" disabled={isSubmitting}>{isSubmitting ? "Processing..." : "Confirm Maintenance"}</button>
          </form>
        )}
      </section>

      {/* Right: Maintenance Logs */}
      <section className="portal-panel">
        <div className="panel-header-row" style={{ marginBottom: "1.5rem" }}>
          <h2 className="panel-title" style={{ margin: 0 }}><Settings size={20} /> Maintenance Logs</h2>
          <button className="refresh-btn" onClick={() => fetchMaintenances()} title="Refresh">
            <RefreshCw size={16} />
          </button>
        </div>

        {isFetchingLogs ? (
           <div className="empty-state"><p>Loading logs...</p></div>
        ) : Maintenances.length === 0 ? (
          <div className="empty-state"><Calendar size={48} style={{ opacity: 0.15 }} /><p>No Maintenance logs found</p></div>
        ) : (
          <div className="bookings-table-container">
            <table className="bookings-table">
              <thead><tr><th>Vehicle</th><th>Duration</th><th>Created</th><th></th></tr></thead>
              <tbody>
                {Maintenances.map((b) => (
                  <tr key={b.id}>
                    <td><div className="cell-vehicle"><span className="cell-name">{b.vehicles?.make} {b.vehicles?.model}</span><span className="reg-badge">{b.vehicles?.registration_number}</span></div></td>
                    <td><div className="cell-time"><Clock size={12} /> {parseFaceValueTime(b.start_time)}</div><div className="cell-time"><ArrowRight size={12} /> {parseFaceValueTime(b.end_time)}</div></td>
                    <td className="cell-created">{parseFaceValueTime(b.created_at)?.split(" ").slice(0, 1).join("")}</td>
                    <td><button className="delete-btn" onClick={() => handleDeleteBooking(b.id, b.vehicles?.registration_number)} title="Delete"><Trash2 size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {(maintenancePage > 1 || hasMoremaintenance) && (
              <div className="pagination-controls">
                <button 
                  className="pagination-btn" 
                  onClick={() => handlePageChange(maintenancePage - 1)}
                  disabled={maintenancePage === 1 || isFetchingLogs}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="page-indicator">Page {maintenancePage}</span>
                <button 
                  className="pagination-btn" 
                  onClick={() => handlePageChange(maintenancePage + 1)}
                  disabled={!hasMoremaintenance || isFetchingLogs}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteModal.isOpen && (
        <div className="modal-overlay animate-fadeIn">
          <div className="modal-card">
            <div className="modal-header-danger">
              <AlertTriangle size={32} />
              <h3>Delete Maintenance Log</h3>
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
