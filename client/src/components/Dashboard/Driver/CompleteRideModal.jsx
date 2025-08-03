import React, { useState } from "react";
import {
  FaCheckCircle,
  FaTimes,
  FaSpinner,
  FaKey,
  FaRoute,
  FaCalendarAlt,
} from "react-icons/fa";

const CompleteRideModal = ({ isOpen, onClose, ride, onCompleteRide }) => {
  const [step, setStep] = useState(1); // 1: Details, 2: OTP
  const [formData, setFormData] = useState({
    uniqueCode: "",
    actualReturnDate: new Date().toISOString().slice(0, 10),
    kmTravelled: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rideSummary, setRideSummary] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep1 = () => {
    if (!formData.uniqueCode.trim()) {
      setError("Please enter the unique code");
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
    return true;
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateStep1()) return;

    setLoading(true);
    try {
      // ✅ Call backend without OTP first
      const result = await onCompleteRide(
        ride._id,
        formData.uniqueCode.trim(),
        formData.actualReturnDate,
        parseFloat(formData.kmTravelled),
        null // No OTP in first call
      );

      if (result?.needsOTP) {
        setRideSummary(result.summary);
        setStep(2); // Move to OTP step
      } else if (result?.completed) {
        // If somehow completed in one step
        handleClose();
      }
    } catch (error) {
      console.error("Error in step 1:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to process ride details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    if (formData.otp.length !== 4) {
      setError("OTP must be 4 digits");
      return;
    }

    setLoading(true);
    try {
      // ✅ Call backend with OTP to complete
      const result = await onCompleteRide(
        ride._id,
        formData.uniqueCode.trim(),
        formData.actualReturnDate,
        parseFloat(formData.kmTravelled),
        formData.otp.trim()
      );

      if (result?.completed) {
        handleClose();
      }
    } catch (error) {
      console.error("Error in step 2:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to complete ride"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetModal();
      onClose();
    }
  };

  const resetModal = () => {
    setStep(1);
    setFormData({
      uniqueCode: "",
      actualReturnDate: new Date().toISOString().slice(0, 10),
      kmTravelled: "",
      otp: "",
    });
    setError("");
    setRideSummary(null);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setFormData((prev) => ({ ...prev, otp: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-full bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/30 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FaCheckCircle className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Complete Ride</h2>
              <p className="text-sm text-gray-600">
                {step === 1 ? "Enter ride details" : "Enter OTP to complete"}
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

        {/* Progress Indicator */}
        <div className="flex items-center mb-6">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <div
            className={`flex-1 h-1 mx-2 ${
              step >= 2 ? "bg-blue-600" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
        </div>

        {/* Step 1: Ride Details */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                disabled={loading}
                required
              />
            </div>

            {/* Actual Return Date */}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                disabled={loading}
                required
              />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                disabled={loading}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

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
                className="flex-1 px-4 py-3 bg-blue-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-blue-700/90 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            {/* Ride Summary */}
            {rideSummary && (
              <div className="bg-green-50/90 backdrop-blur-sm border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-900 mb-2">
                  Ride Summary
                </h4>
                <div className="text-sm text-green-800 space-y-1">
                  <p>
                    <strong>Distance:</strong> {rideSummary.kmTravelled} km
                  </p>
                  <p>
                    <strong>Days:</strong> {rideSummary.actualDays}{" "}
                    {rideSummary.lateDays > 0 &&
                      `(+${rideSummary.lateDays} late)`}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹{rideSummary.totalAmount}
                  </p>
                  {rideSummary.lateReturnFine > 0 && (
                    <p>
                      <strong>Late Fine:</strong> ₹{rideSummary.lateReturnFine}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaKey className="inline mr-2" />
                Enter OTP
              </label>
              <input
                type="text"
                value={formData.otp}
                onChange={handleOtpChange}
                placeholder="Enter 4-digit OTP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest bg-white/90 backdrop-blur-sm"
                disabled={loading}
                maxLength={4}
                required
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Check your email for the 4-digit OTP
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50/90 disabled:cursor-not-allowed backdrop-blur-sm bg-white/80"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || formData.otp.length !== 4}
                className="flex-1 px-4 py-3 bg-blue-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-blue-700/90 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Completing...</span>
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    <span>Complete Ride</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CompleteRideModal;
