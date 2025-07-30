import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaCar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaSpinner,
  FaArrowLeft,
  FaSnowflake,
  FaUser,
  FaPhone,
  FaIdCard,
  FaCheckCircle,
} from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";

// Components
import Navbar from "../../components/layouts/Navbar";
import BookingForm from "../../components/Booking/BookingForm";
import CarSummaryCard from "../../components/Booking/CarSummaryCard";
import PricingBreakdown from "../../components/Booking/PricingBreakdown";
import BookingConfirmation from "../../components/Booking/BookingConfirmation";

// Utils and Context
import { useAuth } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  validateDateRange,
  calculateRentalDays,
} from "../../utils/dashboard/dateUtils";

const CarBookingPage = () => {
  const { carId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // State management
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState("form"); // 'form', 'confirmation'
  const [bookingData, setBookingData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  // ✅ FIXED: Proper initial form data structure with all required fields
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    bookingType: "perDay",
    isAC: false,
    pickupLocation: {
      address: "",
      coordinates: {
        latitude: null,
        longitude: null,
      },
      placeId: null,
      name: "",
      source: "",
      isCurrentLocation: false,
    },
    dropLocation: {
      address: "",
      coordinates: {
        latitude: null,
        longitude: null,
      },
      placeId: null,
      name: "",
      source: "",
      isCurrentLocation: false,
    },
  });

  // Pricing calculation
  const [pricingDetails, setPricingDetails] = useState({
    duration: 0,
    dailyRate: 0,
    kmRate: 0,
    baseAmount: 0,
    acCharges: 0,
    totalAmount: 0,
    isSameDay: false,
  });

  // Authentication and access control
  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to book a car");
      navigate("/");
      return;
    }

    if (user.role !== "customer") {
      toast.error("Only customers can book cars");
      navigate("/dashboard/customer");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Initialize form with pre-filled data from navigation state
  useEffect(() => {
    const stateData = location.state;
    if (stateData?.prefilledDates) {
      setFormData((prev) => ({
        ...prev,
        startDate: stateData.prefilledDates.startDate,
        endDate: stateData.prefilledDates.endDate,
      }));
    }
  }, [location.state]);

  // Fetch car details
  useEffect(() => {
    if (carId && isAuthenticated) {
      fetchCarDetails();
    }
  }, [carId, isAuthenticated]);

  // Calculate pricing when form data changes
  useEffect(() => {
    if (car && formData.startDate && formData.endDate) {
      calculatePricing();
    }
  }, [
    car,
    formData.startDate,
    formData.endDate,
    formData.isAC,
    formData.bookingType,
  ]);

  const fetchCarDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.CAR.GET_CAR_DETAILS(carId)
      );

      if (response.data.success) {
        setCar(response.data.car);
      } else {
        toast.error("Car not found");
        navigate("/dashboard/customer");
      }
    } catch (error) {
      console.error("Error fetching car details:", error);
      toast.error("Failed to load car details");
      navigate("/dashboard/customer");
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = () => {
    if (!car || !formData.startDate || !formData.endDate) return;

    // ✅ FIXED: Use inclusive date calculation
    const duration = calculateRentalDays(formData.startDate, formData.endDate);
    const isSameDay = formData.startDate === formData.endDate;

    const dailyRate = car.pricePerDay;
    const kmRate = car.pricePerKm;

    // ✅ FIXED: Base amount calculation with minimum 1-day guarantee
    let baseAmount = 0;
    let minimumChargeNote = "";

    if (formData.bookingType === "perDay") {
      baseAmount = dailyRate * duration;
    } else {
      // ✅ CRITICAL: For per-KM, show minimum 1-day charge guarantee
      const estimatedKmAmount = kmRate * 100; // Assume 100km as estimate
      const minimumDayCharge = dailyRate;

      baseAmount = Math.max(estimatedKmAmount, minimumDayCharge);

      if (minimumDayCharge > estimatedKmAmount) {
        minimumChargeNote = "Minimum 1-day charge applied";
      }
    }

    // AC charges (10% extra if AC is selected)
    const acCharges = formData.isAC ? Math.round(baseAmount * 0.1) : 0;
    const totalAmount = baseAmount + acCharges;

    setPricingDetails({
      duration,
      dailyRate,
      kmRate,
      baseAmount,
      acCharges,
      totalAmount,
      isSameDay,
      minimumChargeNote, // ✅ Add note about minimum charge
    });
  };

  const handleFormSubmit = async (formDataToSubmit) => {
    try {
      setIsSubmitting(true);

      // Validate dates
      const validation = validateDateRange(
        formDataToSubmit.startDate,
        formDataToSubmit.endDate
      );
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      // Submit booking
      const response = await axiosInstance.post(API_PATHS.CUSTOMER.BOOK_CAR, {
        carId: carId,
        ...formDataToSubmit,
      });

      if (response.data.success) {
        setBookingData(response.data.booking);
        setBookingStep("confirmation");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Failed to book car");
      }
    } catch (error) {
      console.error("Error booking car:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to book car. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard/customer?tab=bookings");
  };

  const handleBookAnother = () => {
    navigate("/dashboard/customer?tab=cars");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isDashboard={true} dashboardTitle="Book Car" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading car details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Car not found
  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar isDashboard={true} dashboardTitle="Book Car" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <MdDirectionsCar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Car not found
            </h3>
            <button
              onClick={() => navigate("/dashboard/customer")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isDashboard={true} dashboardTitle="Book Car" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        {bookingStep === "form" ? (
          <>
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Book Your Car
              </h1>
              <p className="text-gray-600">
                Complete the details below to book your perfect ride
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Booking Form */}
              <div className="lg:col-span-2">
                <BookingForm
                  car={car}
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                  pricingDetails={pricingDetails}
                />
              </div>

              {/* Right Column - Car Summary & Pricing */}
              <div className="space-y-6">
                <CarSummaryCard car={car} />
                {formData.startDate && formData.endDate && (
                  <PricingBreakdown
                    formData={formData}
                    pricingDetails={pricingDetails}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          /* Booking Confirmation */
          <BookingConfirmation
            bookingData={bookingData}
            car={car}
            onBackToDashboard={handleBackToDashboard}
            onBookAnother={handleBookAnother}
          />
        )}
      </div>
    </div>
  );
};

export default CarBookingPage;
