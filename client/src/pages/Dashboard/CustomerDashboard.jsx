import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-hot-toast";

// Existing imports
import { useAuth } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Navbar from "../../components/layouts/Navbar";
import CustomerDashboardTabs from "../../components/Dashboard/CustomerDashboardTab";
import CarsTab from "../../components/Dashboard/CarsTab";
import BookingsTab from "../../components/Dashboard/BookingsTab";
import ProfileTab from "../../components/Dashboard/ProfileTab";
import CarDetailsModal from "../../components/Dashboard/CarDetailsModal";

// Utility imports
import { validateDateRange } from "../../utils/dashboard/dateUtils";
import {
  filterCarsBySearch,
  getActiveTabFromURL,
  getActiveBookingsCount,
} from "../../utils/dashboard/customerDashboardUtils";
import { getBookingFilterCounts } from "../../utils/dashboard/bookingUtils";
import { getDashboardTabs } from "../../utils/data";

// ✅ ADD: Create a specific function for customer tabs (around line 25)
const getCustomerActiveTab = (location) => {
  const urlParams = new URLSearchParams(location.search);
  const tabFromQuery = urlParams.get("tab");

  const validTabs = ["cars", "bookings", "profile"];

  if (tabFromQuery && validTabs.includes(tabFromQuery)) {
    return tabFromQuery;
  }

  return "cars"; // Default tab for customer
};

const CustomerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [activeTab, setActiveTab] = useState(getCustomerActiveTab(location)); // ✅ FIXED: Use proper function
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carsLoading, setCarsLoading] = useState(false); // ✅ Separate loading for cars
  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [cancellingBooking, setCancellingBooking] = useState("");
  const [criticalError, setCriticalError] = useState(null); // ✅ Only for critical errors

  // New state for car details modal
  const [selectedCar, setSelectedCar] = useState(null);
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);

  // Date filtering state
  const [dateFilters, setDateFilters] = useState({
    startDate: "",
    endDate: "",
    isDateFilterActive: false,
  });

  // Computed values
  const tabs = getDashboardTabs("customer", { cars, bookings });
  const filteredCars = filterCarsBySearch(cars, searchTerm);
  const bookingCounts = getBookingFilterCounts(bookings);
  const activeBookingsCount = getActiveBookingsCount(bookings);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to access dashboard");
      navigate("/");
      return;
    }

    if (user.role !== "customer") {
      toast.error("Access denied. Customer account required.");
      navigate("/");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // URL sync
  useEffect(() => {
    const newTab = getCustomerActiveTab(location);
    if (newTab !== activeTab) {
      console.log("🔄 [CustomerDashboard] URL tab change detected:", {
        from: activeTab,
        to: newTab,
      });
      setActiveTab(newTab);
    }
  }, [location.search, location.pathname]); // ✅ FIXED: Listen to both pathname and search

  // ✅ FIXED: Data initialization - Handle each independently
  useEffect(() => {
    if (isAuthenticated && user?.role === "customer") {
      initializeDashboard();
    }
  }, [isAuthenticated, user]);

  // ✅ NEW: Initialize dashboard data independently
  const initializeDashboard = async () => {
    setLoading(true);
    setCriticalError(null);

    try {
      // Fetch both cars and bookings independently - don't let one failure affect the other
      await Promise.allSettled([
        fetchCars().catch(console.error), // Don't throw, just log
        fetchBookings().catch(console.error), // Don't throw, just log
      ]);
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
      navigate(`/dashboard/customer?tab=${tab}`, { replace: true });
    },
    [activeTab, navigate]
  );

  // Enhanced date filter change handler
  const handleDateFilterChange = (field, value) => {
    const newDateFilters = { ...dateFilters, [field]: value };
    setDateFilters(newDateFilters);

    // Clear end date if start date is changed to a later date
    if (field === "startDate" && newDateFilters.endDate) {
      const startDate = new Date(value);
      const endDate = new Date(newDateFilters.endDate);

      if (startDate > endDate) {
        setDateFilters({
          ...newDateFilters,
          endDate: "",
          isDateFilterActive: false,
        });
        toast.info("End date cleared. Please select a new end date.");
        return;
      }
    }

    // Enhanced validation when both dates are selected
    if (field === "endDate" && newDateFilters.startDate && value) {
      const validation = validateDateRange(newDateFilters.startDate, value);

      if (!validation.isValid) {
        toast.error(validation.error);
        setCars([]);
        setDateFilters((prev) => ({
          ...prev,
          isDateFilterActive: false,
        }));
        return;
      }

      setDateFilters((prev) => ({
        ...prev,
        isDateFilterActive: true,
      }));

      fetchCars(selectedCity, newDateFilters.startDate, value);

      if (validation.isSameDay) {
        toast.success("Showing cars available for same-day rental");
      } else {
        toast.success(
          `Showing cars available for ${validation.daysDifference} days`
        );
      }
    }

    // Validate when start date is being set and end date already exists
    if (field === "startDate" && newDateFilters.endDate && value) {
      const validation = validateDateRange(value, newDateFilters.endDate);

      if (!validation.isValid) {
        toast.error(validation.error);
        setCars([]);
        setDateFilters((prev) => ({
          ...prev,
          isDateFilterActive: false,
        }));
        return;
      }

      setDateFilters((prev) => ({
        ...prev,
        isDateFilterActive: true,
      }));

      fetchCars(selectedCity, value, newDateFilters.endDate);

      if (validation.isSameDay) {
        toast.success("Showing cars available for same-day rental");
      } else {
        toast.success(
          `Showing cars available for ${validation.daysDifference} days`
        );
      }
    }
  };

  // ✅ FIXED: Enhanced fetchCars - Don't throw critical errors
  const fetchCars = async (city = "", startDate = "", endDate = "") => {
    try {
      setCarsLoading(true);

      const params = new URLSearchParams();
      if (startDate && endDate) {
        const formattedStartDate = new Date(startDate)
          .toISOString()
          .split("T")[0];
        const formattedEndDate = new Date(endDate).toISOString().split("T")[0];
        params.append("startDate", formattedStartDate);
        params.append("endDate", formattedEndDate);
      }

      const url = city
        ? `${API_PATHS.CAR.GET_CARS_BY_CITY(city)}${
            params.toString() ? `?${params.toString()}` : ""
          }`
        : `${API_PATHS.CUSTOMER.GET_AVAILABLE_CARS}${
            params.toString() ? `?${params.toString()}` : ""
          }`;

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        const carsData = response.data.cars || response.data.data || [];
        setCars(carsData);

        setDateFilters((prev) => ({
          ...prev,
          isDateFilterActive: !!(startDate && endDate),
        }));

        // ✅ Only show success message if cars are found and dates are selected
        if (startDate && endDate) {
          if (carsData.length > 0) {
            toast.success(`Found ${carsData.length} available cars`);
          } else {
            toast.info("No cars available for selected dates");
          }
        }
      } else {
        // ✅ Handle "no cars found" gracefully - not an error
        setCars([]);
        if (response.data.message?.includes("No approved cars found")) {
          // This is normal, just set empty array
          console.log("No approved cars available");
        } else if (startDate && endDate) {
          toast.info("No cars available for selected dates");
        }
      }
    } catch (error) {
      console.error("Error fetching cars:", error);

      // ✅ Better error handling - Don't break the dashboard
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data.message || "Invalid date selection";
        toast.error(errorMessage);

        if (errorMessage.includes("past")) {
          setDateFilters({
            startDate: "",
            endDate: "",
            isDateFilterActive: false,
          });
        }
      } else if (error.response?.status === 404) {
        // ✅ 404 for no cars is normal, not an error
        setCars([]);
      } else {
        // ✅ Only show error for actual network/server issues
        toast.error("Failed to load cars. Please try again.");
      }

      setCars([]);
    } finally {
      setCarsLoading(false);
    }
  };

  // ✅ FIXED: Fetch bookings - Don't throw critical errors
  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.BOOKING.GET_BOOKING_HISTORY
      );

      if (response.data.success) {
        setBookings(response.data.bookingHistory || []);
      } else {
        // ✅ No bookings is normal, not an error
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // ✅ Don't break dashboard for booking fetch failures
      setBookings([]);

      // Only show error if it's not a 404 (no bookings found)
      if (error.response?.status !== 404) {
        console.warn(
          "Failed to fetch bookings, but dashboard will continue to work"
        );
      }
    }
  };

  // City change handler
  const handleCityChange = (city) => {
    setSelectedCity(city);
    fetchCars(city, dateFilters.startDate, dateFilters.endDate);
  };

  // Clear date filters
  const clearDateFilters = () => {
    setDateFilters({
      startDate: "",
      endDate: "",
      isDateFilterActive: false,
    });
    fetchCars(selectedCity);
    toast.success("Date filters cleared");
  };

  // Book car handler
  const handleBookCar = (car) => {
    setSelectedCar(car);
    setIsCarModalOpen(true);
  };

  // Proceed to booking page from modal
  const handleProceedToBooking = (car) => {
    setIsCarModalOpen(false);
    setSelectedCar(null);

    if (dateFilters.isDateFilterActive) {
      navigate(`/book-car/${car._id}`, {
        state: {
          car,
          prefilledDates: {
            startDate: dateFilters.startDate,
            endDate: dateFilters.endDate,
          },
        },
      });
    } else {
      navigate(`/book-car/${car._id}`, { state: { car } });
    }
  };

  // Modal close handler
  const handleCloseModal = () => {
    setIsCarModalOpen(false);
    setSelectedCar(null);
  };

  // Cancel booking handler
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancellingBooking(bookingId);
      const response = await axiosInstance.post(
        API_PATHS.BOOKING.CANCEL_BOOKING,
        { bookingId }
      );

      if (response.data.success) {
        toast.success("Booking cancelled successfully!");
        fetchBookings();
      } else {
        toast.error(response.data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingBooking("");
    }
  };

  // View booking details handler
  const handleViewBookingDetails = (bookingId) => {
    navigate(`/booking-details/${bookingId}`);
  };

  // ✅ FIXED: Loading state - Only show for initial load
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

  const handleBookingUpdate = () => {
    fetchBookings();
  };

  // ✅ FIXED: Only show critical error state for authentication/permission issues
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
        dashboardTitle="Customer Dashboard"
        showNotifications={activeBookingsCount > 0}
        notificationCount={activeBookingsCount}
        userRole={user?.role} // ✅ ENSURE: User role is passed
      />

      <CustomerDashboardTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ✅ Dashboard always loads - individual tabs handle their own loading/empty states */}
        {activeTab === "cars" && (
          <CarsTab
            dateFilters={dateFilters}
            filteredCars={filteredCars}
            selectedCity={selectedCity}
            searchTerm={searchTerm}
            loading={carsLoading} // ✅ Use separate cars loading state
            onDateFilterChange={handleDateFilterChange}
            onClearDateFilters={clearDateFilters}
            onCityChange={handleCityChange}
            onSearchChange={setSearchTerm}
            onBookCar={handleBookCar}
          />
        )}

        {activeTab === "bookings" && (
          <BookingsTab
            bookings={bookings}
            bookingFilter={bookingFilter}
            bookingCounts={bookingCounts}
            cancellingBooking={cancellingBooking}
            onFilterChange={setBookingFilter}
            onViewBookingDetails={handleViewBookingDetails}
            onCancelBooking={handleCancelBooking}
            onTabChange={handleTabChange}
            onBookingUpdate={handleBookingUpdate}
          />
        )}

        {activeTab === "profile" && <ProfileTab user={user} />}
      </div>

      {/* Car Details Modal */}
      <CarDetailsModal
        isOpen={isCarModalOpen}
        car={selectedCar}
        dateFilters={dateFilters}
        onClose={handleCloseModal}
        onBookCar={handleProceedToBooking}
      />
    </div>
  );
};

export default CustomerDashboard;
