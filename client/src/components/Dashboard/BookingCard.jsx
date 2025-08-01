import React, { useState } from "react";
import {
  FaCar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaUser,
  FaIdCard,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaStar,
  FaSpinner,
  FaPhone,
} from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";
import RatingModal from "../common/RatingModal";
import {
  getBookingStatus,
  canCancelBooking,
} from "../../utils/dashboard/bookingUtils";
import { formatDateTimeIndian } from "../../utils/dashboard/dateUtils";

const BookingCard = ({
  booking,
  onViewDetails,
  onCancelBooking,
  cancellingBooking,
  onBookingUpdate,
}) => {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const statusInfo = getBookingStatus(booking);
  const StatusIcon = statusInfo.icon;
  const canCancel = canCancelBooking(booking);

  // ✅ CHECK IF BOOKING CAN BE RATED
  const canRateBooking = booking.isCompleted && !booking.isRated;

  const handleRatingSubmitted = () => {
    // Update the booking object to reflect that it's been rated
    if (onBookingUpdate) {
      onBookingUpdate();
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
        // No onClick here!
      >
        <div className="p-6">
          {/* Booking Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <FaIdCard className="text-blue-500" />
                <span className="text-sm font-medium">
                  #{booking._id?.slice(-8).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Car Information */}
          <div className="mb-4">
            <div className="flex items-center space-x-3 mb-2">
              <FaCar className="text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.car?.brand} {booking.car?.model}
              </h3>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600 text-sm">
                {booking.car?.licensePlate}
              </span>
            </div>
          </div>

          {/* Location & Date Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <FaMapMarkerAlt className="text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Pickup</p>
                  <p className="text-gray-600 text-xs">
                    {booking.pickupLocation?.address}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <FaMapMarkerAlt className="text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Drop-off</p>
                  <p className="text-gray-600 text-xs">
                    {booking.dropLocation?.address}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-blue-500" />
                <div>
                  <p className="font-medium text-gray-700">Start Date</p>
                  <p className="text-gray-600 text-xs">
                    {formatDateTimeIndian(booking.startDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-orange-500" />
                <div>
                  <p className="font-medium text-gray-700">End Date</p>
                  <p className="text-gray-600 text-xs">
                    {formatDateTimeIndian(booking.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(booking._id);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <FaUser />
              <span>View Details</span>
            </button>
            {canCancel && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelBooking(booking._id);
                }}
                disabled={cancellingBooking === booking._id}
                className={`flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 ${
                  cancellingBooking === booking._id
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                <FaTimes />
                <span>
                  {cancellingBooking === booking._id
                    ? "Cancelling..."
                    : "Cancel"}
                </span>
              </button>
            )}
            {canRateBooking && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRatingModalOpen(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors duration-200"
              >
                <FaStar />
                <span>Rate Ride</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ✅ RATING MODAL */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        booking={booking}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </>
  );
};

export default BookingCard;
