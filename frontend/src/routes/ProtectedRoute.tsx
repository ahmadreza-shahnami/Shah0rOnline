import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  role = null,
}: {
  children: React.ReactNode;
  role?: string | null;
}) => {
  const { user, isLoggedIn } = useAuth();
  // if (loading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role && user.role !== role)
    return <Navigate to="/unauthorized" replace />;
  return children;
};

export default ProtectedRoute;
