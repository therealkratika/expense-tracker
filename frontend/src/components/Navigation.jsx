import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import { logout } from "../features/authSlice"; // Import logout action
import { AuthSDK } from "../api/sdk.js";
import "./Navigation.css";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/expenses", label: "Expenses" },
    { path: "/budget", label: "Budget" },
  ];

  const handleLogout = async () => {
    try {
      await AuthSDK.logout();
      
      dispatch(logout());
      
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <div className="logo">💰 ExpenseTracker</div>

        <div className="nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                location.pathname === item.path
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="nav-right">
        <div
          className="user-info"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="user-details">
            <span className="name">{user?.name || "User"}</span>
            <span className="email">{user?.email}</span>
          </div>
        </div>
        <div className={`profile-dropdown ${open ? "active" : ""}`}>
          <div className="profile-info">
            <span className="info-name">{user?.name}</span>
            <span className="info-email">{user?.email}</span>
          </div>

          <button
            className="dropdown-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}