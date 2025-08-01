import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSpinner, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Navbar from "../../components/layouts/Navbar";
import RatingModal from "../../components/common/RatingModal";

// Modular Components
import BookingHeader from "../../components/BookingDetails/BookingHeader";
import CarInfoCard from "../../components/BookingDetails/CarInfoCard";
import BookingCardInfo from "../../components/BookingDetails/BookingCardInfo";
import LocationInfoCard from "../../components/BookingDetails/LocationInfoCard";
import DriverInfoCard from "../../components/BookingDetails/DriverInfoCard";
import RideCodeCard from "../../components/BookingDetails/RideCodeCard";
import PricingCard from "../../components/BookingDetails/PricingCard";
import BookingActions from "../../components/BookingDetails/BookingActions";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Fetch booking details
  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.BOOKING.GET_SINGLE_BOOKING(bookingId)
      );

      if (response.data.success) {
        setBooking(response.data.booking);
      } else {
        toast.error("Booking not found");
        navigate("/dashboard/customer?tab=bookings");
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      toast.error("Failed to load booking details");
      navigate("/dashboard/customer?tab=bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  // ✅ Memoize expensive calculations
  const rentalDays = useMemo(() => {
    if (!booking) return 0;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
  }, [booking?.startDate, booking?.endDate]);

  // Cancel booking handler
  const handleCancelBooking = useCallback(async () => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setCancellingBooking(true);
      const response = await axiosInstance.post(
        API_PATHS.BOOKING.CANCEL_BOOKING,
        { bookingId: booking._id }
      );

      if (response.data.success) {
        toast.success("Booking cancelled successfully!");
        fetchBookingDetails();
      } else {
        toast.error(response.data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingBooking(false);
    }
  }, [booking?._id]);

  // Rating submitted handler
  const handleRatingSubmitted = useCallback(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  if (loading) {
    return (
      <>
        <Navbar isDashboard={true} dashboardTitle="Booking Details" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Navbar isDashboard={true} dashboardTitle="Booking Details" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The booking you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/dashboard/customer?tab=bookings")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Back to Bookings
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar isDashboard={true} dashboardTitle="Booking Details" />
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section with Unique Code */}
          <BookingHeader
            booking={booking}
            onBack={() => navigate("/dashboard/customer?tab=bookings")}
          />

          {/* ✅ UPDATED LAYOUT - Removed duplicate unique code sections */}
          <div className="space-y-6">
            {/* ✅ DESKTOP: Two-column grid */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
              {/* LEFT COLUMN */}
              <div className="space-y-6">
                {/* Vehicle Information */}
                <CarInfoCard booking={booking} />

                {/* Booking Information */}
                <BookingCardInfo booking={booking} rentalDays={rentalDays} />

                {/* Booking actions under booking info (DESKTOP ONLY) */}
                <BookingActions
                  booking={booking}
                  onCancelBooking={handleCancelBooking}
                  onOpenRating={() => setIsRatingModalOpen(true)}
                  cancellingBooking={cancellingBooking}
                />
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6">
                {/* Pricing Details */}
                <PricingCard booking={booking} />

                {/* Location & Driver Information */}
                <LocationInfoCard booking={booking} />
                <DriverInfoCard driver={booking.driver} />
              </div>
            </div>

            {/* ✅ MOBILE: Single column with actions at end */}
            <div className="lg:hidden space-y-6">
              {/* Vehicle Information */}
              <CarInfoCard booking={booking} />

              {/* Pricing Details */}
              <PricingCard booking={booking} />

              {/* Booking Information */}
              <BookingCardInfo booking={booking} rentalDays={rentalDays} />

              {/* Location & Driver Information */}
              <LocationInfoCard booking={booking} />
              <DriverInfoCard driver={booking.driver} />

              {/* ✅ ACTIONS AT THE END (MOBILE ONLY) */}
              <BookingActions
                booking={booking}
                onCancelBooking={handleCancelBooking}
                onOpenRating={() => setIsRatingModalOpen(true)}
                cancellingBooking={cancellingBooking}
              />
            </div>
          </div>
        </div>

        {/* Rating Modal */}
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          booking={booking}
          onRatingSubmitted={handleRatingSubmitted}
        />
      </div>
    </>
  );
};

export default BookingDetails;
