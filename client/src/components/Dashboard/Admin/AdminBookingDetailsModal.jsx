import React, { useState } from "react";
import { FaTimes, FaBan, FaSpinner, FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// ✅ Import existing BookingDetails components
import BookingHeader from "../../BookingDetails/BookingHeader";
import BookingCardInfo from "../../BookingDetails/BookingCardInfo";
import CarInfoCard from "../../BookingDetails/CarInfoCard";
import DriverInfoCard from "../../BookingDetails/DriverInfoCard";
import LocationInfoCard from "../../BookingDetails/LocationInfoCard";
import PricingCard from "../../BookingDetails/PricingCard";
import RideCodeCard from "../../BookingDetails/RideCodeCard";
import BookingActions from "../../BookingDetails/BookingActions";

const AdminBookingDetailsModal = ({
  booking,
  isOpen,
  onClose,
  onCancel,
  actionLoading = false,
}) => {
  const navigate = useNavigate();

  if (!isOpen || !booking) return null;

  // ✅ Check if booking can be cancelled
  const canCancelBooking = () => {
    return (
      !booking.isCancelled &&
      !booking.isCompleted &&
      booking.status !== "completed" &&
      onCancel
    );
  };

  // ✅ Handle view full page (navigate to dedicated booking details page)
  const handleViewFullPage = () => {
    // Store current location to return to admin dashboard
    sessionStorage.setItem("previousLocation", "/admin-dashboard");
    sessionStorage.setItem("previousTab", "bookings");

    // Navigate to dedicated booking details page
    navigate(`/booking-details/${booking._id}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-lg transition-all duration-300"
          onClick={onClose}
        />

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal Content */}
        <div className="relative inline-block w-full max-w-7xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-50 shadow-2xl rounded-3xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Booking Details - Admin View
                </h2>
                <p className="text-white/80">
                  Booking ID: #{booking._id.slice(-8)}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {/* View Full Page Button */}
                <button
                  onClick={handleViewFullPage}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/30"
                >
                  <FaExternalLinkAlt className="text-sm" />
                  <span>Full Page View</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {/* ✅ Booking Header - Reusing existing component */}
            <div className="mb-6">
              <BookingHeader booking={booking} />
            </div>

            {/* ✅ Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* ✅ Booking Card Info - Reusing existing component */}
                <BookingCardInfo booking={booking} />

                {/* ✅ Location Info - Reusing existing component */}
                <LocationInfoCard booking={booking} />

                {/* ✅ Car Info - Reusing existing component */}
                <CarInfoCard booking={booking} />

                {/* ✅ Driver Info - Reusing existing component (if driver exists) */}
                {booking.driverName && <DriverInfoCard booking={booking} />}

                {/* ✅ Ride Code - Reusing existing component (if exists) */}
                {booking.rideCode && <RideCodeCard booking={booking} />}
              </div>

              {/* Right Column - Actions & Pricing */}
              <div className="space-y-6">
                {/* ✅ Pricing Card - Reusing existing component */}
                <PricingCard booking={booking} />

                {/* ✅ Admin Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Admin Actions
                  </h3>

                  <div className="space-y-3">
                    {/* Cancel Booking Button */}
                    {canCancelBooking() && (
                      <button
                        onClick={onCancel}
                        disabled={actionLoading}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
                      >
                        {actionLoading ? (
                          <FaSpinner className="animate-spin text-lg" />
                        ) : (
                          <>
                            <FaBan className="text-lg" />
                            <span>Cancel Booking</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* View Full Page Button */}
                    <button
                      onClick={handleViewFullPage}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <FaExternalLinkAlt className="text-lg" />
                      <span>View Full Details</span>
                    </button>

                    {/* Admin Info */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2">
                        Admin Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Created:</span>
                          <span className="font-medium text-blue-900">
                            {new Date(booking.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        {booking.updatedAt !== booking.createdAt && (
                          <div className="flex justify-between">
                            <span className="text-blue-700">Last Updated:</span>
                            <span className="font-medium text-blue-900">
                              {new Date(booking.updatedAt).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-blue-700">Booking ID:</span>
                          <span className="font-mono text-blue-900 text-xs bg-blue-100 px-2 py-1 rounded">
                            {booking._id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ Booking Actions - Reusing existing component for additional actions */}
                <BookingActions booking={booking} isAdminView={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetailsModal;
