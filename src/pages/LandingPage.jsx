import { MapPinned, MessageCircle, ShieldCheck, Star, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import MapView from "../components/MapView.jsx";
import { getBusinesses } from "../utils/storage.js";

const features = [
  {
    title: "Map Discovery",
    text: "Browse nearby sellers and services from a live OpenStreetMap interface.",
    icon: MapPinned,
  },
  {
    title: "Direct Chat",
    text: "Customers can message business owners before ordering.",
    icon: MessageCircle,
  },
  {
    title: "Reviews",
    text: "Ratings, written reviews, and photo uploads build local trust.",
    icon: Star,
  },
  {
    title: "Local Delivery",
    text: "Riders can accept pickup and drop jobs with visible map points.",
    icon: Truck,
  },
];

export default function LandingPage() {
  const markers = getBusinesses()
    .slice(0, 6)
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
          <span className="eyebrow">LOCALHUB prototype</span>
          <h1>Discover Local Businesses Around You</h1>
          <p>
            Connect directly with nearby sellers, home businesses, cloud kitchens,
            freelancers and local services.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/role-selection">
              Get Started
            </Link>
            <Link className="button secondary" to="/login">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="feature-band">
        <div className="section-heading centered">
          <span className="eyebrow">Built for stakeholder demos</span>
          <h2>A real product feel without backend setup</h2>
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
        <p>No billing, no API keys, no backend. The prototype runs with OpenStreetMap and LocalStorage.</p>
      </section>
    </main>
  );
}
