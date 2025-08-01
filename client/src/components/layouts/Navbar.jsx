import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/UserContext";
import {
  FaCar,
  FaKey,
  FaRocket,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaChevronDown,
  FaHome,
  FaTachometerAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Logo from "../common/Logo";

const Navbar = ({
  onOpenRoleModal = null,
  isDashboard = false,
  dashboardTitle = "Dashboard",
  showNotifications = false,
  notificationCount = 0,
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const { isAuthenticated, user, clearUser, isLoading } = useAuth();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openRoleModal = (type) => {
    if (onOpenRoleModal) {
      onOpenRoleModal(type);
    }
    setShowMobileMenu(false);
  };

  const handleNotificationClick = () => {
    // If already on dashboard, go to bookings tab
    if (isDashboard) {
      // Use window.location if you don't have access to navigate here
      window.location.href = "/dashboard/customer?tab=bookings";
    } else {
      navigate("/dashboard/customer?tab=bookings");
    }
  };

  const handleLogout = () => {
    try {
      if (window.confirm("Are you sure you want to logout?")) {
        clearUser();
        setShowUserMenu(false);
        setShowMobileMenu(false);
        toast.success("Logged out successfully!");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Error logging out. Please try again.");
    }
  };

  // Navigation links for info pages
  const infoLinks = [
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/faqs", label: "FAQs" },
  ];

  // Show loading state if auth is still initializing
  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo
              disableLink={isDashboard}
              variant={isDashboard ? "dashboard" : "default"}
            />
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Logo
              disableLink={isDashboard}
              variant={isDashboard ? "dashboard" : "default"}
            />
            {isDashboard && (
              <div className="hidden sm:block">
                <span className="text-gray-400">•</span>
                <span className="ml-2 text-lg font-medium text-gray-700">
                  {dashboardTitle}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Info Pages Links */}
            {infoLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-blue-600 font-medium transition duration-300 px-3 py-2 rounded-lg hover:bg-blue-50"
              >
                {link.label}
              </Link>
            ))}

            {/* Conditional Auth/User Section */}
            {!isAuthenticated ? (
              // Guest User - Show Login/Signup
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => openRoleModal?.("login")}
                  className="text-blue-600 hover:text-blue-700 font-medium transition duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  <FaKey />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => openRoleModal?.("signup")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition duration-300 flex items-center space-x-2"
                >
                  <FaRocket />
                  <span>Sign Up</span>
                </button>
              </div>
            ) : (
              // Logged In User - Show User Menu
              <div className="flex items-center space-x-4">
                {/* Notifications - Show only if enabled and has count */}
                {showNotifications && notificationCount > 0 && (
                  <button
                    className="relative text-gray-700 hover:text-blue-600 transition duration-300 p-2 rounded-lg hover:bg-blue-50"
                    onClick={handleNotificationClick}
                    title="View Active Bookings"
                  >
                    <FaBell className="text-xl" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount}
                    </span>
                  </button>
                )}

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition duration-300 px-3 py-2 rounded-lg hover:bg-blue-50"
                  >
                    {/* User Avatar Circle */}
                    <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {user?.fullname?.charAt(0)?.toUpperCase() ||
                        user?.name?.charAt(0)?.toUpperCase() ||
                        "U"}
                    </div>
                    {/* Show name without role for dashboard */}
                    <div className="hidden lg:block text-left">
                      <p className="font-medium text-sm">
                        {user?.fullname?.split(" ")[0] || user?.name || "User"}
                      </p>
                      {/* Only show role if NOT on dashboard */}
                      {!isDashboard && (
                        <p className="text-xs text-gray-500 capitalize">
                          {user?.role || "Customer"}
                        </p>
                      )}
                    </div>
                    <FaChevronDown
                      className={`text-xs transition-transform duration-200 ${
                        showUserMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown - Fixed width and email overflow */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      {/* User Info Header - Fixed email overflow */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.fullname || user?.name || "User"}
                          </p>
                          <p
                            className="text-sm text-gray-500 truncate"
                            title={user?.email}
                          >
                            {user?.email || "user@example.com"}
                          </p>
                          <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                            {user?.role || "Customer"}
                          </span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {/* Dashboard Link - Only show if not already on dashboard */}
                        {!isDashboard && (
                          <Link
                            to={`/dashboard/${user?.role}` || "/dashboard"}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-3 transition duration-200"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FaTachometerAlt className="text-blue-500" />
                            <span>Dashboard</span>
                          </Link>
                        )}

                        {/* Logout Button - Direct without divider since no profile link */}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition duration-200"
                        >
                          <FaSignOutAlt className="text-red-500" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition duration-200"
            >
              {showMobileMenu ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Info Pages Links */}
              {infoLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Dashboard-specific: Home link for authenticated users */}
              {isDashboard && isAuthenticated && (
                <Link
                  to="/"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div className="flex items-center space-x-2">
                    <FaHome />
                    <span>Home</span>
                  </div>
                </Link>
              )}

              {!isAuthenticated ? (
                // Guest Mobile Menu
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => openRoleModal("login")}
                    className="block w-full text-left px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <FaKey />
                      <span>Login</span>
                    </div>
                  </button>
                  <button
                    onClick={() => openRoleModal("signup")}
                    className="block w-full text-left px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition duration-200 mt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <FaRocket />
                      <span>Sign Up</span>
                    </div>
                  </button>
                </div>
              ) : (
                // Logged In Mobile Menu
                <div className="pt-4 border-t border-gray-200">
                  {/* User Info - Fixed email overflow */}
                  <div className="px-3 py-3 bg-gray-50 rounded-lg mx-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {user?.fullname?.charAt(0)?.toUpperCase() ||
                          user?.name?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.fullname || user?.name || "User"}
                        </p>
                        <p
                          className="text-sm text-gray-500 truncate"
                          title={user?.email}
                        >
                          {user?.email || "user@example.com"}
                        </p>
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                          {user?.role || "Customer"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Link - Only show if not already on dashboard */}
                  {!isDashboard && (
                    <Link
                      to={`/dashboard/${user?.role}` || "/dashboard"}
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 mx-3"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <FaTachometerAlt />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                  )}

                  {/* Logout Button - No profile link needed */}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition duration-200 mx-3 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
