import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { formatDateTimeIndian } from "../../utils/dashboard/dateUtils";
import { bookingInfoConfig } from "../../utils/data";

const BookingCardInfo = ({ booking, rentalDays }) => {
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

  // ✅ Filter and prepare booking info specs
  const getBookingSpecs = () => {
    return bookingInfoConfig
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
        Booking Information
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
      </div>
    </div>
  );
};

export default BookingCardInfo;
