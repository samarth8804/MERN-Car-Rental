import React, { useState } from "react";
import {
  FaCar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaRupeeSign,
  FaPlay,
  FaStop,
  FaCheckCircle,
} from "react-icons/fa";
import StartRideModal from "./StartRideModal";
import EndRideModal from "./EndRideModal";
import CompleteRideModal from "./CompleteRideModal";

const RideCard = ({
  ride,
  onStartRide,
  onEndRide,
  onCompleteRide,
  onRideUpdate,
}) => {
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Determine ride status
  const getRideStatus = () => {
    if (ride.isCancelled)
      return { text: "Cancelled", color: "bg-red-100 text-red-800" };
    if (ride.isCompleted)
      return { text: "Completed", color: "bg-gray-100 text-gray-800" };
    if (ride.actualReturnDate && !ride.isCompleted)
      return { text: "Ended", color: "bg-yellow-100 text-yellow-800" };
    if (ride.isStarted)
      return { text: "Active", color: "bg-green-100 text-green-800" };
    return { text: "Assigned", color: "bg-blue-100 text-blue-800" };
  };

  // Check if actions are available
  const canStart =
    !ride.isStarted &&
    !ride.isCompleted &&
    !ride.isCancelled &&
    new Date(ride.startDate) <= new Date();
  const canEnd = ride.isStarted && !ride.actualReturnDate && !ride.isCompleted;
  const canComplete =
    ride.actualReturnDate && !ride.isCompleted && !ride.isCancelled;

  const status = getRideStatus();

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Ride Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <FaCar className="text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {ride.car?.brand} {ride.car?.model}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {ride.car?.licensePlate}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
              >
                {status.text}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              {/* Customer */}
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-400" />
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-medium">{ride.customer?.fullname}</p>
                </div>
              </div>

              {/* Pickup Location */}
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-gray-400" />
                <div>
                  <p className="text-gray-500">Pickup</p>
                  <p className="font-medium">
                    {ride.pickupLocation?.address || ride.pickupLocation}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-gray-400" />
                <div>
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-medium">
                    {new Date(ride.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Earning */}
              <div className="flex items-center space-x-2">
                <FaRupeeSign className="text-gray-400" />
                <div>
                  <p className="text-gray-500">Earning</p>
                  <p className="font-medium">₹{ride.driverEarning || "TBD"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            {canStart && (
              <button
                onClick={() => setShowStartModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaPlay />
                <span>Start Ride</span>
              </button>
            )}

            {canEnd && (
              <button
                onClick={() => setShowEndModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <FaStop />
                <span>End Ride</span>
              </button>
            )}

            {canComplete && (
              <button
                onClick={() => setShowCompleteModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaCheckCircle />
                <span>Complete Ride</span>
              </button>
            )}

            {/* Contact Customer */}
            {!ride.isCompleted && ride.customer?.phone && (
              <a
                href={`tel:${ride.customer.phone}`}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaPhone />
                <span className="hidden sm:inline">Call</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <StartRideModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        ride={ride}
        onStartRide={onStartRide}
      />

      <EndRideModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        ride={ride}
        onEndRide={onEndRide}
      />

      <CompleteRideModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        ride={ride}
        onCompleteRide={onCompleteRide}
      />
    </>
  );
};

export default RideCard;
