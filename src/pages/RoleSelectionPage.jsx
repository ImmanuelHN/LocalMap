import { BriefcaseBusiness, ShoppingBag, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getBusinessProfile,
  getPendingEmail,
  getRiderProfile,
  setCurrentUser,
} from "../utils/storage.js";

const roles = [
  {
    id: "customer",
    title: "Customer",
    text: "Discover nearby businesses, chat, order, and leave reviews.",
    icon: ShoppingBag,
    to: "/customer",
  },
  {
    id: "business",
    title: "Business Owner",
    text: "Register a business, manage orders, and view customer reviews.",
    icon: BriefcaseBusiness,
    to: "/business",
  },
  {
    id: "rider",
    title: "Rider",
    text: "Accept delivery jobs and move them from pickup to delivered.",
    icon: Truck,
    to: "/rider",
  },
];

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const email = getPendingEmail() || "demo@localhub.com";

  function selectRole(role) {
    setCurrentUser({
      email,
      role: role.id,
      name: role.title,
    });

    if (role.id === "business" && !getBusinessProfile()) {
      navigate("/business/register");
      return;
    }

    if (role.id === "rider" && !getRiderProfile()) {
      navigate("/rider/register");
      return;
    }

    navigate(role.to);
  }

  return (
    <main className="role-page">
      <section className="section-heading centered">
        <span className="eyebrow">Choose your demo role</span>
        <h1>Who are you using LOCALHUB as?</h1>
        <p>Each role has its own navigation, map markers, forms, and LocalStorage-backed flows.</p>
      </section>

      <section className="role-grid">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <button className="role-card card-hover" type="button" key={role.id} onClick={() => selectRole(role)}>
              <Icon size={28} />
              <h2>{role.title}</h2>
              <p>{role.text}</p>
            </button>
          );
        })}
      </section>
    </main>
  );
}
