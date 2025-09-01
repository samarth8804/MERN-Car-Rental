import React from "react";
import {
  FaCar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
  FaIdCard,
  FaCheckCircle,
} from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";
import { getSecureImageUrl } from "../../utils/imageUtils";

const CarSummaryCard = ({ car }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Car Image */}
      <div className="relative aspect-video bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
        {car.imageUrl ? (
          <img
            src={getSecureImageUrl(car.imageUrl)}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <MdDirectionsCar className="w-20 h-20 text-blue-400" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
            <FaCheckCircle className="w-4 h-4" />
            <span>Available</span>
          </div>
        </div>

        {/* Rating Badge */}
        {car.rating > 0 && (
          <div className="absolute top-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
              <div className="flex items-center space-x-1">
                <FaStar className="text-yellow-400 text-sm" />
                <span className="font-bold text-gray-900 text-sm">
                  {car.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Car Details */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {car.brand} {car.model}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-gray-600">
            <FaCalendarAlt className="text-blue-500" />
            <span className="font-medium">Year:</span>
            <span>{car.year}</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-600">
            <FaIdCard className="text-purple-500" />
            <span className="font-medium">License:</span>
            <span>{car.licensePlate}</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-600">
            <FaMapMarkerAlt className="text-red-500" />
            <span className="font-medium">Location:</span>
            <span>{car.city}</span>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <FaStar className="text-yellow-400 text-sm" />
                <span className="font-bold text-gray-900">
                  {car.rating > 0 ? car.rating.toFixed(1) : "New"}
                </span>
              </div>
              <p className="text-xs text-gray-500">Customer Rating</p>
            </div>

            <div>
              <div className="flex items-center justify-center space-x-1 mb-1">
                <FaCheckCircle className="text-green-500 text-sm" />
                <span className="font-bold text-gray-900">
                  {car.totalRides || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500">Total Trips</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarSummaryCard;
