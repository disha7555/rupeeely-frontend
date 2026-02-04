import { Navigate } from "react-router-dom";
import {useAuth} from "../hooks/useAuth";

export default function ProtectedRoute({ children, permission }) {
  const { isAuthenticated, permissions, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />

    if (permission && !permissions?.includes(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}