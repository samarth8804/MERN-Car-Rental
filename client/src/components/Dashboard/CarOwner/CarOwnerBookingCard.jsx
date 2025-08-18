import React, { useState } from "react";
import {
  FaCar,
  FaUser,
  FaPhone,
  FaEye,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaStar,
  FaRegStar,
  FaRoute,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getBookingStatus } from "../../../utils/dashboard/bookingUtils";
import { calculateRentalDays } from "../../../utils/dashboard/dateUtils";
import { formatDateTimeIndian } from "../../../utils/dashboard/dateUtils";
import BookingCardInfo from "../../BookingDetails/BookingCardInfo";

const CarOwnerBookingCard = ({ booking, onViewDetails }) => {
  const [showDetails, setShowDetails] = useState(false);

  const status = getBookingStatus(booking);
  const rentalDays = calculateRentalDays(booking.startDate, booking.endDate);

  // ✅ Get car rating for this booking
  const getCarRating = () => {
    if (booking.isCompleted && booking.isRated && booking.carRating) {
      return {
        rating: booking.carRating,
        hasRating: true,
        comment: booking.ratingComment || "",
      };
    }
    return {
      rating: 0,
      hasRating: false,
      comment: "",
    };
  };

  const carRating = getCarRating();

  // ✅ Render star rating display
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i}>
          {i <= rating ? (
            <FaStar className="text-yellow-400" />
          ) : (
            <FaRegStar className="text-gray-300" />
          )}
        </span>
      );
    }
    return stars;
  };

  // ✅ Get status icon and colors
  const getStatusIcon = () => {
    if (booking.isCancelled) {
      return { icon: FaTimesCircle, color: "text-red-500" };
    }
    if (booking.isCompleted) {
      return { icon: FaCheckCircle, color: "text-green-500" };
    }
    if (booking.isStarted) {
      return { icon: FaRoute, color: "text-blue-500" };
    }
    if (new Date(booking.startDate) > new Date()) {
      return { icon: FaClock, color: "text-blue-500" };
    }
    return { icon: FaExclamationTriangle, color: "text-yellow-500" };
  };

  const statusIcon = getStatusIcon();
  const StatusIconComponent = statusIcon.icon;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaCar className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {booking.car?.brand} {booking.car?.model}
                </h3>
                <p className="text-gray-600 text-sm">
                  {booking.car?.licensePlate} • {booking.car?.year}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-2">
                <StatusIconComponent
                  className={`${statusIcon.color} text-lg`}
                />
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.isCompleted
                      ? "bg-green-100 text-green-800"
                      : booking.isCancelled
                      ? "bg-red-100 text-red-800"
                      : booking.isStarted
                      ? "bg-blue-100 text-blue-800"
                      : new Date(booking.startDate) > new Date()
                      ? "bg-orange-100 text-orange-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {status.status}
                </span>
              </div>

              {/* ✅ Car Rating Badge - Only in header */}
              {carRating.hasRating && (
                <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200">
                  <FaStar className="text-yellow-500 text-sm" />
                  <span className="text-yellow-700 font-medium text-sm">
                    {carRating.rating}★
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaUser className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">
                  {booking.customer?.fullname}
                </p>
                <p className="text-sm text-gray-600">
                  {booking.customer?.email}
                </p>
              </div>
            </div>
            {booking.customer?.phone && (
              <a
                href={`tel:${booking.customer.phone}`}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FaPhone />
                <span className="hidden sm:inline">
                  {booking.customer.phone}
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* ✅ Booking Information - 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 text-sm">
            {/* Pickup Location */}
            <div className="flex items-start space-x-3">
              <FaMapMarkerAlt className="text-green-500 mt-1" />
              <div>
                <p className="text-gray-500 font-medium">Pickup</p>
                <p className="text-gray-900 font-semibold">
                  {booking.pickupLocation?.address || booking.pickupLocation}
                </p>
              </div>
            </div>

            {/* Drop Location */}
            <div className="flex items-start space-x-3">
              <FaMapMarkerAlt className="text-red-500 mt-1" />
              <div>
                <p className="text-gray-500 font-medium">Drop</p>
                <p className="text-gray-900 font-semibold">
                  {booking.dropLocation?.address || booking.dropLocation}
                </p>
              </div>
            </div>

            {/* Start Date */}
            <div className="flex items-start space-x-3">
              <FaCalendarAlt className="text-blue-500 mt-1" />
              <div>
                <p className="text-gray-500 font-medium">Start Date</p>
                <p className="text-gray-900 font-semibold">
                  {formatDateTimeIndian(booking.startDate)}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-start space-x-3">
              <FaClock className="text-purple-500 mt-1" />
              <div>
                <p className="text-gray-500 font-medium">Duration</p>
                <p className="text-gray-900 font-semibold">
                  {rentalDays} {rentalDays === 1 ? "Day" : "Days"}
                </p>
              </div>
            </div>
          </div>

          {/* ✅ UPDATED: Financial Information - Only Total Booking Amount */}
          <div className="mb-6">
            {/* Total Booking Amount */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 font-medium text-sm">
                    Total Booking Amount
                  </p>
                  <p className="text-blue-800 font-bold text-xl">
                    ₹{booking.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <FaRupeeSign className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          {/* ✅ Distance Information - Only for completed rides */}
          {booking.isCompleted && booking.kmTravelled > 0 && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FaRoute className="text-gray-600 text-lg" />
                <div>
                  <p className="text-gray-600 font-medium text-sm">
                    Distance Travelled
                  </p>
                  <p className="text-gray-800 font-bold text-lg">
                    {booking.kmTravelled} km
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ✅ No Rating Message for Completed Rides */}
          {booking.isCompleted && !carRating.hasRating && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-600 text-sm text-center">
                <FaRegStar className="inline mr-2 text-gray-400" />
                Customer hasn't rated your car yet
              </p>
            </div>
          )}

          {/* ✅ Driver Information - If available */}
          {booking.driver && (
            <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaUser className="text-teal-600" />
                  <div>
                    <p className="text-teal-600 font-medium text-sm">
                      Assigned Driver
                    </p>
                    <p className="text-teal-800 font-bold">
                      {booking.driver.fullname}
                    </p>
                  </div>
                </div>
                {booking.driver.phone && (
                  <a
                    href={`tel:${booking.driver.phone}`}
                    className="flex items-center space-x-2 px-3 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
                  >
                    <FaPhone />
                    <span className="text-sm">{booking.driver.phone}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <FaEye />
              <span>{showDetails ? "Hide Details" : "View Details"}</span>
            </button>
          </div>
        </div>

        {/* ✅ Expandable Details Section */}
        {showDetails && (
          <div className="border-t border-gray-200">
            {/* ✅ Car Rating & Review - Only in details */}
            {carRating.hasRating && (
              <div className="p-6 border-b border-gray-100 bg-yellow-50">
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Customer Rating & Review for Your Car
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-600">
                      Car Rating:
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {renderStarRating(carRating.rating)}
                      </div>
                      <span className="text-gray-900 font-semibold">
                        {carRating.rating}/5
                      </span>
                    </div>
                  </div>
                  {carRating.comment && (
                    <div>
                      <span className="font-medium text-gray-600">
                        Customer Feedback:
                      </span>
                      <p className="text-gray-800 italic mt-1">
                        "{carRating.comment}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ✅ Detailed Booking Information */}
            <BookingCardInfo
              booking={booking}
              rentalDays={rentalDays}
              variant="carOwner"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CarOwnerBookingCard;
