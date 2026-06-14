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
    setForm((current) => ({ ...current, profileImage: file.name }));
  }

  function save(event) {
    event.preventDefault();
    saveProfile({ ...storedProfiles, [user.role]: form });
    setCurrentUser({ ...user, email: form.email, name: form.name });
    setSaved(true);
  }

  return (
    <main className="page-stack">
      <section className="section-heading">
        <span className="eyebrow">Profile</span>
        <h1>Your {user.role} profile</h1>
        <p>Profile details are stored locally and used across the prototype UI.</p>
      </section>

      <section className="content-card two-column">
        <div className="profile-preview">
          <div className="profile-avatar">{form.name?.slice(0, 1) || "L"}</div>
          <h2>{form.name || "LOCALHUB User"}</h2>
          <p>{form.email}</p>
          <span className="category-pill">{user.role}</span>
          {form.profileImage ? <p className="muted-note">Image: {form.profileImage}</p> : null}
        </div>

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
            <input name="email" value={form.email} onChange={updateField} placeholder="demo@localhub.com" />
          </label>
          <label className="file-label">
            Profile Image
            <input type="file" accept="image/*" onChange={handleImage} />
            <span><Upload size={16} /> Upload image</span>
          </label>
          <button className="button primary" type="submit">
            <Save size={17} />
            Save Profile
          </button>
          {saved ? <p className="success-note">Profile saved locally.</p> : null}
        </form>
      </section>
    </main>
  );
}
