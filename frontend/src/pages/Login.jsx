import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthSDK } from "../api/sdk.js";
import { useUser } from "../context/userContext.jsx";
import "./Login.css";
export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await AuthSDK.login(email, password);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome back</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <p
            className="forgot-link"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </p>

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="switch-text">
          Don’t have an account? <Link to="/">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
