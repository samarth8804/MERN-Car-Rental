import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/UserContext"; // Import your auth context
import {
  FaCar,
  FaKey,
  FaRocket,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";

const Navbar = ({ onOpenRoleModal = null }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Use your existing auth context
  const { isAuthenticated, user, clearUser, isLoading } = useAuth();

  const openRoleModal = (type) => {
    if (onOpenRoleModal) {
      onOpenRoleModal(type);
    }
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    clearUser(); // Use the clearUser function from context
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  // Show loading state if auth is still initializing
  if (isLoading) {
    return (
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg">
                <FaCar className="text-xl" />
              </div>
              <span className="text-2xl font-bold text-gray-900">easyGo</span>
            </Link>
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
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg">
              <FaCar className="text-xl" />
            </div>
            <span className="text-2xl font-bold text-gray-900">easyGo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
            >
              Contact
            </Link>
            <Link
              to="/faqs"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
            >
              FAQs
            </Link>

            {/* Conditional Auth/User Section */}
            {!isAuthenticated ? (
              // Guest User - Show Login/Signup
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => openRoleModal?.("login")}
                  className="text-blue-600 hover:text-blue-700 font-medium transition duration-300 flex items-center space-x-2"
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
                {/* Notifications */}
                <button className="relative text-gray-700 hover:text-blue-600 transition duration-300">
                  <FaBell className="text-xl" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="font-medium">{user?.name || "User"}</span>
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user?.email || "user@example.com"}
                        </p>
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {user?.role || "Customer"}
                        </span>
                      </div>

                      <Link
                        to={`/dashboard/${user?.role}` || "/dashboard"}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaUser />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        to="/profile"
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaUser />
                        <span>Profile</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
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
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
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
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/about"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setShowMobileMenu(false)}
              >
                Contact
              </Link>
              <Link
                to="/faqs"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setShowMobileMenu(false)}
              >
                FAQs
              </Link>

              {!isAuthenticated ? (
                // Guest Mobile Menu
                <>
                  <button
                    onClick={() => openRoleModal("login")}
                    className="block w-full text-left px-3 py-2 text-blue-600 hover:text-blue-700"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openRoleModal("signup")}
                    className="block w-full text-left px-3 py-2 text-blue-600 hover:text-blue-700"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                // Logged In Mobile Menu
                <>
                  <div className="px-3 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || "User"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>

                  <Link
                    to={`/dashboard/${user?.role}` || "/dashboard"}
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
