import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {set, useForm} from "react-hook-form";
import { AuthSDK } from "../api/sdk.js";
import "./Login.css";
export default function Login() {
  const navigate = useNavigate();
  const{ register, handleSubmit,setError, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
     await AuthSDK.login(data.email, data.password);       
     navigate("/dashboard",{replace: true});  
    } catch (err) {
      setError("email", { message: err.message|| "Invalid email or password" });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome back</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
            
          {errors.email && <p className="auth-error">{errors.email.message}</p>}
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
            />
          </div>
          {errors.password && <p className="auth-error">{errors.password.message}</p>}

          <p
            className="forgot-link"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </p>

          <button
            type="submit"
            className="primary-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="switch-text">
          Don’t have an account? <Link to="/">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
