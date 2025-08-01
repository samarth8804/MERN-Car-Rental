import React from "react";
import {
  calculateBookingAmounts,
  calculateRentalDays,
} from "../../utils/dashboard/bookingUtils";
import {
  FaRupeeSign,
  FaSnowflake,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";

const PricingCard = ({ booking }) => {
  if (!booking) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <FaRupeeSign className="text-green-500 mr-3" />
          Pricing Details
        </h2>
        <p className="text-gray-500">Loading pricing information...</p>
      </div>
    );
  }

  // ✅ CALCULATE EVERYTHING DYNAMICALLY
  const rentalDays = calculateRentalDays(booking.startDate, booking.endDate);
  const amounts = calculateBookingAmounts(booking, rentalDays);

  if (!amounts) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <FaRupeeSign className="text-green-500 mr-3" />
        {booking.isCancelled ? "Cancellation Details" : "Pricing Details"}
      </h2>

      <div className="space-y-4">
        {booking.isCancelled ? (
          /* ✅ CANCELLED BOOKING - Show all info in one place */
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-center mb-4">
              <FaTimesCircle className="text-red-500 text-3xl mx-auto mb-3" />
              <h3 className="font-bold text-red-900 text-lg mb-2">
                Booking Cancelled
              </h3>
              <p className="text-red-700 text-sm mb-4">
                {amounts.cancellationFine > 0
                  ? "Cancellation fee charged"
                  : "No charges applied"}
              </p>
            </div>

            {/* ✅ FIXED: Better structured cancellation fee display */}
            <div className="bg-white p-4 rounded-lg border border-red-200 mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center min-w-0 flex-1">
                  <FaRupeeSign className="text-red-600 mr-2 flex-shrink-0" />
                  <span className="text-red-700 font-semibold text-sm truncate">
                    Cancellation Fee
                  </span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className="text-red-700 font-bold text-xl">
                    ₹{amounts.cancellationFine}
                  </span>
                </div>
              </div>
            </div>

            {amounts.cancellationFine > 0 && (
              <div className="text-center">
                <div className="bg-red-100 px-3 py-2 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <FaInfoCircle className="text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700 text-xs font-medium leading-relaxed">
                      {amounts.cancellationFine === 500 &&
                        "Cancelled less than 24 hours before start"}
                      {amounts.cancellationFine === 300 &&
                        "Cancelled 24-48 hours before start"}
                      {amounts.cancellationFine === 100 &&
                        "Cancelled 48-72 hours before start"}
                      {amounts.cancellationFine === 1000 &&
                        "Cancelled after start date"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {amounts.cancellationFine === 0 && (
              <div className="text-center">
                <div className="bg-green-100 px-3 py-2 rounded-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0" />
                    <span className="text-green-700 text-sm font-medium">
                      Full refund processed
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ✅ NON-CANCELLED BOOKINGS - Fixed layout */
          <>
            <div className="space-y-3">
              {booking.isCompleted ? (
                /* ✅ COMPLETED BOOKING - Fixed amount display */
                <>
                  {/* Base Amount */}
                  <div className="flex justify-between items-center py-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-gray-600 text-sm font-medium truncate block">
                        Base Amount
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="text-gray-900 font-semibold">
                        ₹{amounts.baseAmount}
                      </span>
                    </div>
                  </div>

                  {/* AC Charges */}
                  {booking.isAC && amounts.acCharges > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                          <FaSnowflake className="text-blue-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600 text-sm font-medium truncate">
                            AC Charges (10%)
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="text-gray-900 font-semibold">
                          +₹{amounts.acCharges}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Late Return Fine */}
                  {amounts.lateReturnFine > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                          <FaExclamationTriangle className="text-red-500 mr-2 flex-shrink-0" />
                          <span className="text-red-600 text-sm font-medium truncate">
                            Late Return Fine
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="text-red-600 font-semibold">
                          +₹{amounts.lateReturnFine}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* ✅ UPCOMING/ACTIVE BOOKING - Fixed layout */
                <>
                  {/* Booking Info Header */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium text-sm">
                          Booking Type:
                        </span>
                        <span className="text-blue-900 font-semibold text-sm">
                          {booking.bookingType === "perDay"
                            ? "Per Day"
                            : "Per KM"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700 font-medium text-sm">
                          Duration:
                        </span>
                        <span className="text-blue-900 font-semibold text-sm">
                          {rentalDays} {rentalDays === 1 ? "Day" : "Days"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expected Base Amount */}
                  <div className="flex justify-between items-center py-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-gray-600 text-sm font-medium truncate block">
                        Expected Base Amount
                      </span>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className="text-gray-900 font-semibold">
                        ₹{amounts.baseAmount}
                      </span>
                    </div>
                  </div>

                  {/* Expected AC Charges */}
                  {booking.isAC && amounts.acCharges > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                          <FaSnowflake className="text-blue-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-600 text-sm font-medium truncate">
                            AC Charges (10%)
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="text-gray-900 font-semibold">
                          +₹{amounts.acCharges}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Per KM Info */}
                  {booking.bookingType === "perKm" && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <FaInfoCircle className="text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-yellow-700 text-xs font-medium block">
                            Minimum 1-day charge guaranteed
                          </span>
                          <p className="text-yellow-600 text-xs mt-1">
                            Final amount = max(KM-based rate, 1-day rate)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ✅ Total Amount Section - Fixed layout */}
            <div className="border-t pt-4">
              <div
                className={`p-4 rounded-lg ${
                  booking.isCompleted
                    ? "bg-green-50 border border-green-200"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center">
                      <FaRupeeSign
                        className={`mr-2 flex-shrink-0 ${
                          booking.isCompleted
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      />
                      <span
                        className={`font-bold text-base truncate ${
                          booking.isCompleted
                            ? "text-green-900"
                            : "text-blue-900"
                        }`}
                      >
                        {booking.isCompleted ? "Total Paid" : "Expected Total"}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span
                      className={`text-xl font-bold ${
                        booking.isCompleted ? "text-green-600" : "text-blue-600"
                      }`}
                    >
                      ₹{amounts.displayAmount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-3 flex items-center justify-center space-x-2">
                {booking.isCompleted ? (
                  <>
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="text-green-700 font-medium text-sm">
                      Payment Completed
                    </span>
                  </>
                ) : (
                  <>
                    <FaInfoCircle className="text-blue-500 flex-shrink-0" />
                    <span className="text-blue-700 font-medium text-sm">
                      {booking.isStarted ? "Ongoing Ride" : "Upcoming Booking"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
