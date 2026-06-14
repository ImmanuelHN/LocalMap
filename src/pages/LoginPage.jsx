import { ArrowLeft, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, getCustomerProfile, getBusinessProfile, getRiderProfile, setPendingEmail, setCurrentUser } from "../utils/storage.js";

const homeByRole = {
  customer: "/customer",
  business: "/business",
  rider: "/rider",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!form.password.trim()) {
      setError("Please enter your password.");
      return;
    }

    // Check if this email matches an existing logged-in user with a saved profile
    const existingUser = getCurrentUser();
    if (existingUser && existingUser.email === form.email) {
      // Returning user — check if they have a complete profile
      const hasProfile =
        (existingUser.role === "customer" && getCustomerProfile()) ||
        (existingUser.role === "business" && getBusinessProfile()) ||
        (existingUser.role === "rider" && getRiderProfile());

      if (hasProfile) {
        navigate(homeByRole[existingUser.role] || "/role-selection");
        return;
      }
    }

    setPendingEmail(form.email);
    navigate("/role-selection");
  }

  return (
    <main className="auth-page">
      <Link className="back-link" to="/">
        <ArrowLeft size={16} />
        Back
      </Link>

      <section className="auth-card">
        <span className="eyebrow">Welcome back</span>
        <h1>Login to LOCALHUB</h1>
        <p style={{ color: "var(--muted)", marginBottom: "4px" }}>
          Enter your email and any password to continue.
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              placeholder="Enter any password"
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="button primary full" type="submit">
            <LogIn size={17} />
            Continue
          </button>
        </form>

        <p className="auth-footnote">
          New here? <Link to="/role-selection">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
