import { useEffect, useState } from "react";
import Navbar from "../components/layouts/Navbar";
import RoleSelectionModal from "../components/layouts/RoleSelectionModal";
import FeaturedCars from "../components/Home/FeaturedCar";
import { roles } from "../utils/data";
import HeroSection from "../components/Home/HeroSection";
import FeaturesSection from "../components/common/FeaturesSection";
import Footer from "../components/layouts/Footer";
import { useAuth } from "../context/UserContext";

const Home = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [authType, setAuthType] = useState(""); // 'login' or 'signup'

  // Get auth state from UserContext
  const { isAuthenticated, isLoading, getRedirectPath } = useAuth();

  // Redirect authenticated users to their respective dashboard
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const redirectPath = getRedirectPath();
      if (redirectPath) {
        window.location.href = redirectPath;
      }
    }
  }, [isAuthenticated, isLoading, getRedirectPath]);

  const openRoleModal = (type) => {
    setAuthType(type);
    setShowRoleModal(true);
  };

  const closeModal = () => {
    setShowRoleModal(false);
    setAuthType("");
  };

  const handleRoleSelect = (roleId) => {
    closeModal();
    // Navigate to auth page with role
    window.location.href = `/${authType}/${roleId}`;
  };

  // ✅ Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ Don't render homepage if user is authenticated
  if (isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navbar onOpenRoleModal={openRoleModal} />

      {/* Hero Section */}
      <HeroSection onOpenRoleModal={openRoleModal} />

      {/* Featured Cars Section */}
      <FeaturedCars onOpenRoleModal={openRoleModal} />

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer */}
      <Footer onOpenRoleModal={openRoleModal} />

      {/* Role Selection Modal */}

      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={closeModal}
        authType={authType}
        roles={roles}
        onRoleSelect={handleRoleSelect}
      />
    </div>
  );
};

export default Home;
