import React, { useState } from "react";
import {
  FaTimes,
  FaCheck,
  FaTimes as FaReject,
  FaTrash,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";
import { getStatusColor } from "../../../utils/dashboard/adminDashboardUtils";
import ConfirmationModal from "./ConfirmationModal";

// ✅ Import existing reusable components
import CarImageSection from "../CarDetailsModal/CarImageSection";
import VehicleSpecsSection from "../CarDetailsModal/VehicleSpecsSection";
import PricingOptionsSection from "../CarDetailsModal/PricingOptionsSection";

const AdminCarDetailsModal = ({
  isOpen,
  car,
  onClose,
  onApprove,
  onReject,
  onDelete,
  actionLoading = {},
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // ✅ Modal states for confirmation
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: null,
    title: "",
    message: "",
    action: null,
  });

  if (!isOpen || !car) return null;

  const isActionLoading = actionLoading[car._id];

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
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-lg transition-all duration-300"
            onClick={onClose}
          />

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          {/* Modal Content */}
          <div className="relative inline-block w-full max-w-6xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-3xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                    <MdDirectionsCar className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">
                      {car.brand} {car.model}
                    </h2>
                    <p className="text-white/80">
                      {car.year} • {car.licensePlate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Admin Status Badge */}
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(
                      car.status,
                      "car"
                    )}`}
                  >
                    {car.status?.toUpperCase() || "PENDING"}
                  </span>

                  <button
                    onClick={onClose}
                    className="p-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Reuse existing components */}
                <div className="space-y-6">
                  <CarImageSection
                    car={car}
                    imageLoaded={imageLoaded}
                    setImageLoaded={setImageLoaded}
                    isAdminView={true}
                  />

                  <VehicleSpecsSection car={car} />

                  <PricingOptionsSection car={car} isAdminView={true} />
                </div>

                {/* Right Column - Admin-specific content */}
                <div className="space-y-6">
                  {/* Owner Information - Admin specific */}
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                      <FaUser className="mr-2" />
                      Owner Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-3 bg-white/70 rounded-xl">
                        <FaUser className="text-blue-600 mt-1" />
                        <div className="flex-1">
                          <label className="text-sm text-blue-700 font-medium">
                            Full Name
                          </label>
                          <p className="font-semibold text-blue-900 text-lg">
                            {car.ownerName || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-white/70 rounded-xl">
                        <FaEnvelope className="text-blue-600 mt-1" />
                        <div className="flex-1">
                          <label className="text-sm text-blue-700 font-medium">
                            Email Address
                          </label>
                          <p className="font-semibold text-blue-900 break-all">
                            {car.ownerEmail || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-white/70 rounded-xl">
                        <FaPhone className="text-blue-600 mt-1" />
                        <div className="flex-1">
                          <label className="text-sm text-blue-700 font-medium">
                            Phone Number
                          </label>
                          <p className="font-semibold text-blue-900">
                            {car.ownerPhone || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Statistics - Admin View */}
                  <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                    <h3 className="text-xl font-bold text-purple-900 mb-4">
                      Performance Analytics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/80 rounded-xl border border-purple-200">
                        <div className="text-2xl font-bold text-purple-700 mb-1">
                          {car.totalRides || 0}
                        </div>
                        <div className="text-sm text-purple-600 font-medium">
                          Total Rides
                        </div>
                        <div className="text-xs text-purple-500 mt-1">
                          {car.totalRides > 10 ? "Popular Car" : "New Listing"}
                        </div>
                      </div>

                      <div className="text-center p-4 bg-white/80 rounded-xl border border-purple-200">
                        <div className="text-2xl font-bold text-purple-700 mb-1">
                          ₹{(car.totalEarnings || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-purple-600 font-medium">
                          Total Earnings
                        </div>
                        <div className="text-xs text-purple-500 mt-1">
                          Platform Revenue
                        </div>
                      </div>

                      <div className="text-center p-4 bg-white/80 rounded-xl border border-purple-200">
                        <div className="text-lg font-bold text-purple-700 mb-1">
                          {car.isAvailable ? "Available" : "In Use"}
                        </div>
                        <div className="text-sm text-purple-600 font-medium">
                          Current Status
                        </div>
                      </div>

                      <div className="text-center p-4 bg-white/80 rounded-xl border border-purple-200">
                        <div className="text-lg font-bold text-purple-700 mb-1">
                          {car.city || "Unknown"}
                        </div>
                        <div className="text-sm text-purple-600 font-medium">
                          Location
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Administrative Details */}
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Administrative Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600 font-medium">
                          Car ID:
                        </span>
                        <span className="font-mono text-gray-900 text-sm bg-gray-100 px-2 py-1 rounded">
                          {car._id}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="text-gray-600 font-medium">
                          Registration Date:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {car.createdAt
                            ? new Date(car.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>

                  
                </div>
              </div>

              {/* Admin Actions Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Administrative Actions
                </h3>

                <div className="flex flex-wrap gap-4">
                  {/* Approve Button */}
                  {car.status === "pending" && (
                    <button
                      onClick={handleApproveClick}
                      disabled={isActionLoading}
                      className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {isActionLoading ? (
                        <FaSpinner className="animate-spin text-lg" />
                      ) : (
                        <FaCheck className="text-lg" />
                      )}
                      <span>Approve Vehicle</span>
                    </button>
                  )}

                  {/* Reject Button */}
                  {car.status === "pending" && (
                    <button
                      onClick={handleRejectClick}
                      disabled={isActionLoading}
                      className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FaReject className="text-lg" />
                      <span>Reject Vehicle</span>
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={handleDeleteClick}
                    disabled={isActionLoading}
                    className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {isActionLoading ? (
                      <FaSpinner className="animate-spin text-lg" />
                    ) : (
                      <FaTrash className="text-lg" />
                    )}
                    <span>Delete Vehicle</span>
                  </button>
                </div>
              </div>
            </div>
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

export default AdminCarDetailsModal;
