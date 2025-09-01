import React, { useState } from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaCar,
  FaEye,
  FaCheck,
  FaTimes,
  FaTrash,
  FaSpinner,
  FaCalendarAlt,
  FaRupeeSign,
} from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";
import { getStatusColor } from "../../../utils/dashboard/adminDashboardUtils";
import ConfirmationModal from "./ConfirmationModal";
import { getSecureImageUrl } from "../../../utils/imageUtils";

const AdminCarsCard = ({
  car,
  onViewDetails,
  onApprove,
  onReject,
  onDelete,
  actionLoading = {},
}) => {
  const isActionLoading = actionLoading[car._id];

  // ✅ Modal states
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: null,
    title: "",
    message: "",
    action: null,
  });

  // ✅ Handle approve click
  const handleApproveClick = () => {
    setConfirmationModal({
      isOpen: true,
      type: "approve",
      title: "Approve Vehicle",
      message: `Are you sure you want to approve this ${car.brand} ${car.model}? This will make the vehicle available for booking by customers.`,
      action: () => {
        onApprove(car._id);
        setConfirmationModal({ isOpen: false, type: null });
      },
    });
  };

  // ✅ Handle reject click
  const handleRejectClick = () => {
    setConfirmationModal({
      isOpen: true,
      type: "reject",
      title: "Reject Vehicle",
      message: `Are you sure you want to reject this ${car.brand} ${car.model}? This action will prevent the vehicle from being listed.`,
      action: () => {
        onReject(car._id);
        setConfirmationModal({ isOpen: false, type: null });
      },
    });
  };

  // ✅ Handle delete click
  const handleDeleteClick = () => {
    setConfirmationModal({
      isOpen: true,
      type: "delete",
      title: "Delete Vehicle",
      message: `Are you sure you want to permanently delete this ${car.brand} ${car.model}? This action cannot be undone.`,
      action: () => {
        onDelete(car._id);
        setConfirmationModal({ isOpen: false, type: null });
      },
    });
  };

  // ✅ Close modal
  const closeModal = () => {
    setConfirmationModal({
      isOpen: false,
      type: null,
      title: "",
      message: "",
      action: null,
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group relative overflow-hidden">
        {/* Status Badge - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full shadow-md ${getStatusColor(
              car.status,
              "car"
            )}`}
          >
            {car.status?.toUpperCase() || "PENDING"}
          </span>
        </div>

        {/* Car Image Container */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {car.imageUrl ? (
            <img
              src={getSecureImageUrl(car.imageUrl)}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}

          {/* Fallback icon when no image */}
          <div
            className={`${
              car.imageUrl ? "hidden" : "flex"
            } absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center`}
            style={{ display: car.imageUrl ? "none" : "flex" }}
          >
            <MdDirectionsCar className="text-6xl text-white group-hover:scale-110 transition duration-300" />
          </div>

          {/* Rating Badge - Top Right */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-white/20">
            <div className="flex items-center space-x-1">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="font-semibold text-gray-900 text-sm">
                {car.rating && car.rating > 0 ? car.rating.toFixed(1) : "New"}
              </span>
              {car.totalReviews > 0 && (
                <span className="text-xs text-gray-500">
                  ({car.totalReviews})
                </span>
              )}
            </div>
          </div>

          {/* Overlay for better action button visibility */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-300" />
        </div>

        {/* Car Details */}
        <div className="p-6">
          {/* Basic Info */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {car.brand} {car.model}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <span>
                {car.year} • {car.licensePlate}
              </span>
            </div>

            {/* Location */}
            {car.city && (
              <div className="flex items-center text-sm text-blue-600 mb-3">
                <FaMapMarkerAlt className="mr-1" />
                <span>{car.city}</span>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center justify-center text-green-600 mb-1">
                <FaCalendarAlt className="mr-1 text-sm" />
              </div>
              <div className="text-lg font-bold text-green-700">
                ₹{car.pricePerDay}
              </div>
              <div className="text-xs text-green-600">per day</div>
            </div>

            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-center text-blue-600 mb-1">
                <FaRupeeSign className="mr-1 text-sm" />
              </div>
              <div className="text-lg font-bold text-blue-700">
                ₹{car.pricePerKm}
              </div>
              <div className="text-xs text-blue-600">per km</div>
            </div>
          </div>

          {/* Car Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-center">
            <div className="bg-purple-50 p-2 rounded-lg border border-purple-100">
              <div className="text-sm font-semibold text-purple-700">
                {car.totalRides || 0}
              </div>
              <div className="text-xs text-purple-600">Total Rides</div>
            </div>

            <div className="bg-orange-50 p-2 rounded-lg border border-orange-100">
              <div className="text-sm font-semibold text-orange-700">
                ₹{(car.totalEarnings || 0).toLocaleString()}
              </div>
              <div className="text-xs text-orange-600">Earnings</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* View Details Button */}
            <button
              onClick={() => onViewDetails(car)}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <FaEye className="text-sm" />
              <span>View Details</span>
            </button>

            {/* Approval Actions for Pending Cars */}
            {car.status === "pending" && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleApproveClick}
                  disabled={isActionLoading}
                  className="flex items-center justify-center space-x-1 p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isActionLoading ? (
                    <FaSpinner className="animate-spin text-sm" />
                  ) : (
                    <>
                      <FaCheck className="text-sm" />
                      <span className="text-sm">Approve</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleRejectClick}
                  disabled={isActionLoading}
                  className="flex items-center justify-center space-x-1 p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isActionLoading ? (
                    <FaSpinner className="animate-spin text-sm" />
                  ) : (
                    <>
                      <FaTimes className="text-sm" />
                      <span className="text-sm">Reject</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Delete Button */}
            <button
              onClick={handleDeleteClick}
              disabled={isActionLoading}
              className="w-full flex items-center justify-center space-x-2 p-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isActionLoading ? (
                <FaSpinner className="animate-spin text-sm" />
              ) : (
                <>
                  <FaTrash className="text-sm" />
                  <span className="text-sm">Delete</span>
                </>
              )}
            </button>
          </div>

          
        </div>
      </div>

      {/* ✅ Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeModal}
        onConfirm={confirmationModal.action}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
        loading={isActionLoading}
        confirmText={
          confirmationModal.type === "approve"
            ? "Yes, Approve"
            : confirmationModal.type === "reject"
            ? "Yes, Reject"
            : "Yes, Delete"
        }
      />
    </>
  );
};

export default AdminCarsCard;
