import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { AuthSDK } from "../api/sdk.js";
import "./Navigation.css";

export default function Navigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); 

  const { user } = useSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false); 
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/expenses", label: "Expenses" },
    { path: "/budget", label: "Budget" },
  ];

  const handleLogout = async () => {
    try {
      await AuthSDK.logout();
      dispatch(logout());
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <div className="logo">ExpenseTracker</div>
        <button
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)} 
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
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <div className="avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="user-details">
            <span className="name">
              {typeof user?.name === "string" ? user.name : "User"}
            </span>
            <span className="email">
              {typeof user?.email === "string" ? user.email : ""}
            </span>
          </div>
          <div
            className={`profile-dropdown ${
              dropdownOpen ? "active" : ""
            }`}
          >
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
      </div>
    </nav>
  );
}