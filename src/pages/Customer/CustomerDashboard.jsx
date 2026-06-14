import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import BusinessCard from "../../components/BusinessCard.jsx";
import MapView from "../../components/MapView.jsx";
import { getBusinesses } from "../../utils/storage.js";

export default function CustomerDashboard() {
  const [search, setSearch] = useState("");
  const businesses = getBusinesses();

  const filteredBusinesses = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return businesses;

    return businesses.filter((business) => {
      const haystack = `${business.name} ${business.category} ${business.distance}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [businesses, search]);

  const markers = filteredBusinesses.map((business) => ({
    id: business.id,
    type: "business",
    title: business.name,
    subtitle: `${business.category} - ${business.distance} km`,
    location: business.location,
    actionPath: `/customer/business/${business.id}`,
  }));

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Customer dashboard</span>
        <h1>Find nearby businesses</h1>
        <p>Search by business name, category, or distance, then open details from the card or map marker.</p>
      </section>

      <MapView title="Nearby business map" markers={markers} />

      <section className="toolbar-row">
        <div className="search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, category, distance"
            aria-label="Search businesses"
          />
        </div>
        <span className="result-count">{filteredBusinesses.length} businesses nearby</span>
      </section>

      <section className="business-grid">
        {filteredBusinesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </section>
    </main>
  );
}
