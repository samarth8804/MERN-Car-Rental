import React from "react";
import {
  FaCheckCircle,
  FaCar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaIdCard,
  FaUser,
} from "react-icons/fa";
import { formatDateIndian } from "../../utils/dashboard/dateUtils"; // ✅ Import Indian date formatter

const BookingConfirmation = ({
  bookingData,
  car,
  onBackToDashboard,
  onBookAnother,
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
          <FaCheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 text-lg">
          Your car has been successfully booked.
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Booking Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Booking Details
              </h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FaIdCard className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Booking ID</p>
                    <p className="font-semibold text-gray-900">
                      #{bookingData._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaCar className="text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="font-semibold text-gray-900">
                      {car.brand} {car.model} ({car.licensePlate})
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaCalendarAlt className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Rental Period</p>
                    <p className="font-semibold text-gray-900">
                      {/* ✅ Changed to Indian date format */}
                      {formatDateIndian(bookingData.startDate)} to{" "}
                      {formatDateIndian(bookingData.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FaRupeeSign className="text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">Booking Type</p>
                    <p className="font-semibold text-gray-900">
                      {bookingData.bookingType === "perDay"
                        ? "Per Day"
                        : "Per KM"}
                      {bookingData.isAC ? " • With AC" : " • Without AC"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Locations</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-green-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Pickup</p>
                    <p className="text-sm text-gray-900">
                      {bookingData.pickupLocation.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-red-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Drop</p>
                    <p className="text-sm text-gray-900">
                      {bookingData.dropLocation.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Next Steps */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              What's Next?
            </h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Pickup</p>
                  <p className="text-sm text-blue-700">
                    Please arrive at your pickup location on the scheduled date
                    and time with your booking confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Unique Code */}
            <div className="mt-6 p-4 bg-white rounded-lg border-2 border-dashed border-blue-300">
              <p className="text-sm text-blue-700 mb-1">Your Unique Code:</p>
              <p className="text-2xl font-bold text-blue-900 font-mono">
                {bookingData.uniqueCode}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Keep this code for booking verification
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onBackToDashboard}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition duration-200 flex items-center justify-center space-x-2"
        >
          <FaUser />
          <span>View My Bookings</span>
        </button>

        <button
          onClick={onBookAnother}
          className="px-8 py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition duration-200 flex items-center justify-center space-x-2"
        >
          <FaCar />
          <span>Book Another Car</span>
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
