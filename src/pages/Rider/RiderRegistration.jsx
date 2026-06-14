import { Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../../components/MapView.jsx";
import { getRiderProfile, getUserLocation, saveRiderProfile, upsertRider } from "../../utils/storage.js";

export default function RiderRegistration() {
  const navigate = useNavigate();
  const existing = getRiderProfile();
  const userLoc = getUserLocation();
  const defaultLoc = existing?.location || userLoc || { lat: 17.4282, lng: 78.4241 };

  const [form, setForm] = useState({
    name: existing?.name || "",
    phone: existing?.phone || "",
    vehicleType: existing?.vehicleType || "Bike",
    vehicleNumber: existing?.vehicleNumber || "",
    licenseNumber: existing?.licenseNumber || "",
  });
  const [location, setLocation] = useState(defaultLoc);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function save(event) {
    event.preventDefault();
    const profile = {
      ...form,
      id: existing?.id || "rider-owned",
      rating: existing?.rating || 5.0,
      status: "Available",
      location,
    };

    saveRiderProfile(profile);
    upsertRider(profile);

    // Update pinned location
    window.localStorage.setItem("localhub_user_location", JSON.stringify(location));
    navigate("/rider");
  }

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Rider registration</span>
        <h1>{existing ? "Edit rider profile" : "Register as a rider"}</h1>
        <p>Add your identity, vehicle, licence details, and pin your current location.</p>
      </section>

      <section className="split-layout">
        <form className="content-card form-grid" onSubmit={save}>
          <label>
            Full Name
            <input name="name" value={form.name} onChange={updateField} required />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={updateField} required />
          </label>
          <label>
            Vehicle Type
            <select name="vehicleType" value={form.vehicleType} onChange={updateField}>
              <option>Bike</option>
              <option>Scooter</option>
              <option>Cycle</option>
              <option>Car</option>
            </select>
          </label>
          <label>
            Vehicle Number
            <input name="vehicleNumber" value={form.vehicleNumber} onChange={updateField} required />
          </label>
          <label>
            Driving License Number
            <input name="licenseNumber" value={form.licenseNumber} onChange={updateField} required />
          </label>
          <button className="button primary" type="submit">
            <Save size={17} />
            Save Rider Profile
          </button>
        </form>

        <div className="map-form-panel">
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">Current location</span>
              <h2>Place your rider marker</h2>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)" }}>
                Tap the map or click "Current location" to use GPS.
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
