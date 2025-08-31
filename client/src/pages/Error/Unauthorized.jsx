import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/UserContext";
import {
  FaUserLock,
  FaArrowLeft,
  FaHome,
  FaTools,
  FaUser,
  FaCar,
  FaTruck,
} from "react-icons/fa";

const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Determine where to send user back
  const getBackRoute = () => {
    if (location.state?.from) {
      return location.state.from;
    }
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
    return "/";
  };

  const handleBackClick = () => {
    navigate(getBackRoute(), { replace: true });
  };

  // Dashboard info for button styling
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <FaUserLock className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Unauthorized
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            You do not have permission to access this page.
          </h2>
          <p className="text-md text-gray-600 mb-8 max-w-md mx-auto">
            Please check your account role or contact support if you believe
            this is an error.
          </p>
        </div>

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
              <FaHome className="mr-3" />
            )}
            <span>
              {isAuthenticated && dashboardInfo
                ? `Back to ${dashboardInfo.name}`
                : "Back to Home"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
