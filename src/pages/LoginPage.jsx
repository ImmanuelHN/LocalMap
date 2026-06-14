import { ArrowLeft, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setPendingEmail } from "../utils/storage.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.email.includes("@") || !form.email.includes(".com")) {
      setError("Use a demo email that contains @ and .com.");
      return;
    }

    if (!form.password.trim()) {
      setError("Enter any password to continue.");
      return;
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
        <span className="eyebrow">Dummy authentication</span>
        <h1>Login to LOCALHUB</h1>
        <p>Use any password. The email only needs to include @ and .com.</p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              placeholder="demo@localhub.com"
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
          New user? <Link to="/role-selection">Register by choosing a role</Link>
        </p>
      </section>
    </main>
  );
}
