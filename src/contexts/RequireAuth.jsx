// src/routes/RequireAuth.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth({ children }) {
  const { accessToken } = useAuth();
  const location = useLocation();

  // Kalau tidak ada token ⇒ paksa ke /login
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Ada token ⇒ biarkan masuk ke Dashboard (auto login dari token)
  return children;
}
