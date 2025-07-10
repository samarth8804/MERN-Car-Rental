import { Navigate } from "react-router-dom";
import { useAuth } from "../context/UserContext";

const ProtectedRoute = ({ children, allowedRoles = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required role(s)
  if (allowedRoles) {
    const userRole = user?.role;

    // If allowedRoles is an array, check if user role is in the array
    if (Array.isArray(allowedRoles)) {
      if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
      }
    }
    // If allowedRoles is a single string, check direct match
    else if (userRole !== allowedRoles) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;