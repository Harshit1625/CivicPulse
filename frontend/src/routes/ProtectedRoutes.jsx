import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function UserRoute({ children }) {
  const { session, profile, authLoading, profileLoading } = useAuth();

  if (authLoading || profileLoading) return null;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Profile exists but incomplete
  if (!profile || !profile.name || !profile.city) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
}

export function AdminRoute({ children }) {
  const { session, profile, authLoading, profileLoading } = useAuth();

  if (authLoading || profileLoading) return null;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!profile || profile.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
}
