import { MapPinned, MessageCircle, ShieldCheck, Star, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MapView from "../components/MapView.jsx";
import { getBusinesses, getCurrentUser, getCustomerProfile, getBusinessProfile, getRiderProfile } from "../utils/storage.js";

const homeByRole = {
  customer: "/customer",
  business: "/business",
  rider: "/rider",
};

const features = [
  {
    title: "Map Discovery",
    text: "Browse nearby sellers and services on a live OpenStreetMap — pinned to your real location.",
    icon: MapPinned,
  },
  {
    title: "Direct Chat",
    text: "Message business owners directly before placing an order.",
    icon: MessageCircle,
  },
  {
    title: "Ratings & Reviews",
    text: "Honest ratings and written reviews build trust in your local community.",
    icon: Star,
  },
  {
    title: "Local Delivery",
    text: "Riders accept pickup and drop jobs with live map waypoints.",
    icon: Truck,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  // If user is logged in and has a profile, let them jump straight to their dashboard
  function handleGetStarted(e) {
    if (user?.role) {
      const hasProfile =
        (user.role === "customer" && getCustomerProfile()) ||
        (user.role === "business" && getBusinessProfile()) ||
        (user.role === "rider" && getRiderProfile());

      if (hasProfile) {
        e.preventDefault();
        navigate(homeByRole[user.role]);
      }
    }
  }

  const markers = getBusinesses()
    .slice(0, 8)
    .map((business) => ({
      id: business.id,
      type: "business",
      title: business.name,
      subtitle: business.category,
      location: business.location,
    }));

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="hero-map-background" aria-hidden="true">
          <MapView markers={markers} showLegend={false} className="hero-map" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="eyebrow">LOCALHUB — Your neighbourhood marketplace</span>
          <h1>Discover Local Businesses Around You</h1>
          <p>
            Connect directly with nearby sellers, home kitchens, freelancers and
            local services — pinned to your real location on the map.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/role-selection" onClick={handleGetStarted}>
              Get Started
            </Link>
            {user?.role ? (
              <Link className="button secondary" to={homeByRole[user.role] || "/role-selection"}>
                Go to Dashboard
              </Link>
            ) : (
              <Link className="button secondary" to="/login">
                Login
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="feature-band">
        <div className="section-heading centered">
          <span className="eyebrow">How it works</span>
          <h2>Location-first, community-built</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article className="feature-card" key={feature.title}>
                <Icon size={24} />
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="trust-strip">
        <ShieldCheck size={22} />
        <p>No backend, no billing. Runs on OpenStreetMap + your browser's local storage.</p>
      </section>
    </main>
  );
}
