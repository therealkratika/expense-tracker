import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthSDK } from "../api/sdk";

export default function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    // password match check
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        message: "Passwords do not match"
      });
      return;
    }

    try {
      await AuthSDK.signup(data.name, data.email, data.password);
      navigate("/login");
    } catch (err) {
      setError("root", {
        message: err.message || "Signup failed"
      });
    }
  };

  return (

    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create your account to start</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">

          <div className="field">
            <label>Your name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="auth-error">{errors.name.message}</p>
            )}
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email"
                }
              })}
            />
            {errors.email && (
              <p className="auth-error">{errors.email.message}</p>
            )}
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            {errors.password && (
              <p className="auth-error">{errors.password.message}</p>
            )}
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password"
              })}
            />
            {errors.confirmPassword && (
              <p className="auth-error">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {errors.root && (
            <p className="auth-error">{errors.root.message}</p>
          )}

          <button
            type="submit"
            className="primary-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="switch-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}