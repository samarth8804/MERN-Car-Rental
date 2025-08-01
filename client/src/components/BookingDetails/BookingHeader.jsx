import React from "react";
import { FaArrowLeft, FaKey, FaCopy } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getBookingStatus } from "../../utils/dashboard/bookingUtils";

const BookingHeader = ({ booking, onBack }) => {
  const statusInfo = getBookingStatus(booking);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition duration-200 hover:bg-blue-50 px-3 py-2 rounded-lg"
      >
        <FaArrowLeft />
        <span>Back to Bookings</span>
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Details
            </h1>
            <p className="text-gray-600">
              Booking ID: #{booking._id?.slice(-8).toUpperCase()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Created on{" "}
              {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <StatusIcon className={`text-2xl ${statusInfo.color}`} />
            <span
              className={`px-4 py-2 rounded-full text-lg font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}
            >
              {statusInfo.status}
            </span>
          </div>
        </div>

        {/* Payment Status */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">
                Payment Status:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.paymentStatus === "completed"
                    ? "bg-green-100 text-green-800"
                    : booking.paymentStatus === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {booking.paymentStatus?.charAt(0).toUpperCase() +
                  booking.paymentStatus?.slice(1)}
              </span>
            </div>

            {/* ✅ UNIQUE CODE - Added to far right */}
            {booking.uniqueCode && (
              <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <FaKey className="text-blue-600 text-sm" />
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-blue-600 font-medium">
                    Code:
                  </span>
                  <span className="text-sm font-mono font-bold text-blue-800">
                    {booking.uniqueCode}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingHeader;
