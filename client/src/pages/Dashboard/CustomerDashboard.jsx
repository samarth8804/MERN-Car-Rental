import { useState, useEffect } from "react";
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
import CarDetailsModal from "../../components/Dashboard/CarDetailsModal"; // New import

// Utility imports
import { validateDateRange } from "../../utils/dashboard/dateUtils";
import {
  filterCarsBySearch,
  getActiveTabFromURL,
  getActiveBookingsCount,
} from "../../utils/dashboard/customerDashboardUtils";
import { getBookingFilterCounts } from "../../utils/dashboard/bookingUtils";
import { getDashboardTabs } from "../../utils/data";

const CustomerDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [activeTab, setActiveTab] = useState(getActiveTabFromURL(location));
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [cancellingBooking, setCancellingBooking] = useState("");
  const [error, setError] = useState(null);

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
    const tabFromURL = getActiveTabFromURL(location);
    if (tabFromURL !== activeTab) {
      setActiveTab(tabFromURL);
    }
  }, [location.search, activeTab]);

  // Data initialization
  useEffect(() => {
    if (isAuthenticated && user?.role === "customer") {
      fetchCars();
      fetchBookings();
    }
  }, [isAuthenticated, user]);

  // Tab change handler
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("tab", tab);
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  // Enhanced date filter change handler - Fixed to prevent API calls on validation failure
  const handleDateFilterChange = (field, value) => {
    const newDateFilters = { ...dateFilters, [field]: value };
    setDateFilters(newDateFilters);

    // Clear end date if start date is changed to a later date
    if (field === "startDate" && newDateFilters.endDate) {
      const startDate = new Date(value);
      const endDate = new Date(newDateFilters.endDate);

      // Fixed: Only clear if start date is actually after end date
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

        // Fixed: Clear cars and prevent API call when validation fails
        setCars([]);
        setDateFilters((prev) => ({
          ...prev,
          isDateFilterActive: false,
        }));
        return; // Don't proceed with API call
      }

      // If validation passes, fetch cars with date filters
      setDateFilters((prev) => ({
        ...prev,
        isDateFilterActive: true,
      }));

      fetchCars(selectedCity, newDateFilters.startDate, value);

      // Show appropriate success message for same-day vs multi-day
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

        // Fixed: Clear cars and prevent API call when validation fails
        setCars([]);
        setDateFilters((prev) => ({
          ...prev,
          isDateFilterActive: false,
        }));
        return; // Don't proceed with API call
      }

      // If validation passes, fetch cars with date filters
      setDateFilters((prev) => ({
        ...prev,
        isDateFilterActive: true,
      }));

      fetchCars(selectedCity, value, newDateFilters.endDate);

      // Show appropriate success message for same-day vs multi-day
      if (validation.isSameDay) {
        toast.success("Showing cars available for same-day rental");
      } else {
        toast.success(
          `Showing cars available for ${validation.daysDifference} days`
        );
      }
    }
  };

  // Enhanced fetchCars function with better error handling
  const fetchCars = async (city = "", startDate = "", endDate = "") => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (startDate && endDate) {
        // Ensure dates are in YYYY-MM-DD format
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

        if (startDate && endDate && carsData.length > 0) {
          toast.success(`Found ${carsData.length} available cars`);
        } else if (startDate && endDate && carsData.length === 0) {
          toast.info("No cars available for selected dates");
        }
      } else {
        setCars([]);
        if (startDate && endDate) {
          toast.info("No cars available for selected dates");
        } else {
          toast.error(response.data.message || "Failed to fetch cars");
        }
      }
    } catch (error) {
      console.error("Error fetching cars:", error);

      // Better error handling
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data.message || "Invalid date selection";
        toast.error(errorMessage);

        // If it's a date validation error, clear the problematic date
        if (errorMessage.includes("past")) {
          setDateFilters({
            startDate: "",
            endDate: "",
            isDateFilterActive: false,
          });
        }
      } else {
        setError("Failed to load cars. Please try again.");
        toast.error("Failed to load cars. Please try again.");
      }

      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.BOOKING.GET_BOOKING_HISTORY
      );

      if (response.data.success) {
        setBookings(response.data.bookingHistory || []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
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

  // Updated Book car handler - now opens modal first
  const handleBookCar = (car) => {
    setSelectedCar(car);
    setIsCarModalOpen(true);
  };

  // New handler for proceeding to booking page from modal
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
      const response = await axiosInstance.put(
        API_PATHS.BOOKING.CANCEL_BOOKING(bookingId)
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

  // Loading state
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
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
      />

      <CustomerDashboardTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "cars" && (
          <CarsTab
            dateFilters={dateFilters}
            filteredCars={filteredCars}
            selectedCity={selectedCity}
            searchTerm={searchTerm}
            loading={loading}
            onDateFilterChange={handleDateFilterChange}
            onClearDateFilters={clearDateFilters}
            onCityChange={handleCityChange}
            onSearchChange={setSearchTerm}
            onBookCar={handleBookCar} // This now opens the modal
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
