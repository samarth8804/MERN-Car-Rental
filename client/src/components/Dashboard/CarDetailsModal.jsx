import React, { useState } from "react";
import { FaTimes, FaEdit, FaCog, FaTrash } from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";
import CarImageSection from "./CarDetailsModal/CarImageSection";
import DateRangeSection from "./CarDetailsModal/DateRangeSection";
import CostEstimationSection from "./CarDetailsModal/CostEstimationSection";
import VehicleSpecsSection from "./CarDetailsModal/VehicleSpecsSection";
import PricingOptionsSection from "./CarDetailsModal/PricingOptionsSection";
import BookingButton from "./CarDetailsModal/BookingButton";
import { calculateRentalDays } from "../../utils/dashboard/dateUtils";

const CarDetailsModal = ({
  isOpen,
  car,
  dateFilters,
  onClose,
  onBookCar,
  variant = "customer",
  onEditCar,
  onDeleteCar, // ✅ ADD: Delete car prop
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!isOpen || !car) return null;

  const hasSelectedDates = dateFilters?.startDate && dateFilters?.endDate;
  const isSameDay =
    dateFilters?.startDate === dateFilters?.endDate && hasSelectedDates;

  // Calculate estimated cost if dates are selected
  const calculateEstimatedCost = () => {
    if (!hasSelectedDates) return null;

    const startDate = new Date(dateFilters.startDate);
    const endDate = new Date(dateFilters.endDate);
    const days = calculateRentalDays(startDate, endDate);

    const dailyRate = car.pricePerDay;
    const totalCost = dailyRate * days;

    return {
      days,
      dailyRate,
      totalCost,
      isSameDay: days === 1,
    };
  };

  const estimatedCost = calculateEstimatedCost();

  // ✅ NEW: Handle edit button click
  const handleEditClick = () => {
    if (onEditCar) {
      // Close current modal first
      onClose();
      // Small delay to prevent modal conflicts
      setTimeout(() => {
        onEditCar(car);
      }, 300);
    }
  };

  // ✅ ADD: Handle delete button click (around line 60)
  const handleDeleteClick = () => {
    if (onDeleteCar) {
      // Close current modal first
      onClose();
      // Small delay to prevent modal conflicts
      setTimeout(() => {
        onDeleteCar(car);
      }, 300);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-lg transition-all duration-300"
          onClick={onClose}
          style={{
            backdropFilter: "blur(12px) saturate(180%)",
            WebkitBackdropFilter: "blur(12px) saturate(180%)",
            backgroundColor: "rgba(0, 0, 0, 0.25)",
          }}
        />

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal Content */}
        <div className="relative inline-block w-full max-w-5xl p-0 my-8 overflow-hidden text-left align-middle transition-all transform bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                  <MdDirectionsCar className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white">
                    {car.brand} {car.model}
                  </h2>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-white/20 rounded-xl transition-all duration-200 border border-transparent hover:border-white/30"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 bg-white/90 backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
              {/* Left Column */}
              <div className="space-y-6">
                <CarImageSection
                  car={car}
                  imageLoaded={imageLoaded}
                  setImageLoaded={setImageLoaded}
                />

                {variant === "customer" && hasSelectedDates && (
                  <DateRangeSection
                    dateFilters={dateFilters}
                    isSameDay={isSameDay}
                  />
                )}

                {variant === "customer" && estimatedCost && (
                  <CostEstimationSection estimatedCost={estimatedCost} />
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <VehicleSpecsSection car={car} />
                <PricingOptionsSection car={car} />
              </div>
            </div>

            <div className="border-t pt-6">
              {/* ✅ NEW: Car Owner Specific Information */}
              {variant === "carOwner" && (
                <div>
                  {/* ✅ REPOSITIONED: Edit button moved to the top of owner dashboard */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900 flex items-center text-lg">
                      <FaCog className="mr-3 text-purple-500" />
                      Owner Dashboard Information
                    </h3>

                    {/* ✅ UPDATED: Action buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleEditClick}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <FaEdit className="text-sm" />
                        <span className="font-medium">Edit</span>
                      </button>

                      {/* ✅ ADD: Delete Button */}
                      <button
                        onClick={handleDeleteClick}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <FaTrash className="text-sm" />
                        <span className="font-medium">Delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Car Status */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <FaCog className="text-blue-600 text-lg" />
                        <h4 className="font-semibold text-blue-900">
                          Approval Status
                        </h4>
                      </div>
                      <p
                        className={`font-medium capitalize ${
                          car.status === "approved"
                            ? "text-green-700"
                            : car.status === "pending"
                            ? "text-orange-700"
                            : "text-red-700"
                        }`}
                      >
                        {car.status || "Unknown"}
                      </p>
                    </div>

                    {/* Total Rides */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <FaCog className="text-green-600 text-lg" />
                        <h4 className="font-semibold text-green-900">
                          Total Rides
                        </h4>
                      </div>
                      <p className="text-green-800 font-medium">
                        {car.totalRides || 0} rides completed
                      </p>
                    </div>

                    {/* Total Earnings */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <FaCog className="text-purple-600 text-lg" />
                        <h4 className="font-semibold text-purple-900">
                          Total Earnings
                        </h4>
                      </div>
                      <p className="text-purple-800 font-medium">
                        ₹{car.totalEarnings?.toLocaleString() || "0"}
                      </p>
                    </div>

                    {/* Car ID */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <FaCog className="text-gray-600 text-lg" />
                        <h4 className="font-semibold text-gray-900">Car ID</h4>
                      </div>
                      <p className="text-gray-800 font-mono text-sm">
                        {car._id}
                      </p>
                    </div>

                    {/* Created Date */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <FaCog className="text-indigo-600 text-lg" />
                        <h4 className="font-semibold text-indigo-900">
                          Added On
                        </h4>
                      </div>
                      <p className="text-indigo-800 font-medium">
                        {car.createdAt
                          ? new Date(car.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </p>
                    </div>

                    {/* Availability Status */}
                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <FaCog className="text-teal-600 text-lg" />
                        <h4 className="font-semibold text-teal-900">
                          Availability
                        </h4>
                      </div>
                      <p className="text-teal-800 font-medium">
                        {car.isAvailable
                          ? "Available for Booking"
                          : "Currently Booked"}
                      </p>
                    </div>
                  </div>

                  {/* ✅ Rejection Reason (if rejected) */}
                  {car.status === "rejected" && car.rejectionReason && (
                    <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                      <h4 className="font-semibold text-red-900 mb-2">
                        Rejection Reason
                      </h4>
                      <p className="text-red-800">{car.rejectionReason}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ✅ FIXED: Booking section for customers */}
              {variant === "customer" && (
                <div className="space-y-6">
                  {/* ✅ Show booking button and cost estimation */}
                  {estimatedCost ? (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Ready to Book?
                          </h3>
                          <p className="text-gray-600">
                            Total cost for {estimatedCost.days}{" "}
                            {estimatedCost.days === 1 ? "day" : "days"}:
                            <span className="font-bold text-green-600 ml-2">
                              ₹{estimatedCost.totalCost.toLocaleString()}
                            </span>
                          </p>
                        </div>
                        <BookingButton
                          car={car}
                          dateFilters={dateFilters}
                          estimatedCost={estimatedCost}
                          onBookCar={onBookCar}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Book This Car
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Select dates to see pricing and book this vehicle
                        </p>
                        <button
                          onClick={() => onBookCar && onBookCar(car)}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition duration-300"
                        >
                          <MdDirectionsCar className="mr-2" />
                          Book Now - ₹{car.pricePerDay}/day
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsModal;
