import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/UserContext";
import {
  FaExclamationTriangle,
  FaArrowLeft,
  FaCar,
  FaUser,
  FaTools,
  FaTruck,
} from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Determine the appropriate back route based on user role and referrer
  const getBackRoute = () => {
    // Check if there's a referrer in state (from navigate with state)
    if (location.state?.from) {
      return location.state.from;
    }

    // If user is authenticated, route to their dashboard
    if (isAuthenticated && user?.role) {
      switch (user.role) {
        case "admin":
          return "/dashboard/admin";
        case "customer":
          return "/dashboard/customer";
        case "carOwner":
          return "/dashboard/carOwner";
        case "driver":
          return "/dashboard/driver";
        default:
          return "/";
      }
    }

    // Default to home for unauthenticated users
    return "/";
  };

  const handleBackClick = () => {
    const backRoute = getBackRoute();
    navigate(backRoute, { replace: true });
  };

  // Get user-specific dashboard info
  const getDashboardInfo = () => {
    if (!isAuthenticated || !user?.role) return null;

    const dashboardMap = {
      admin: {
        name: "Admin Dashboard",
        icon: FaTools,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
      customer: {
        name: "Customer Dashboard",
        icon: FaUser,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      carOwner: {
        name: "Car Owner Dashboard",
        icon: FaCar,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      driver: {
        name: "Driver Dashboard",
        icon: FaTruck,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      },
    };

    return dashboardMap[user.role];
  };

  const dashboardInfo = getDashboardInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <FaExclamationTriangle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-700 mb-2">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Button */}
        <div className="space-y-4">
          <button
            onClick={handleBackClick}
            className={`w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 ${
              isAuthenticated && dashboardInfo
                ? `${dashboardInfo.bgColor} ${dashboardInfo.color}`
                : "bg-blue-600 text-white"
            } rounded-xl font-semibold text-lg hover:shadow-lg transition duration-300 transform hover:scale-105 border-2 border-transparent hover:border-current`}
          >
            {isAuthenticated && dashboardInfo ? (
              <dashboardInfo.icon className="mr-3" />
            ) : (
              <FaArrowLeft className="mr-3" />
            )}
            <span>
              {isAuthenticated && dashboardInfo
                ? `Back to ${dashboardInfo.name}`
                : "Go Back"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
