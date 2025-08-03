import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-hot-toast";

// Context and utilities
import { useAuth } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Components
import Navbar from "../../components/layouts/Navbar";
import DriverDashboardTabs from "../../components/Dashboard/Driver/DriverDashboardTab";
import OverviewTab from "../../components/Dashboard/Driver/OverviewTab";
import RidesTab from "../../components/Dashboard/Driver/RidesTab";
import ProfileTab from "../../components/Dashboard/ProfileTab";

// Utilities
import { getActiveBookingsCount } from "../../utils/dashboard/driverDashboardUtils";
import { getDashboardTabs } from "../../utils/data";

const DriverDashboard = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [criticalError, setCriticalError] = useState(null);
  const profilePollingRef = useRef(null);

  // Computed values
  const tabs = getDashboardTabs("driver", { rides });
  const activeRidesCount = getActiveBookingsCount(rides);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to access dashboard");
      navigate("/");
      return;
    }

    if (user.role !== "driver") {
      toast.error("Access denied. Driver account required.");
      navigate("/");
      return;
    }

    // Check driver approval status
    if (user.status !== "approved") {
      if (user.status === "pending") {
        toast.error("Your account is pending admin approval.");
        navigate("/");
        return;
      } else if (user.status === "rejected") {
        toast.error("Your account has been rejected. Contact support.");
        navigate("/");
        return;
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Data initialization
  useEffect(() => {
    if (
      isAuthenticated &&
      user?.role === "driver" &&
      user?.status === "approved"
    ) {
      initializeDashboard();
    }
  }, [isAuthenticated, user]);

  const initializeDashboard = async () => {
    setLoading(true);
    setCriticalError(null);

    try {
      await fetchRides();
    } catch (error) {
      console.error("Critical dashboard initialization error:", error);
      setCriticalError(
        "Failed to initialize dashboard. Please refresh the page."
      );
    } finally {
      setLoading(false);
    }
  };

  // Tab change handler
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  // ✅ SIMPLE: Auto-fetch profile every 30 seconds to catch rating updates
  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "driver") return;

    // Start periodic profile fetching
    profilePollingRef.current = setInterval(async () => {
      await fetchUpdatedUserData();
    }, 30000); // Every 30 seconds

    // Cleanup on unmount
    return () => {
      if (profilePollingRef.current) {
        clearInterval(profilePollingRef.current);
      }
    };
  }, [user, isAuthenticated]);

  // ✅ ENHANCED: Better fetchUpdatedUserData with change detection
  const fetchUpdatedUserData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.PROFILE);
      if (response.data.success) {
        const newData = response.data.user;

        // ✅ Check if any important fields changed
        const hasChanges =
          newData.earnings !== user.earnings ||
          newData.totalRides !== user.totalRides ||
          newData.rating !== user.rating ||
          newData.ratingCount !== user.ratingCount;

        if (hasChanges) {
          // ✅ Only update specific fields, preserve everything else
          const updatedUser = {
            ...user,
            earnings: newData.earnings,
            totalRides: newData.totalRides,
            rating: newData.rating,
            ratingCount: newData.ratingCount,
            updatedAt: newData.updatedAt,
          };

          console.log("Profile updated with changes:", {
            old: {
              earnings: user.earnings,
              totalRides: user.totalRides,
              rating: user.rating,
              ratingCount: user.ratingCount,
            },
            new: {
              earnings: newData.earnings,
              totalRides: newData.totalRides,
              rating: newData.rating,
              ratingCount: newData.ratingCount,
            },
          });

          updateUser(updatedUser);

          // ✅ Show notification only for rating changes
          if (
            newData.rating !== user.rating ||
            newData.ratingCount !== user.ratingCount
          ) {
            toast.success(
              `🌟 Rating updated! Now ${parseFloat(newData.rating || 0).toFixed(
                1
              )} (${newData.ratingCount || 0} reviews)`,
              { duration: 4000 }
            );
          }

          return updatedUser;
        }
      }
    } catch (error) {
      console.error("Error fetching updated user data:", error);
      return null;
    }
  };

  // Fetch rides/bookings assigned to driver
  const fetchRides = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.BOOKING.GET_BOOKING_HISTORY
      );

      if (response.data.success) {
        // Filter rides where this driver is assigned - use user._id instead of user.id
        const driverRides = response.data.bookingHistory.filter(
          (booking) => booking.driver && booking.driver._id === user._id
        );
        setRides(driverRides);
      } else {
        setRides([]);
      }
    } catch (error) {
      console.error("Error fetching rides:", error);
      setRides([]);
    }
  };

  // Ride actions
  const handleStartRide = async (bookingId, uniqueCode) => {
    try {
      const response = await axiosInstance.post(API_PATHS.DRIVER.START_RIDE, {
        bookingId,
        uniqueCode,
      });

      if (response.data.success) {
        toast.success("Ride started successfully!");
        await fetchRides();
        return true; // ✅ Return success
      } else {
        throw new Error(response.data.message || "Failed to start ride");
      }
    } catch (error) {
      console.error("Error starting ride:", error);
      throw error; // ✅ Throw error so modal can handle it
    }
  };

  // ✅ ENHANCED: Complete ride handler with immediate profile refresh
  const handleCompleteRide = async (
    bookingId,
    uniqueCode,
    actualReturnDate,
    kmTravelled,
    otp = null
  ) => {
    try {
      const payload = {
        bookingId,
        uniqueCode,
        actualReturnDate,
        kmTravelled,
      };

      if (otp) {
        payload.otp = otp;
      }

      const response = await axiosInstance.post(
        API_PATHS.DRIVER.COMPLETE_RIDE,
        payload
      );

      if (response.data.success) {
        if (response.data.needsOTP) {
          toast.success("Ride details processed! Check your email for OTP.");
          return response.data;
        } else if (response.data.completed) {
          toast.success("Ride completed successfully!");

          // ✅ IMMEDIATE: Refresh both rides and profile immediately
          await Promise.all([fetchRides(), fetchUpdatedUserData()]);

          return response.data;
        }
      } else {
        throw new Error(response.data.message || "Failed to complete ride");
      }
    } catch (error) {
      console.error("Error completing ride:", error);
      throw error;
    }
  };

  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (criticalError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">{criticalError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isDashboard={true}
        dashboardTitle="Driver Dashboard"
        showNotifications={activeRidesCount > 0}
        notificationCount={activeRidesCount}
      />

      <DriverDashboardTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab Content */}
        {activeTab === "overview" && (
          <OverviewTab
            user={user}
            rides={rides}
            loading={loading}
            onTabChange={handleTabChange}
            onStartRide={handleStartRide}
            onCompleteRide={handleCompleteRide}
            onRideUpdate={fetchRides}
          />
        )}

        {activeTab === "rides" && (
          <RidesTab
            rides={rides}
            loading={loading}
            onStartRide={handleStartRide}
            onCompleteRide={handleCompleteRide}
            onRideUpdate={fetchRides}
          />
        )}

        {activeTab === "profile" && <ProfileTab user={user} />}
      </div>
    </div>
  );
};

export default DriverDashboard;
