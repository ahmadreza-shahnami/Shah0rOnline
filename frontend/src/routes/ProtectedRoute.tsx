import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  role = null,
}: {
  children: React.ReactNode;
  role?: string | null;
}) => {
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();
  // if (loading) return <div>Loading...</div>;
  if (!isLoggedIn)
    return (
      <Navigate
        to={{ pathname: "/login", search: `?next=${location.pathname}` }}
        replace
      />
    );
  if (role && user.role !== role)
    return <Navigate to="/unauthorized" replace />;
  return children;
};

export default ProtectedRoute;
