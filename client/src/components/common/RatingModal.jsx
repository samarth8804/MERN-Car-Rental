import React, { useState } from "react";
import { FaTimes, FaStar, FaCar, FaUser } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance"; // ✅ USE AXIOS INSTANCE

const RatingModal = ({ isOpen, onClose, booking, onRatingSubmitted }) => {
  const [driverRating, setDriverRating] = useState(0);
  const [carRating, setCarRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const StarRating = ({ rating, setRating, label, icon: Icon }) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Icon className="text-blue-500" />
          <h3 className="font-semibold text-gray-900">{label}</h3>
        </div>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl transition-colors ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              } hover:text-yellow-400`}
            >
              <FaStar />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          {rating === 0 && "Click to rate"}
          {rating === 1 && "Poor"}
          {rating === 2 && "Fair"}
          {rating === 3 && "Good"}
          {rating === 4 && "Very Good"}
          {rating === 5 && "Excellent"}
        </p>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (driverRating === 0 || carRating === 0) {
      toast.error("Please rate both driver and car");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ FIXED - Use axiosInstance instead of fetch
      const response = await axiosInstance.post(API_PATHS.CUSTOMER.RATE_RIDE, {
        bookingId: booking._id,
        driverRating,
        carRating,
        comment: comment.trim(),
      });

      if (response.data.success) {
        toast.success("Thank you for rating your ride!");
        onRatingSubmitted();
        onClose();
        // Reset form
        setDriverRating(0);
        setCarRating(0);
        setComment("");
      } else {
        toast.error(response.data.message || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Rate Your Ride</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Booking Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">
              {booking.car?.brand} {booking.car?.model}
            </h3>
            <p className="text-sm text-gray-600">
              {new Date(booking.startDate).toLocaleDateString()} -{" "}
              {new Date(booking.endDate).toLocaleDateString()}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Driver Rating */}
            <StarRating
              rating={driverRating}
              setRating={setDriverRating}
              label="Rate Your Driver"
              icon={FaUser}
            />

            {/* Car Rating */}
            <StarRating
              rating={carRating}
              setRating={setCarRating}
              label="Rate the Car"
              icon={FaCar}
            />

            {/* Comment */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Additional Comments (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Share your experience..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500">
                {comment.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || driverRating === 0 || carRating === 0}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
