import { Save, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../../components/MapView.jsx";
import {
  getBusinessProfile,
  saveBusinessProfile,
  upsertBusiness,
} from "../../utils/storage.js";

const categories = [
  "Food",
  "Cloud Kitchen",
  "Bakery",
  "Tailor",
  "Freelancer",
  "Mechanic",
  "Beauty",
  "Electrician",
  "Handmade Products",
  "Other",
];

const fallbackImages = [
  "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
];

export default function RegisterBusiness() {
  const navigate = useNavigate();
  const existing = getBusinessProfile();
  const [form, setForm] = useState({
    businessName: existing?.businessName || "",
    ownerName: existing?.ownerName || "",
    phone: existing?.phone || "",
    category: existing?.category || "Food",
    description: existing?.description || "",
    address: existing?.address || "",
    profileImage: existing?.profileImage || "",
    galleryImages: existing?.galleryImages || [],
  });
  const [location, setLocation] = useState(existing?.location || { lat: 17.4305, lng: 78.407 });

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleProfileImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setForm((current) => ({ ...current, profileImage: file.name }));
  }

  function handleGallery(event) {
    const files = Array.from(event.target.files || []).map((file) => file.name);
    setForm((current) => ({ ...current, galleryImages: files }));
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
      distance: 0.3,
      rating: 4.7,
      phone: form.phone,
      owner: form.ownerName,
      address: form.address,
      description: form.description || "A registered LOCALHUB business ready for nearby customers.",
      location,
      images: fallbackImages,
    });

    navigate("/business");
  }

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Business registration</span>
        <h1>{existing ? "Edit your business" : "Register your local business"}</h1>
        <p>First-time business owners complete this profile before entering the dashboard.</p>
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
              {categories.map((category) => (
                <option value={category} key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={updateField} />
          </label>
          <label>
            Business Address
            <textarea name="address" value={form.address} onChange={updateField} />
          </label>
          <label className="file-label">
            Profile Image
            <input type="file" accept="image/*" onChange={handleProfileImage} />
            <span><Upload size={16} /> {form.profileImage || "Upload profile image"}</span>
          </label>
          <label className="file-label">
            Gallery Images
            <input type="file" accept="image/*" multiple onChange={handleGallery} />
            <span><Upload size={16} /> {form.galleryImages.length || "Upload gallery images"}</span>
          </label>
          <button className="button primary" type="submit">
            <Save size={17} />
            Save Business
          </button>
        </form>

        <div className="map-form-panel">
          <div className="section-heading compact">
            <div>
              <span className="eyebrow">Map location picker</span>
              <h2>Place your marker</h2>
            </div>
          </div>
          <MapView picker selectedPosition={location} onLocationSelect={setLocation} markers={[]} />
          <p className="muted-note">Selected: {location.lat}, {location.lng}</p>
        </div>
      </section>
    </main>
  );
}
