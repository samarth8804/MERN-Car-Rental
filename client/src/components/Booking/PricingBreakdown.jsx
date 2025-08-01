import React from "react";
import { FaRupeeSign, FaSnowflake, FaCalculator } from "react-icons/fa";

const PricingBreakdown = ({ formData, pricingDetails }) => {
  const {
    duration,
    dailyRate,
    kmRate,
    baseAmount,
    acCharges,
    totalAmount,
    isSameDay,
  } = pricingDetails;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <FaCalculator className="mr-2 text-green-500" />
        Pricing Breakdown
      </h3>
      
      <div className="space-y-4">
        {/* Duration */}
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Duration:</span>
          <span className="font-semibold text-gray-900">
            {isSameDay ? "Same Day" : `${duration} Days`}
          </span>
        </div>

        {/* Base Amount */}
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">
            {formData.bookingType === "perDay" ? "Daily Rate:" : "Estimated Rate:"}
          </span>
          <span className="font-semibold text-gray-900">
            ₹{formData.bookingType === "perDay" ? dailyRate : kmRate}
            {formData.bookingType === "perDay" ? "/day" : "/km"}
          </span>
        </div>

        {/* Calculation */}
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">
            {formData.bookingType === "perDay" 
              ? `₹${dailyRate} × ${duration} ${duration === 1 ? "day" : "days"}:`
              : "Estimated (100 km):"
            }
          </span>
          <span className="font-semibold text-gray-900">₹{baseAmount}</span>
        </div>

        {/* AC Charges */}
        {formData.isAC && (
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 flex items-center">
              <FaSnowflake className="mr-1 text-blue-500" />
              AC Charges (10%):
            </span>
            <span className="font-semibold text-gray-900">₹{acCharges}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Total */}
        <div className="flex justify-between items-center py-2 bg-green-50 rounded-lg px-4">
          <span className="text-lg font-bold text-green-900 flex items-center">
            <FaRupeeSign className="mr-1" />
            Total Amount:
          </span>
          <span className="text-2xl font-bold text-green-600">₹{totalAmount}</span>
        </div>

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
          <p className="text-sm text-blue-800">
            {formData.bookingType === "perDay" 
              ? "✨ Includes unlimited kilometers for the rental period"
              : "📍 Final amount will be calculated based on actual distance traveled"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingBreakdown;