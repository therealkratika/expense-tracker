import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; 
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navigation from "./components/Navigation.jsx";
import Expenses from "./pages/Expenses";
import Budget from "./pages/Budget.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";
function PrivateRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);
  if (loading) return <p style={{ padding: "30px" }}>Checking session...</p>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<PrivateRoute><Navigation /><Dashboard /></PrivateRoute>} />
        <Route path="/expenses" element={<PrivateRoute><Navigation /><Expenses /></PrivateRoute>} />
        <Route path="/budget" element={<PrivateRoute><Navigation /><Budget /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}