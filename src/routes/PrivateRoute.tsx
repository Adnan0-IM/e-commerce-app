import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { isAuthenticated, isAdmin } = useAuth();
const location = useLocation();
  // Not logged in at all
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Trying to access admin route without admin privileges
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Admin trying to access user routes
  if (!requireAdmin && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
