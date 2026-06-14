import { BriefcaseBusiness, ShoppingBag, Truck, ArrowLeft, MapPin, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../components/MapView.jsx";
import {
  getPendingEmail,
  setPendingEmail,
  getCustomerProfile,
  getBusinessProfile,
  getRiderProfile,
  setCurrentUser,
  saveBusinessProfile,
  saveRiderProfile,
  getProfile,
  saveProfile,
  upsertBusiness,
  upsertRider,
} from "../utils/storage.js";

const roles = [
  {
    id: "customer",
    title: "Customer",
    description: "Browse businesses near you, chat with sellers, place orders, and leave reviews.",
    icon: ShoppingBag,
  },
  {
    id: "business",
    title: "Business Owner",
    description: "Register your local business, manage incoming orders and customer reviews.",
    icon: BriefcaseBusiness,
  },
  {
    id: "rider",
    title: "Rider / Delivery",
    description: "Accept delivery jobs around you and track pickups and drops on the live map.",
    icon: Truck,
  },
];

const businessCategories = [
  "Food", "Cloud Kitchen", "Bakery", "Tailor", "Freelancer",
  "Mechanic", "Beauty", "Electrician", "Handmade Products", "Other",
];

const DEFAULT_CENTER = { lat: 17.4305, lng: 78.407 };

export default function RoleSelectionPage() {
  const navigate = useNavigate();

  // Determine starting step: if pendingEmail is already set (came from Login), skip email entry
  const prefilledEmail = getPendingEmail();
  const [step, setStep] = useState(prefilledEmail ? 2 : 1);
  const [email, setEmail] = useState(prefilledEmail || "");
  const [emailError, setEmailError] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);

  // Per-role form state
  const [customerForm, setCustomerForm] = useState({
    name: "", phone: "", address: "",
    location: { ...DEFAULT_CENTER },
  });
  const [businessForm, setBusinessForm] = useState({
    businessName: "", ownerName: "", phone: "",
    category: "Food", description: "", address: "",
    location: { ...DEFAULT_CENTER },
  });
  const [riderForm, setRiderForm] = useState({
    name: "", phone: "",
    vehicleType: "Bike", vehicleNumber: "", licenseNumber: "",
    location: { ...DEFAULT_CENTER },
  });

  // Prefill from existing saved profiles
  useEffect(() => {
    const storedProfiles = getProfile();
    if (storedProfiles.customer) {
      setCustomerForm((f) => ({ ...f, ...storedProfiles.customer }));
    }
    const existingBusiness = getBusinessProfile();
    if (existingBusiness) {
      setBusinessForm((f) => ({ ...f, ...existingBusiness }));
    }
    const existingRider = getRiderProfile();
    if (existingRider) {
      setRiderForm((f) => ({ ...f, ...existingRider }));
    }
  }, []);

  // Auto-geolocate when step 3 opens (to prefill pin with real device location)
  useEffect(() => {
    if (step !== 3 || !selectedRole) return;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
        };
        if (selectedRole === "customer") {
          setCustomerForm((f) => ({ ...f, location: coords }));
        } else if (selectedRole === "business") {
          setBusinessForm((f) => ({ ...f, location: coords }));
        } else {
          setRiderForm((f) => ({ ...f, location: coords }));
        }
      },
      () => {
        // silently fall back to default center
      }
    );
  }, [step, selectedRole]);

  function goBack() {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      if (prefilledEmail) {
        navigate("/");
      } else {
        setStep(1);
      }
    } else {
      navigate("/");
    }
  }

  function handleEmailNext(e) {
    e.preventDefault();
    if (!email.includes("@")) {
      setEmailError("Enter a valid email address.");
      return;
    }
    setEmailError("");
    setPendingEmail(email);
    setStep(2);
  }

  function handleRoleSelect(roleId) {
    setSelectedRole(roleId);
    setStep(3);
  }

  function handleLocationSelect(coords) {
    if (selectedRole === "customer") {
      setCustomerForm((f) => ({ ...f, location: coords }));
    } else if (selectedRole === "business") {
      setBusinessForm((f) => ({ ...f, location: coords }));
    } else {
      setRiderForm((f) => ({ ...f, location: coords }));
    }
  }

  function currentLocation() {
    return selectedRole === "customer"
      ? customerForm.location
      : selectedRole === "business"
      ? businessForm.location
      : riderForm.location;
  }

  function handleFinish(e) {
    e.preventDefault();
    let name = "";
    const loc = currentLocation();

    if (selectedRole === "customer") {
      name = customerForm.name;
      const storedProfiles = getProfile();
      saveProfile({
        ...storedProfiles,
        customer: {
          name: customerForm.name,
          phone: customerForm.phone,
          email,
          address: customerForm.address,
          location: loc,
        },
      });
    } else if (selectedRole === "business") {
      name = businessForm.businessName;
      const profile = { ...businessForm, id: "business-owned", location: loc };
      saveBusinessProfile(profile);
      upsertBusiness({
        id: "business-owned",
        name: businessForm.businessName,
        category: businessForm.category,
        distance: 0.1,
        rating: 5.0,
        phone: businessForm.phone,
        owner: businessForm.ownerName,
        address: businessForm.address,
        description: businessForm.description || "A local business on LOCALHUB.",
        location: loc,
        images: [
          "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
        ],
      });
    } else {
      name = riderForm.name;
      const profile = {
        ...riderForm,
        id: "rider-owned",
        rating: 5.0,
        status: "Available",
        location: loc,
      };
      saveRiderProfile(profile);
      upsertRider(profile);
    }

    setCurrentUser({ email, role: selectedRole, name });
    window.localStorage.setItem("localhub_user_location", JSON.stringify(loc));
    navigate(`/${selectedRole}`);
  }

  // ─── Step renderers ──────────────────────────────────────────────────────────

  function renderStep1() {
    return (
      <section className="auth-card" style={{ maxWidth: 420, width: "100%" }}>
        <span className="eyebrow">Step 1 of 3 — Account</span>
        <h1 style={{ fontSize: "clamp(22px,3vw,30px)" }}>Enter your email</h1>
        <p style={{ color: "var(--muted)", marginBottom: 8 }}>
          Use any email address to create or resume your account.
        </p>
        <form className="form-grid" onSubmit={handleEmailNext}>
          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmailError(""); setEmail(e.target.value); }}
              placeholder="you@example.com"
              required
            />
          </label>
          {emailError && <p className="form-error">{emailError}</p>}
          <button className="button primary full" type="submit">Continue →</button>
        </form>
      </section>
    );
  }

  function renderStep2() {
    return (
      <section style={{ maxWidth: 1020, width: "100%" }}>
        <div className="section-heading centered" style={{ marginBottom: 36 }}>
          <span className="eyebrow">Step 2 of 3 — Account Type</span>
          <h1>How will you use LOCALHUB?</h1>
          <p>Pick the account type that matches your goal. You can always start fresh with a different role.</p>
        </div>

        <div className="role-grid">
          {roles.map((role) => {
            const Icon = role.icon;
            const hasExisting =
              role.id === "customer" ? !!getCustomerProfile() :
              role.id === "business" ? !!getBusinessProfile() :
              !!getRiderProfile();

            return (
              <button
                className="role-card card-hover"
                type="button"
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                style={{ position: "relative", textAlign: "left" }}
              >
                {hasExisting && (
                  <span style={{
                    position: "absolute", top: 14, right: 14,
                    display: "flex", alignItems: "center", gap: 4,
                    color: "var(--secondary-dark)", fontSize: 12, fontWeight: 800,
                  }}>
                    <CheckCircle size={14} /> Saved
                  </span>
                )}
                <Icon size={28} />
                <h2>{role.title}</h2>
                <p>{role.description}</p>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  function renderCustomerFields() {
    return (
      <>
        <label>
          Full Name
          <input
            type="text"
            value={customerForm.name}
            onChange={(e) => setCustomerForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Jane Doe"
            required
          />
        </label>
        <label>
          Phone Number
          <input
            type="tel"
            value={customerForm.phone}
            onChange={(e) => setCustomerForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+91 98765 43210"
            required
          />
        </label>
        <label>
          Delivery Address
          <textarea
            value={customerForm.address}
            onChange={(e) => setCustomerForm((f) => ({ ...f, address: e.target.value }))}
            placeholder="Flat / house number, street, area…"
            required
          />
        </label>
      </>
    );
  }

  function renderBusinessFields() {
    return (
      <>
        <label>
          Business Name
          <input
            type="text"
            value={businessForm.businessName}
            onChange={(e) => setBusinessForm((f) => ({ ...f, businessName: e.target.value }))}
            placeholder="My Local Bakery"
            required
          />
        </label>
        <label>
          Owner Name
          <input
            type="text"
            value={businessForm.ownerName}
            onChange={(e) => setBusinessForm((f) => ({ ...f, ownerName: e.target.value }))}
            placeholder="Anika Rao"
            required
          />
        </label>
        <label>
          Phone Number
          <input
            type="tel"
            value={businessForm.phone}
            onChange={(e) => setBusinessForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+91 98765 10001"
            required
          />
        </label>
        <label>
          Category
          <select
            value={businessForm.category}
            onChange={(e) => setBusinessForm((f) => ({ ...f, category: e.target.value }))}
          >
            {businessCategories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>
          Description
          <textarea
            value={businessForm.description}
            onChange={(e) => setBusinessForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="What does your business offer?"
          />
        </label>
        <label>
          Business Address
          <textarea
            value={businessForm.address}
            onChange={(e) => setBusinessForm((f) => ({ ...f, address: e.target.value }))}
            placeholder="Shop / office address, landmarks…"
            required
          />
        </label>
      </>
    );
  }

  function renderRiderFields() {
    return (
      <>
        <label>
          Full Name
          <input
            type="text"
            value={riderForm.name}
            onChange={(e) => setRiderForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Rahul Kumar"
            required
          />
        </label>
        <label>
          Phone Number
          <input
            type="tel"
            value={riderForm.phone}
            onChange={(e) => setRiderForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+91 98765 20001"
            required
          />
        </label>
        <label>
          Vehicle Type
          <select
            value={riderForm.vehicleType}
            onChange={(e) => setRiderForm((f) => ({ ...f, vehicleType: e.target.value }))}
          >
            <option>Bike</option>
            <option>Scooter</option>
            <option>Cycle</option>
            <option>Car</option>
          </select>
        </label>
        <label>
          Vehicle Number
          <input
            type="text"
            value={riderForm.vehicleNumber}
            onChange={(e) => setRiderForm((f) => ({ ...f, vehicleNumber: e.target.value }))}
            placeholder="TS 09 AB 1234"
            required
          />
        </label>
        <label>
          Driving License Number
          <input
            type="text"
            value={riderForm.licenseNumber}
            onChange={(e) => setRiderForm((f) => ({ ...f, licenseNumber: e.target.value }))}
            placeholder="DL-1234567890"
            required
          />
        </label>
      </>
    );
  }

  function renderStep3() {
    const roleName = roles.find((r) => r.id === selectedRole)?.title || selectedRole;
    const loc = currentLocation();

    return (
      <section style={{ maxWidth: 1120, width: "100%" }}>
        <div className="section-heading" style={{ marginBottom: 28 }}>
          <span className="eyebrow">Step 3 of 3 — Your Details</span>
          <h1>Set up your {roleName} profile</h1>
          <p>Fill in your info and pin your location on the map. This is used to calculate real distances.</p>
        </div>

        <div className="split-layout">
          {/* Form card */}
          <div className="content-card">
            <form className="form-grid" onSubmit={handleFinish} id="onboard-form">
              {selectedRole === "customer" && renderCustomerFields()}
              {selectedRole === "business" && renderBusinessFields()}
              {selectedRole === "rider" && renderRiderFields()}

              <button className="button primary full" type="submit" style={{ marginTop: 6 }}>
                Complete Setup & Enter Dashboard
              </button>
            </form>
          </div>

          {/* Map picker */}
          <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
            <div style={{ marginBottom: 4 }}>
              <span className="eyebrow">Location Picker</span>
              <h2 style={{ margin: "6px 0 4px", fontSize: "clamp(20px,2.5vw,26px)" }}>Pin Your Location</h2>
              <p style={{ margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
                Tap anywhere on the map, or click <strong>Current location</strong> to use your device GPS.
                This pins your position and computes real km distances to everything nearby.
              </p>
            </div>
            <MapView
              picker
              selectedPosition={loc}
              onLocationSelect={handleLocationSelect}
              markers={[]}
            />
            <p className="muted-note" style={{ display: "flex", alignItems: "center", gap: 6, margin: 0 }}>
              <MapPin size={14} />
              Pinned: {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ─── Root render ─────────────────────────────────────────────────────────────

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        background: "var(--background)",
        position: "relative",
      }}
    >
      {/* Back button */}
      <button
        onClick={goBack}
        style={{
          position: "fixed", top: 24, left: 24,
          display: "inline-flex", alignItems: "center", gap: 8,
          border: "none", background: "none", cursor: "pointer",
          color: "var(--muted)", fontWeight: 800, fontSize: 14,
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Step progress indicator */}
      <div style={{ display: "flex", gap: 8, marginBottom: 40, alignItems: "center" }}>
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            style={{
              width: n === step ? 28 : 10,
              height: 10,
              borderRadius: 999,
              background: n === step ? "var(--primary)" : n < step ? "var(--secondary)" : "var(--line)",
              transition: "all 300ms ease",
            }}
          />
        ))}
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </main>
  );
}
