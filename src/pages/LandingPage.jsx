import {
  MapPinned,
  MessageCircle,
  Star,
  Truck,
  Users,
  Store,
  Bike,
  CheckCircle2,
  Heart,
  Zap,
  Globe2,
  PackageCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MapView from "../components/MapView.jsx";
import {
  getBusinesses,
  getCurrentUser,
  getCustomerProfile,
  getBusinessProfile,
  getRiderProfile,
} from "../utils/storage.js";

const homeByRole = {
  customer: "/customer",
  business: "/business",
  rider: "/rider",
};

const howItWorks = [
  {
    title: "Map Discovery",
    text: "Discover nearby businesses and services on an interactive map based on your location. Explore home businesses, local shops, freelancers and service providers around you.",
    icon: MapPinned,
  },
  {
    title: "Direct Communication",
    text: "Connect directly with business owners before placing an order. Ask questions, discuss requirements and build trust without intermediaries.",
    icon: MessageCircle,
  },
  {
    title: "Ratings & Reviews",
    text: "View authentic customer reviews, ratings and photos before making a purchase. Help the community discover trusted sellers.",
    icon: Star,
  },
  {
    title: "Local Delivery Network",
    text: "Get orders delivered by local riders or use your own delivery team. Track deliveries and support earning opportunities within the community.",
    icon: Truck,
  },
];

const whoCanUse = [
  {
    role: "Customers",
    icon: Users,
    color: "blue",
    points: [
      "Discover nearby businesses",
      "Place orders",
      "Review services",
      "Support local entrepreneurs",
    ],
  },
  {
    role: "Business Owners",
    icon: Store,
    color: "green",
    points: [
      "Register your business",
      "Showcase products",
      "Receive orders",
      "Grow your local customer base",
    ],
  },
  {
    role: "Riders",
    icon: Bike,
    color: "orange",
    points: [
      "Accept delivery requests",
      "Earn flexible income",
      "Support local commerce in your area",
    ],
  },
];

const whyChoose = [
  {
    title: "Support Local Businesses",
    text: "Help local entrepreneurs and home-based businesses grow.",
    icon: Heart,
  },
  {
    title: "Direct Connection",
    text: "Communicate directly with sellers without middlemen.",
    icon: Zap,
  },
  {
    title: "Community Driven",
    text: "Built for local communities and neighborhood commerce.",
    icon: Globe2,
  },
  {
    title: "Flexible Delivery",
    text: "Use dedicated riders or independent delivery partners.",
    icon: PackageCheck,
  },
];

const trustBadges = [
  "Discover Local Businesses",
  "Direct Seller Communication",
  "Community Delivery Network",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

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
      {/* ── SECTION 1: HERO ────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="hero-map-background" aria-hidden="true">
          <MapView markers={markers} showLegend={false} className="hero-map" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="eyebrow lh-eyebrow">
            LOCALHUB • COMMUNITY COMMERCE PLATFORM
          </span>
          <h1>
            Discover, Connect &amp; Order
            <br />
            <span className="hero-h1-accent">From Local Businesses Near You</span>
          </h1>
          <p className="hero-subheading">
            Find home-based businesses, cloud kitchens, freelancers, local shops
            and services around you.
            <br />
            Chat directly with sellers, place orders, and receive deliveries
            through trusted local riders.
          </p>
          <div className="hero-actions">
            <Link
              className="button primary lh-btn-lg"
              to="/role-selection"
              onClick={handleGetStarted}
            >
              Get Started
            </Link>
            {user?.role ? (
              <Link
                className="button ghost lh-btn-lg"
                to={homeByRole[user.role] || "/role-selection"}
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link className="button ghost lh-btn-lg" to="/login">
                Sign In
              </Link>
            )}
          </div>

          <div className="hero-trust-badges">
            {trustBadges.map((badge) => (
              <span className="hero-trust-badge" key={badge}>
                <CheckCircle2 size={15} />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: HOW LOCALHUB WORKS ─────────────────────── */}
      <section className="lh-section feature-band">
        <div className="section-heading centered lh-section-heading">
          <span className="eyebrow">How LocalHub Works</span>
          <h2>How LocalHub Works</h2>
          <p className="lh-section-subtitle">
            A simple way to discover local businesses, connect directly with
            sellers, and receive products through nearby delivery partners.
          </p>
        </div>

        <div className="feature-grid lh-feature-grid">
          {howItWorks.map((feature) => {
            const Icon = feature.icon;
            return (
              <article className="feature-card lh-feature-card card-hover" key={feature.title}>
                <div className="lh-card-icon-wrap">
                  <Icon size={22} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 3: WHO CAN USE LOCALHUB ───────────────────── */}
      <section className="lh-section lh-who-section">
        <div className="section-heading centered lh-section-heading">
          <span className="eyebrow">For Everyone</span>
          <h2>Who Can Use LocalHub?</h2>
          <p className="lh-section-subtitle">
            Built for customers, local businesses and delivery partners.
          </p>
        </div>

        <div className="lh-who-grid">
          {whoCanUse.map(({ role, icon: Icon, color, points }) => (
            <article className={`lh-who-card lh-who-${color} card-hover`} key={role}>
              <div className={`lh-who-icon lh-icon-${color}`}>
                <Icon size={26} />
              </div>
              <h3>{role}</h3>
              <ul className="lh-who-points">
                {points.map((pt) => (
                  <li key={pt}>
                    <CheckCircle2 size={14} />
                    {pt}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: WHY CHOOSE LOCALHUB ────────────────────── */}
      <section className="lh-section lh-why-section feature-band">
        <div className="section-heading centered lh-section-heading">
          <span className="eyebrow">Our Advantages</span>
          <h2>Why Choose LocalHub?</h2>
        </div>

        <div className="lh-why-grid">
          {whyChoose.map(({ title, text, icon: Icon }) => (
            <article className="lh-why-card card-hover" key={title}>
              <div className="lh-why-icon">
                <Icon size={20} />
              </div>
              <h4>{title}</h4>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: CALL TO ACTION ──────────────────────────── */}
      <section className="lh-cta-section">
        <div className="lh-cta-card">
          <h2>Ready to Discover Your Local Community?</h2>
          <p>
            Join LocalHub and connect with nearby businesses, trusted delivery
            partners and local customers.
          </p>
          <div className="hero-actions lh-cta-actions">
            <Link
              className="button primary lh-btn-lg"
              to="/role-selection"
              onClick={handleGetStarted}
            >
              Get Started
            </Link>
            {user?.role ? (
              <Link
                className="button ghost lh-btn-lg lh-btn-ghost-light"
                to={homeByRole[user.role] || "/role-selection"}
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link className="button ghost lh-btn-lg lh-btn-ghost-light" to="/login">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FOOTER ──────────────────────────────────── */}
      <footer className="lh-footer">
        <div className="lh-footer-inner">
          <div className="lh-footer-brand">
            <span className="lh-footer-logo">
              <MapPinned size={18} />
              LOCALHUB
            </span>
            <p>
              Connecting customers, local businesses and delivery partners
              through a single community-driven marketplace.
            </p>
          </div>

          <nav className="lh-footer-nav" aria-label="Footer navigation">
            <a href="#how-it-works">About</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy Policy</a>
          </nav>
        </div>

        <div className="lh-footer-bottom">
          <p>© 2026 LocalHub. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}
