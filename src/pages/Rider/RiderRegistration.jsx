import { Save, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../../components/MapView.jsx";
import {
  getRiderProfile,
  saveRiderProfile,
  upsertRider,
} from "../../utils/storage.js";

export default function RiderRegistration() {
  const navigate = useNavigate();
  const existing = getRiderProfile();
  const [form, setForm] = useState({
    name: existing?.name || "",
    phone: existing?.phone || "",
    photo: existing?.photo || "",
    vehicleType: existing?.vehicleType || "Bike",
    vehicleNumber: existing?.vehicleNumber || "",
    licenseNumber: existing?.licenseNumber || "",
  });
  const [location, setLocation] = useState(existing?.location || { lat: 17.4282, lng: 78.4241 });

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm((current) => ({ ...current, photo: file.name }));
  }

  function save(event) {
    event.preventDefault();
    const profile = {
      ...form,
      id: existing?.id || "rider-owned",
      rating: existing?.rating || 4.8,
      status: "Available",
      location,
    };

    saveRiderProfile(profile);
    upsertRider(profile);
    navigate("/rider");
  }

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Rider registration</span>
        <h1>{existing ? "Edit rider profile" : "Register as a rider"}</h1>
        <p>Add identity, vehicle, license, and current map location details.</p>
      </section>

      <section className="split-layout">
        <form className="content-card form-grid" onSubmit={save}>
          <label>
            Name
            <input name="name" value={form.name} onChange={updateField} required />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={updateField} required />
          </label>
          <label className="file-label">
            Photo
            <input type="file" accept="image/*" onChange={handlePhoto} />
            <span><Upload size={16} /> {form.photo || "Upload photo"}</span>
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
            Save Rider
          </button>
        </form>

        <div className="map-form-panel">
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">Current location</span>
              <h2>Place rider marker</h2>
            </div>
          </div>
          <MapView picker selectedPosition={location} onLocationSelect={setLocation} markers={[]} />
          <p className="muted-note">Selected: {location.lat}, {location.lng}</p>
        </div>
      </section>
    </main>
  );
}
