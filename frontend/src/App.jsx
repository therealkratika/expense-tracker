import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // 1. Use Redux instead of Context
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navigation from "./components/Navigation.jsx";
import Expenses from "./pages/Expenses";
import Budget from "./pages/Budget.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";

// 2. Updated PrivateRoute to check Redux state
function PrivateRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  // If we are still checking for a saved session, show a loader
  if (loading) return <p style={{ padding: "30px" }}>Checking session...</p>;

  // If no user in Redux, redirect to login
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* 3. Removed UserProvider completely since main.jsx has <Provider> */}
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* All these now look at the Redux auth state */}
        <Route path="/dashboard" element={<PrivateRoute><Navigation /><Dashboard /></PrivateRoute>} />
        <Route path="/expenses" element={<PrivateRoute><Navigation /><Expenses /></PrivateRoute>} />
        <Route path="/budget" element={<PrivateRoute><Navigation /><Budget /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}