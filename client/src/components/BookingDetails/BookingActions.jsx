import React from "react";
import { FaTimes, FaStar } from "react-icons/fa";
import { canCancelBooking } from "../../utils/dashboard/bookingUtils";

const BookingActions = ({
  booking,
  onCancelBooking,
  onOpenRating,
  cancellingBooking,
}) => {
  const canCancel = canCancelBooking(booking);
  const canRateBooking = booking.isCompleted && !booking.isRated;

  if (!canCancel && !canRateBooking) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
      <div className="space-y-3">
        {canCancel && (
          <button
            onClick={onCancelBooking}
            disabled={cancellingBooking}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 ${
              cancellingBooking ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <FaTimes />
            <span>
              {cancellingBooking ? "Cancelling..." : "Cancel Booking"}
            </span>
          </button>
        )}
        {canRateBooking && (
          <button
            onClick={onOpenRating}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors duration-200"
          >
            <FaStar />
            <span>Rate Your Ride</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingActions;
