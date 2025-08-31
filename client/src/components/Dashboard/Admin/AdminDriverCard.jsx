import React, { useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaTrash,
  FaSpinner,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaIdCard,
  FaStar,
} from "react-icons/fa";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "../../../utils/dashboard/adminDashboardUtils";
import ConfirmationModal from "./ConfirmationModal";

const AdminDriverCard = ({
  driver,
  onApprove,
  onReject,
  onDelete,
  actionLoading = {},
}) => {
  const isActionLoading = actionLoading[driver._id];

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
      title: "Approve Driver",
      message: `Are you sure you want to approve ${driver.fullname}? This will allow them to start accepting ride requests from customers.`,
      action: () => {
        onApprove(driver._id);
        setConfirmationModal({ isOpen: false, type: null });
      },
    });
  };

  // ✅ Handle reject click
  const handleRejectClick = () => {
    setConfirmationModal({
      isOpen: true,
      type: "reject",
      title: "Reject Driver",
      message: `Are you sure you want to reject ${driver.fullname}? This action will prevent them from becoming a driver on the platform.`,
      action: () => {
        onReject(driver._id);
        setConfirmationModal({ isOpen: false, type: null });
      },
    });
  };

  // ✅ Handle delete click
  const handleDeleteClick = () => {
    setConfirmationModal({
      isOpen: true,
      type: "delete",
      title: "Delete Driver",
      message: `Are you sure you want to permanently delete ${driver.fullname}? This action cannot be undone and will remove all their data from the system.`,
      action: () => {
        onDelete(driver._id);
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
        {/* Status Badge - Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full shadow-md ${getStatusColor(
              driver.status,
              "user"
            )}`}
          >
            {driver.status?.toUpperCase() || "PENDING"}
          </span>
        </div>

        {/* Driver Avatar and Basic Info */}
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">
                {driver.fullname?.charAt(0).toUpperCase() || "D"}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {driver.fullname}
              </h3>
              <div className="flex items-center space-x-2">
                <FaStar className="text-yellow-400 text-sm" />
                <span className="font-semibold text-gray-700">
                  {driver.rating ? driver.rating.toFixed(1) : "0.0"}
                </span>
                <span className="text-gray-500 text-sm">
                  ({driver.totalRides || 0} rides)
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FaEnvelope className="text-blue-600" />
              <div className="flex-1">
                <label className="text-xs text-gray-500 font-medium">
                  Email
                </label>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {driver.email}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FaPhone className="text-green-600" />
              <div className="flex-1">
                <label className="text-xs text-gray-500 font-medium">
                  Phone
                </label>
                <p className="text-sm font-semibold text-gray-900">
                  {driver.phone || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FaMapMarkerAlt className="text-red-600" />
              <div className="flex-1">
                <label className="text-xs text-gray-500 font-medium">
                  Location
                </label>
                <p className="text-sm font-semibold text-gray-900">
                  {driver.city || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <FaIdCard className="text-purple-600" />
              <div className="flex-1">
                <label className="text-xs text-gray-500 font-medium">
                  License Number
                </label>
                <p className="text-sm font-semibold text-gray-900">
                  {driver.licenseNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          {driver.address && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <label className="text-xs text-blue-700 font-medium">
                Address
              </label>
              <p className="text-sm text-blue-900 mt-1">{driver.address}</p>
            </div>
          )}

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="text-lg font-bold text-green-700">
                {driver.totalRides || 0}
              </div>
              <div className="text-xs text-green-600">Total Rides</div>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="text-lg font-bold text-purple-700">
                {formatCurrency(driver.earnings || 0)}
              </div>
              <div className="text-xs text-purple-600">Earnings</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Approval Actions for Pending Drivers */}
            {driver.status === "pending" && (
              <div className="grid grid-cols-2 gap-2 mb-2">
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

          {/* Registration Date */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Registered: {formatDate(driver.createdAt)}
            </p>
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

export default AdminDriverCard;
