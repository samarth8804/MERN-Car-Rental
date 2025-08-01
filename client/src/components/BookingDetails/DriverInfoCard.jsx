import React from "react";
import { FaUser, FaPhone, FaIdCard, FaStar, FaAward } from "react-icons/fa";

const DriverInfoCard = ({ driver }) => {
  if (!driver) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
        <FaUser className="text-blue-500 mr-3" />
        Driver Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3 mb-3">
            <FaUser className="text-blue-600 text-lg" />
            <h3 className="font-semibold text-blue-900">Name</h3>
          </div>
          <p className="text-blue-800 font-medium">{driver.fullname}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center space-x-3 mb-3">
            <FaPhone className="text-green-600 text-lg" />
            <h3 className="font-semibold text-green-900">Phone</h3>
          </div>
          <p className="text-green-800 font-medium">{driver.phone}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center space-x-3 mb-3">
            <FaIdCard className="text-purple-600 text-lg" />
            <h3 className="font-semibold text-purple-900">License No.</h3>
          </div>
          <p className="text-purple-800 font-medium">{driver.licenseNumber}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center space-x-3 mb-3">
            <FaStar className="text-yellow-600 text-lg" />
            <h3 className="font-semibold text-yellow-900">Rating</h3>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-yellow-800 font-medium text-lg">
              {driver.rating > 0 ? driver.rating.toFixed(1) : "New"}
            </p>
            {driver.rating > 0 && (
              <FaStar className="text-yellow-500 text-sm" />
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
          <div className="flex items-center space-x-3 mb-3">
            <FaAward className="text-indigo-600 text-lg" />
            <h3 className="font-semibold text-indigo-900">Total Rides</h3>
          </div>
          <p className="text-indigo-800 font-medium">
            {driver.totalRides || 0} rides
          </p>
        </div>
      </div>
    </div>
  );
};

export default DriverInfoCard;
