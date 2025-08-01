import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const LocationInfoCard = ({ booking }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <FaMapMarkerAlt className="text-blue-500 mr-3" />
        Location Details
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <FaMapMarkerAlt className="text-green-600 text-xl" />
            <h3 className="font-bold text-green-900 text-lg">
              Pickup Location
            </h3>
          </div>
          <p className="text-green-800 leading-relaxed">
            {booking.pickupLocation?.address}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
          <div className="flex items-center space-x-3 mb-4">
            <FaMapMarkerAlt className="text-red-600 text-xl" />
            <h3 className="font-bold text-red-900 text-lg">
              Drop-off Location
            </h3>
          </div>
          <p className="text-red-800 leading-relaxed">
            {booking.dropLocation?.address}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationInfoCard;
