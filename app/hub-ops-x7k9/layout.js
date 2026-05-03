import "./Adminpanel/styles/admin.css";
import "./Adminpanel/styles/hub-portal.css";

export default function HubLayout({ children }) {
  return (
    <div className="hub-ops-wrapper">
      {children}
    </div>
  );
}
