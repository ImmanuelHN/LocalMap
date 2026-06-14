import { MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import BusinessCard from "../../components/BusinessCard.jsx";
import MapView from "../../components/MapView.jsx";
import { getBusinesses, getUserLocation } from "../../utils/storage.js";

export default function CustomerDashboard() {
  const [search, setSearch] = useState("");
  const userLoc = getUserLocation();
  const businesses = getBusinesses();

  const filteredBusinesses = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = query
      ? businesses.filter((b) => {
          const haystack = `${b.name} ${b.category} ${b.distance}`.toLowerCase();
          return haystack.includes(query);
        })
      : businesses;

    // Sort by distance ascending so closest businesses appear first
    return [...list].sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
  }, [businesses, search]);

  const markers = filteredBusinesses.map((business) => ({
    id: business.id,
    type: "business",
    title: business.name,
    subtitle: `${business.category} · ${business.distance} km`,
    location: business.location,
    actionPath: `/customer/business/${business.id}`,
  }));

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Customer dashboard</span>
        <h1>Businesses near you</h1>
        <p>
          {userLoc
            ? `Showing businesses sorted by real distance from your pinned location (${userLoc.lat.toFixed(3)}, ${userLoc.lng.toFixed(3)}).`
            : "Showing nearby businesses. Set your location during onboarding to see real distances."}
        </p>
      </section>

      <MapView title="Nearby business map" markers={markers} />

      <section className="toolbar-row">
        <div className="search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, category, distance…"
            aria-label="Search businesses"
          />
        </div>
        <span className="result-count">
          {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? "es" : ""} found
        </span>
      </section>

      {filteredBusinesses.length === 0 ? (
        <section className="content-card" style={{ textAlign: "center", padding: "40px 24px" }}>
          <MapPin size={32} style={{ color: "var(--muted)", margin: "0 auto 12px" }} />
          <h2 style={{ margin: "0 0 8px" }}>No businesses found</h2>
          <p style={{ color: "var(--muted)" }}>Try a different search term or check back later.</p>
        </section>
      ) : (
        <section className="business-grid">
          {filteredBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </section>
      )}
    </main>
  );
}
