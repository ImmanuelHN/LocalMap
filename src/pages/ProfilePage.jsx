import { Save, Upload } from "lucide-react";
import { useState } from "react";
import { getCurrentUser, getProfile, saveProfile, setCurrentUser } from "../utils/storage.js";

export default function ProfilePage() {
  const user = getCurrentUser();
  const storedProfiles = getProfile();
  const roleProfile = storedProfiles[user.role] || {};
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: roleProfile.name || user.name || "",
    phone: roleProfile.phone || "",
    email: roleProfile.email || user.email || "",
    profileImage: roleProfile.profileImage || "",
  });

  function updateField(event) {
    setSaved(false);
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((current) => ({ ...current, profileImage: url }));
  }

  function save(event) {
    event.preventDefault();
    const updatedRoleProfile = {
      ...roleProfile,
      ...form,
    };
    saveProfile({ ...storedProfiles, [user.role]: updatedRoleProfile });
    setCurrentUser({ ...user, email: form.email, name: form.name });
    setSaved(true);
  }

  const initial = form.name?.slice(0, 1)?.toUpperCase() || "U";

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Profile</span>
        <h1>Your {user.role} profile</h1>
        <p>Your profile details are stored locally and shown across the app.</p>
      </section>

      <section className="content-card two-column">
        {/* Preview */}
        <div className="profile-preview">
          {form.profileImage ? (
            <img
              src={form.profileImage}
              alt="Profile"
              style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }}
            />
          ) : (
            <div className="profile-avatar">{initial}</div>
          )}
          <h2>{form.name || "LOCALHUB User"}</h2>
          <p style={{ color: "var(--muted)" }}>{form.email}</p>
          <span className="category-pill">{user.role}</span>
          {roleProfile.address && (
            <p className="muted-note" style={{ marginTop: 8 }}>📍 {roleProfile.address}</p>
          )}
        </div>

        {/* Form */}
        <form className="form-grid" onSubmit={save}>
          <label>
            Name
            <input name="name" value={form.name} onChange={updateField} placeholder="Your name" />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={updateField} placeholder="+91 98765 43210" />
          </label>
          <label>
            Email
            <input name="email" value={form.email} onChange={updateField} placeholder="you@example.com" />
          </label>
          <label className="file-label">
            Profile Photo
            <input type="file" accept="image/*" onChange={handleImage} />
            <span>
              <Upload size={16} />
              {form.profileImage ? "Change photo" : "Upload photo"}
            </span>
          </label>
          <button className="button primary" type="submit">
            <Save size={17} />
            Save Profile
          </button>
          {saved ? <p className="success-note">Profile saved successfully.</p> : null}
        </form>
      </section>
    </main>
  );
}
