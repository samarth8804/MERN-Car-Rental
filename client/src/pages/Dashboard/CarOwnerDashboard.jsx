import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaSpinner,
  FaExclamationTriangle,
  FaSync,
  FaClock,
} from "react-icons/fa";

import { useAuth } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Navbar from "../../components/layouts/Navbar";
import CarOwnerDashboardTabs from "../../components/Dashboard/CarOwner/CarOwnerDashboardTabs";
import OverviewTab from "../../components/Dashboard/CarOwner/OverviewTab";
import CarsTab from "../../components/Dashboard/CarOwner/CarsTab";
import BookingsTab from "../../components/Dashboard/CarOwner/BookingsTab";
import ProfileTab from "../../components/Dashboard/ProfileTab";
// ✅ UPDATED: Import UnifiedCarModal instead of AddCarModal
import UnifiedCarModal from "../../components/Dashboard/CarOwner/UnifiedCarModal";

import { getDashboardTabs } from "../../utils/data";

// ✅ FIXED: Create a specific function for car owner tabs
const getCarOwnerActiveTab = (location) => {
  const urlParams = new URLSearchParams(location.search);
  const tabFromQuery = urlParams.get("tab");

  const validTabs = ["overview", "cars", "bookings", "profile"];

  if (tabFromQuery && validTabs.includes(tabFromQuery)) {
    return tabFromQuery;
  }

  return "overview"; // Default tab
};

const getActiveBookingsCount = (bookings) => {
  if (!Array.isArray(bookings)) return 0;
  return bookings.filter(
    (booking) => !booking.isCompleted && !booking.isCancelled
  ).length;
};

const CarOwnerDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FIXED: Use the corrected tab detection
  const [activeTab, setActiveTab] = useState(getCarOwnerActiveTab(location));
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carsLoading, setCarsLoading] = useState(false);
  const [criticalError, setCriticalError] = useState(null);

  // ✅ UPDATED: Unified modal state
  const [showUnifiedModal, setShowUnifiedModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedCarForEdit, setSelectedCarForEdit] = useState(null);

  // ✅ ADD: Auto-refresh interval
  const [autoRefresh, setAutoRefresh] = useState(true);
  const refreshIntervalRef = useRef(null);

  // Computed values
  const tabs = getDashboardTabs("carOwner", { cars, bookings });
  const activeBookingsCount = getActiveBookingsCount(bookings);

  // Authentication check
  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || !user) {
      toast.error("Please login to access dashboard");
      navigate("/");
      return;
    }

    if (user.role !== "carOwner") {
      toast.error("Access denied. Car Owner account required.");
      navigate("/");
      return;
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  // ✅ FIXED: URL sync with proper tab detection
  useEffect(() => {
    const newTab = getCarOwnerActiveTab(location);
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [location.search, location.pathname]);

  // Data initialization
  useEffect(() => {
    if (isAuthenticated && user?.role === "carOwner") {
      initializeDashboard();
    }
  }, [isAuthenticated, user]);

  // ✅ FIXED: Fetch bookings for car owner's cars
  const fetchBookings = async (carList = cars) => {
    try {
      
      const response = await axiosInstance.get(
        API_PATHS.BOOKING.GET_BOOKING_HISTORY
      );

      if (response.data.success) {
        const allBookings = response.data.bookingHistory || [];
 

        const carIds = carList.map((car) => car._id);


        const ownerBookings = allBookings.filter((booking) => {
          const carId = booking.car?._id || booking.car;
          const isOwnerBooking = carIds.includes(carId);
          console.log(
            `Booking ${booking._id}: Car ID ${carId}, Is Owner: ${isOwnerBooking}`
          );
          return isOwnerBooking;
        });


        setBookings(Array.isArray(ownerBookings) ? ownerBookings : []);
      } else {
        
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    }
  };

  // ✅ FIXED: Single fetchCars function
  const fetchCars = async () => {
    try {
      setCarsLoading(true);
      const response = await axiosInstance.get(API_PATHS.CAR_OWNER.GET_MY_CARS);

      if (response.data.success) {
        const fetchedCars = response.data.cars || [];
        setCars(fetchedCars);

        if (fetchedCars.length > 0) {
          await fetchBookings(fetchedCars);
        } else {
          setBookings([]);
        }
      } else {
        setCars([]);
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
      setBookings([]);
      if (error.response?.status !== 404) {
        toast.error("Failed to load cars. Please try again.");
      }
    } finally {
      setCarsLoading(false);
    }
  };

  // ✅ FIXED: Simplified data initialization
  const initializeDashboard = async () => {
    setLoading(true);
    setCriticalError(null);

    try {
      await fetchCars();
    } catch (error) {
      console.error("Critical dashboard initialization error:", error);
      setCriticalError(
        "Failed to initialize dashboard. Please refresh the page."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Tab change handler
  const handleTabChange = useCallback(
    (tab) => {
      if (tab === activeTab) return;


      setActiveTab(tab);
      navigate(`/dashboard/carOwner?tab=${tab}`, { replace: true });
    },
    [activeTab, navigate]
  );

  // ✅ UPDATED: Unified modal handlers
  const handleAddCar = () => {
    setModalMode("add");
    setSelectedCarForEdit(null);
    setShowUnifiedModal(true);
  };

  const handleEditCar = (car) => {
    setModalMode("edit");
    setSelectedCarForEdit(car);
    setShowUnifiedModal(true);
  };

  const handleDeleteCar = (car) => {

    setModalMode("delete");
    setSelectedCarForEdit(car);
    setShowUnifiedModal(true);
  };

  const handleCloseUnifiedModal = () => {
    setShowUnifiedModal(false);
    setModalMode("add");
    setSelectedCarForEdit(null);
  };

  const handleCarAdded = () => {
    fetchCars();
    setShowUnifiedModal(false);
  };

  const handleCarUpdated = () => {
    fetchCars();
    setShowUnifiedModal(false);
  };

  const handleCarDeleted = () => {
    fetchCars(); // Refresh the cars list
    setShowUnifiedModal(false);
  };

  // Update car handler (legacy - for compatibility)
  const handleUpdateCar = (carId) => {
    const car = cars.find((c) => c._id === carId);
    if (car) {
      handleEditCar(car);
    }
  };

  // ✅ ADD: Edit car handler for modal
  const handleEditCarFromModal = (car) => {
    handleEditCar(car);
  };

  const handleDeleteCarFromModal = (car) => {
    handleDeleteCar(car);
  };

  // ✅ ADD: Quiet refresh function
  const fetchCarsQuietly = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.CAR_OWNER.GET_MY_CARS);

      if (response.data.success) {
        const fetchedCars = response.data.cars || [];

        const carsChanged =
          JSON.stringify(fetchedCars) !== JSON.stringify(cars);

        if (carsChanged) {
          setCars(fetchedCars);

          if (fetchedCars.length > 0) {
            await fetchBookingsQuietly(fetchedCars);
          }
        }
      }
    } catch (error) {
      console.error("Error in quiet refresh:", error);
    }
  };

  // ✅ ADD: Quiet booking refresh
  const fetchBookingsQuietly = async (carList = cars) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.BOOKING.GET_BOOKING_HISTORY
      );

      if (response.data.success) {
        const allBookings = response.data.bookingHistory || [];

        const bookingsChanged =
          JSON.stringify(allBookings) !== JSON.stringify(bookings);

        if (bookingsChanged) {
         
          setBookings(allBookings);
        }
      }
    } catch (error) {
      console.error("Error in quiet booking refresh:", error);
    }
  };

  // ✅ ADD: Manual refresh button
  const handleManualRefresh = async () => {
    toast.loading("Refreshing data...", { id: "refresh" });

    try {
      await fetchCars();
      toast.success("Data refreshed successfully!", { id: "refresh" });
    } catch (error) {
      toast.error("Failed to refresh data", { id: "refresh" });
    }
  };

  // ✅ ADD: Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.success(`Auto-refresh ${!autoRefresh ? "enabled" : "disabled"}`);
  };

  // ✅ ADD: Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && isAuthenticated && user?.role === "carOwner") {
      refreshIntervalRef.current = setInterval(() => {
        
        fetchCarsQuietly();
      }, 30000);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefresh, isAuthenticated, user]);

  // Auth loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          isDashboard={true}
          dashboardTitle="Car Owner Dashboard"
          showNotifications={false}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Critical error state
  if (criticalError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          isDashboard={true}
          dashboardTitle="Car Owner Dashboard"
          showNotifications={false}
        />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Dashboard Error
            </h3>
            <p className="text-gray-600 mb-6">{criticalError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isDashboard={true}
        dashboardTitle="Car Owner Dashboard"
        showNotifications={activeBookingsCount > 0}
        notificationCount={activeBookingsCount}
        userRole={user?.role}
        extraActions={
          <div className="flex items-center space-x-2">
            <button
              onClick={handleManualRefresh}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              title="Refresh data"
            >
              <FaSync className="w-4 h-4" />
            </button>
            <button
              onClick={toggleAutoRefresh}
              className={`p-2 transition-colors ${
                autoRefresh ? "text-green-600" : "text-gray-400"
              }`}
              title={`Auto-refresh: ${autoRefresh ? "ON" : "OFF"}`}
            >
              <FaClock className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <CarOwnerDashboardTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "overview" && (
          <OverviewTab
            user={user}
            cars={cars}
            bookings={bookings}
            loading={loading}
            onTabChange={handleTabChange}
            onAddCar={handleAddCar}
            onUpdateCar={handleUpdateCar}
          />
        )}

        {activeTab === "cars" && (
          <CarsTab
            cars={cars}
            loading={carsLoading}
            onAddCar={handleAddCar}
            onUpdateCar={handleUpdateCar}
            onRefresh={fetchCars}
            onEditCarFromModal={handleEditCarFromModal}
            onDeleteCar={handleDeleteCarFromModal}
            bookings={bookings}
          />
        )}

        {activeTab === "bookings" && (
          <BookingsTab
            bookings={bookings}
            cars={cars}
            loading={loading}
            onRefresh={() => fetchBookings(cars)}
          />
        )}

        {activeTab === "profile" && <ProfileTab user={user} />}

        {!["overview", "cars", "bookings", "profile"].includes(activeTab) && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tab Not Found
            </h3>
            <p className="text-gray-600 mb-4">
              The requested tab "{activeTab}" could not be found.
            </p>
            <button
              onClick={() => handleTabChange("overview")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Overview
            </button>
          </div>
        )}
      </div>

      {/* ✅ UPDATED: Use UnifiedCarModal */}
      <UnifiedCarModal
        isOpen={showUnifiedModal}
        onClose={handleCloseUnifiedModal}
        mode={modalMode}
        car={selectedCarForEdit}
        onCarAdded={handleCarAdded}
        onCarUpdated={handleCarUpdated}
        onCarDeleted={handleCarDeleted}
      />
    </div>
  );
};

export default CarOwnerDashboard;
