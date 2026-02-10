import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthSDK } from "../api/sdk";
export default function Signup() {
  const navigate = useNavigate();
  //const { login } = useUser(); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  if(password != confirmPassword) {
    setError("Passwords do not match");
    return;
  }
  setLoading(true);
  try {
    await AuthSDK.signup(name,email, password);
    navigate("/login");
  } catch (err) {
    setError(err.message || "Signup failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create your account to start</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Your name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="switch-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
