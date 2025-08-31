import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUserTag,
} from "react-icons/fa";

// ✅ FIXED: Accept user as prop instead of fetching from API
const ProfileTab = ({ user }) => {
  if (!user) {
    return (
      <div className="max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm text-center">
          <p className="text-gray-500">Failed to load profile information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Profile Information
        </h2>
        <p className="text-gray-600 mt-1">Your account details</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="space-y-6">
          {/* Full Name */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <p className="text-gray-900 font-medium">{user.fullname}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FaEnvelope className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FaPhone className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <p className="text-gray-900">{user.phone}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <p className="text-gray-900">{user.address}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FaUserTag className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                {user.role === "carOwner"
                  ? "Car Owner"
                  : user.role === "driver"
                  ? "Driver"
                  : user.role === "admin"
                  ? "Admin"
                  : user.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
