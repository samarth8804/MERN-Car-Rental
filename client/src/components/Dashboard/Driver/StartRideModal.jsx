import React, { useState } from "react";
import { FaPlay, FaTimes, FaSpinner, FaKey } from "react-icons/fa";

const StartRideModal = ({ isOpen, onClose, ride, onStartRide }) => {
  const [uniqueCode, setUniqueCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!uniqueCode.trim()) {
      setError("Please enter the unique code");
      return;
    }

    if (uniqueCode.length < 4) {
      setError("Unique code must be at least 4 characters");
      return;
    }

    setLoading(true);
    try {
      // ✅ FIXED: Don't close modal immediately, wait for success
      const result = await onStartRide(ride._id, uniqueCode.trim());

      // ✅ Only close modal if operation was successful
      if (result !== false) {
        setUniqueCode("");
        setError("");
        onClose();
      }
    } catch (error) {
      console.error("Start ride error:", error);
      // ✅ FIXED: Show proper error message
      setError(
        error.response?.data?.message ||
          error.message ||
          "Invalid unique code. Please try again."
      );
      // ✅ Don't close modal on error
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setUniqueCode("");
      setError("");
      onClose();
    }
  };

  // ✅ Helper functions to safely display location
  const getLocationDisplay = (location) => {
    if (!location) return "Not specified";
    if (typeof location === "string") return location;
    if (typeof location === "object" && location.address)
      return location.address;
    return "Location data unavailable";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/30 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <FaPlay className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Start Ride</h2>
              <p className="text-sm text-gray-600">
                {ride.car?.brand} {ride.car?.model}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-gray-700">
            Ready to start the ride? Please confirm the details and enter the
            unique code provided by the customer.
          </p>
        </div>

        {/* Ride Details */}
        <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4 mb-6 border border-gray-200/50">
          <h4 className="font-medium text-gray-900 mb-3">Ride Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Customer:</span>
              <span className="font-medium">
                {ride.customer?.fullname || "Not specified"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pickup:</span>
              <span className="font-medium">
                {getLocationDisplay(ride.pickupLocation)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Drop:</span>
              <span className="font-medium">
                {getLocationDisplay(ride.dropLocation)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Start Date:</span>
              <span className="font-medium">
                {new Date(ride.startDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">End Date:</span>
              <span className="font-medium">
                {new Date(ride.endDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">
                {Math.ceil(
                  (new Date(ride.endDate) - new Date(ride.startDate)) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaKey className="inline mr-2" />
              Enter Unique Code
            </label>
            <input
              type="text"
              value={uniqueCode}
              onChange={(e) => setUniqueCode(e.target.value)}
              placeholder="Enter the unique code provided by customer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
              disabled={loading}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Ask the customer for their unique booking code
            </p>
          </div>

          {/* ✅ ENHANCED: Better error display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50/90 disabled:cursor-not-allowed backdrop-blur-sm bg-white/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !uniqueCode.trim()}
              className="flex-1 px-4 py-3 bg-green-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-green-700/90 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Starting...</span>
                </>
              ) : (
                <>
                  <FaPlay />
                  <span>Start Ride</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartRideModal;
