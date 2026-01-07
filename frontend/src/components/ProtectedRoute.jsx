import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allow, redirect, children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or spinner

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (!allow.includes(user.role)) {
    return <Navigate to={redirect} replace />;
  }

  return children;
}
