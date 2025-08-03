import React from "react";
import { FaCalendarAlt, FaSnowflake } from "react-icons/fa";
import { formatDateTimeIndian } from "../../utils/dashboard/dateUtils";
import { bookingInfoConfig } from "../../utils/data";

const BookingCardInfo = ({ booking, rentalDays, variant = "customer" }) => {
  // ✅ Helper function to get value with date formatting
  const getSpecValue = (spec, booking, rentalDays) => {
    if (spec.label === "Start Date") {
      return formatDateTimeIndian(booking.startDate);
    }
    if (spec.label === "End Date") {
      return formatDateTimeIndian(booking.endDate);
    }
    if (spec.label === "Actual Return") {
      return formatDateTimeIndian(booking.actualReturnDate);
    }
    return spec.getValue(booking, rentalDays);
  };

  // ✅ Filter specs based on variant
  const getBookingSpecs = () => {
    let specs = bookingInfoConfig;

    // For driver variant, filter to show only relevant fields
    if (variant === "driver") {
      const driverRelevantFields = [
        "Start Date",
        "End Date",
        "Actual Return",
        "Booking Type",
        "Duration",
        "Distance Travelled",
      ];
      specs = specs.filter((spec) => driverRelevantFields.includes(spec.label));
    }

    return specs
      .filter((spec) => {
        // Show conditional fields based on booking state
        if (spec.condition) {
          return spec.condition(booking);
        }
        return true;
      })
      .map((spec) => ({
        ...spec,
        value: getSpecValue(spec, booking, rentalDays),
      }));
  };

  const displaySpecs = getBookingSpecs();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <FaCalendarAlt className="text-blue-500 mr-3" />
        {variant === "driver" ? "Ride Information" : "Booking Information"}
      </h2>

      {/* ✅ Dynamic grid using bookingInfoConfig */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displaySpecs.map((spec, index) => {
          const IconComponent = spec.icon;

          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${spec.bgColor} p-4 rounded-xl border ${spec.borderColor}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <IconComponent className={`${spec.iconColor} text-lg`} />
                <h3 className={`font-semibold ${spec.textColor}`}>
                  {spec.label}
                </h3>
              </div>
              <p className={`${spec.valueColor} font-medium`}>{spec.value}</p>
            </div>
          );
        })}

        {/* ✅ NEW: AC Status for Driver */}
        {variant === "driver" && (
          <div
            className={`bg-gradient-to-br ${
              booking.isAC
                ? "from-blue-50 to-blue-100"
                : "from-gray-50 to-gray-100"
            } p-4 rounded-xl border ${
              booking.isAC ? "border-blue-200" : "border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <FaSnowflake
                className={`${
                  booking.isAC ? "text-blue-500" : "text-gray-400"
                } text-lg`}
              />
              <h3
                className={`font-semibold ${
                  booking.isAC ? "text-blue-900" : "text-gray-900"
                }`}
              >
                AC Feature
              </h3>
            </div>
            <p
              className={`${
                booking.isAC ? "text-blue-800" : "text-gray-800"
              } font-medium`}
            >
              {booking.isAC ? "Available" : "Not Available"}
            </p>
          </div>
        )}

        {/* Driver-specific earning info */}
        {variant === "driver" && booking.driverEarning && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <span className="text-green-600 font-bold text-lg">₹</span>
              </div>
              <h3 className="font-semibold text-green-900">Driver Earning</h3>
            </div>
            <p className="text-green-800 font-medium">
              ₹{booking.driverEarning}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCardInfo;
