import { LogOut, MapPinned, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../utils/storage.js";

const roleLabels = {
  customer: "Customer",
  business: "Business Owner",
  rider: "Rider",
};

export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="brand-lockup">
        <span className="brand-mark">
          <MapPinned size={20} />
        </span>
        <div>
          <strong>LOCALHUB</strong>
          <span>Map-first local marketplace</span>
        </div>
      </div>

      <div className="nav-actions">
        <div className="role-chip">
          <UserRound size={16} />
          <span>{roleLabels[user?.role] || "Guest"}</span>
        </div>
        <button className="icon-button" type="button" aria-label="Logout" onClick={handleLogout}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
