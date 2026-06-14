import {
  BriefcaseBusiness,
  Clock3,
  LayoutDashboard,
  ListChecks,
  ShoppingBag,
  Star,
  UserRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menus = {
  customer: [
    { label: "Dashboard", to: "/customer", icon: LayoutDashboard },
    { label: "Orders", to: "/customer/orders", icon: ShoppingBag },
    { label: "Reviews", to: "/customer/reviews", icon: Star },
    { label: "Profile", to: "/customer/profile", icon: UserRound },
  ],
  business: [
    { label: "Dashboard", to: "/business", icon: LayoutDashboard },
    { label: "Orders", to: "/business/orders", icon: ListChecks },
    { label: "Reviews", to: "/business/reviews", icon: Star },
    { label: "Profile", to: "/business/profile", icon: BriefcaseBusiness },
  ],
  rider: [
    { label: "Dashboard", to: "/rider", icon: LayoutDashboard },
    { label: "Jobs", to: "/rider/jobs", icon: ShoppingBag },
    { label: "History", to: "/rider/history", icon: Clock3 },
    { label: "Profile", to: "/rider/profile", icon: UserRound },
  ],
};

export default function Sidebar({ role }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>LH</span>
        <strong>LOCALHUB</strong>
      </div>

      <nav className="sidebar-menu" aria-label="Primary">
        {(menus[role] || []).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} end={item.to.split("/").length === 2}>
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
