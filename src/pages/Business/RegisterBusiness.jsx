import { Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../../components/MapView.jsx";
import { getBusinessProfile, getUserLocation, saveBusinessProfile, upsertBusiness } from "../../utils/storage.js";

const categories = [
  "Food", "Cloud Kitchen", "Bakery", "Tailor", "Freelancer",
  "Mechanic", "Beauty", "Electrician", "Handmade Products", "Other",
];

export default function RegisterBusiness() {
  const navigate = useNavigate();
  const existing = getBusinessProfile();
  const userLoc = getUserLocation();
  const defaultLoc = existing?.location || userLoc || { lat: 17.4305, lng: 78.407 };

  const [form, setForm] = useState({
    businessName: existing?.businessName || "",
    ownerName: existing?.ownerName || "",
    phone: existing?.phone || "",
    category: existing?.category || "Food",
    description: existing?.description || "",
    address: existing?.address || "",
  });
  const [location, setLocation] = useState(defaultLoc);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function save(event) {
    event.preventDefault();
    const id = existing?.id || "business-owned";
    const profile = { ...form, id, location };

    saveBusinessProfile(profile);
    upsertBusiness({
      id,
      name: form.businessName || "My Local Business",
      category: form.category,
      distance: 0,
      rating: existing?.rating || 5.0,
      phone: form.phone,
      owner: form.ownerName,
      address: form.address,
      description: form.description || "A registered LOCALHUB business ready for nearby customers.",
      location,
      images: existing?.images || [
        "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
      ],
    });

    // Update pinned location
    window.localStorage.setItem("localhub_user_location", JSON.stringify(location));
    navigate("/business");
  }

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Business registration</span>
        <h1>{existing ? "Edit your business" : "Register your local business"}</h1>
        <p>Pin your business location on the map and fill in your details below.</p>
      </section>

      <section className="split-layout">
        <form className="content-card form-grid" onSubmit={save}>
          <label>
            Business Name
            <input name="businessName" value={form.businessName} onChange={updateField} required />
          </label>
          <label>
            Owner Name
            <input name="ownerName" value={form.ownerName} onChange={updateField} required />
          </label>
          <label>
            Phone Number
            <input name="phone" value={form.phone} onChange={updateField} required />
          </label>
          <label>
            Business Category
            <select name="category" value={form.category} onChange={updateField}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={updateField} />
          </label>
          <label>
            Business Address
            <textarea name="address" value={form.address} onChange={updateField} required />
          </label>
          <button className="button primary" type="submit">
            <Save size={17} />
            Save Business
          </button>
        </form>

        <div className="map-form-panel">
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">Location picker</span>
              <h2>Place your business marker</h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)" }}>
                Tap the map or use "Current location" to pin your exact position.
              </p>
            </div>
          </div>
          <MapView picker selectedPosition={location} onLocationSelect={setLocation} markers={[]} />
          <p className="muted-note">Pinned: {location.lat}, {location.lng}</p>
        </div>
      </section>
    </main>
  );
}
