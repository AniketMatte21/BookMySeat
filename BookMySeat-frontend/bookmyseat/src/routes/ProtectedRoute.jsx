import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show a spinner while the /api/auth/me API call is in flight
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Checking session...
      </div>
    );
  }

  // If not logged in, redirect to landing page (or login)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}