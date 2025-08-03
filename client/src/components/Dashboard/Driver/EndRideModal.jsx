import React, { useState } from "react";
import {
  FaStop,
  FaTimes,
  FaSpinner,
  FaKey,
  FaRoute,
  FaCalendarAlt,
} from "react-icons/fa";

const EndRideModal = ({ isOpen, onClose, ride, onEndRide }) => {
  const [formData, setFormData] = useState({
    uniqueCode: "",
    actualReturnDate: new Date().toISOString().slice(0, 10), // ✅ Only date (YYYY-MM-DD)
    kmTravelled: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.uniqueCode.trim()) {
      setError("Please enter the unique code");
      return false;
    }

    if (formData.uniqueCode.length < 4) {
      setError("Unique code must be at least 4 characters");
      return false;
    }

    if (!formData.actualReturnDate) {
      setError("Please select return date");
      return false;
    }

    if (!formData.kmTravelled || parseFloat(formData.kmTravelled) <= 0) {
      setError("Please enter valid distance travelled");
      return false;
    }

    if (parseFloat(formData.kmTravelled) > 10000) {
      setError("Distance seems unrealistic (max 10,000 km)");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await onEndRide(
        ride._id,
        formData.uniqueCode.trim(),
        formData.actualReturnDate,
        parseFloat(formData.kmTravelled)
      );

      // ✅ Return success immediately - don't close modal yet
      if (result === true) {
        // Modal will be closed by parent component
        // CompleteRideModal will open automatically
        return true;
      }
    } catch (error) {
      console.error("End ride error:", error);
      setError(
        error.response?.data?.message || error.message || "Failed to end ride"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      uniqueCode: "",
      actualReturnDate: new Date().toISOString().slice(0, 10), // ✅ Reset to today's date
      kmTravelled: "",
    });
    setError("");
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/30 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <FaStop className="text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">End Ride</h2>
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
            Ready to end the ride? Please confirm the details and provide the
            required information.
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
              <span className="text-gray-600">Started:</span>
              <span className="font-medium">
                {new Date(ride.startDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Unique Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaKey className="inline mr-2" />
              Unique Code
            </label>
            <input
              type="text"
              name="uniqueCode"
              value={formData.uniqueCode}
              onChange={handleInputChange}
              placeholder="Enter the unique code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
              disabled={loading}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Ask the customer for their unique booking code
            </p>
          </div>

          {/* ✅ UPDATED: Actual Return Date (Date Only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2" />
              Actual Return Date
            </label>
            <input
              type="date"
              name="actualReturnDate"
              value={formData.actualReturnDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
              disabled={loading}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Select the date when the ride was actually returned
            </p>
          </div>

          {/* Distance Travelled */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaRoute className="inline mr-2" />
              Distance Travelled (KM)
            </label>
            <input
              type="number"
              name="kmTravelled"
              value={formData.kmTravelled}
              onChange={handleInputChange}
              placeholder="Enter kilometers travelled"
              min="0.1"
              step="0.1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
              disabled={loading}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the total distance covered during this ride
            </p>
          </div>

          {/* ✅ Enhanced Error Display */}
          {error && (
            <div className="p-3 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
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
              disabled={loading}
              className="flex-1 px-4 py-3 bg-yellow-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-yellow-700/90 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Ending...</span>
                </>
              ) : (
                <>
                  <FaStop />
                  <span>End Ride</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50/90 backdrop-blur-sm border border-blue-200 rounded-lg">
          <p className="text-blue-600 text-sm">
            <strong>Next Step:</strong> After ending the ride, you'll receive an
            OTP via email to complete the ride and finalize your earnings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EndRideModal;
