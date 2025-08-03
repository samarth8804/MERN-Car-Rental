import React from "react";
import {
  FaRoute,
  FaStar,
  FaRupeeSign,
  FaCar,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import DriverBookingCard from "./DriverBookingCard"; // Import the DriverBookingCard component

const OverviewTab = ({
  user,
  rides,
  loading,
  onTabChange,
  onStartRide,
  onEndRide,
  onCompleteRide,
  onRideUpdate,
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ✅ Calculate stats correctly from rides array
  const totalAssignedRides = rides.length; // All rides assigned to driver
  const completedRides = rides.filter((ride) => ride.isCompleted);
  const activeRides = rides.filter(
    (ride) => ride.isStarted && !ride.isCompleted && !ride.isCancelled
  );
  const upcomingRides = rides.filter(
    (ride) =>
      !ride.isStarted &&
      !ride.isCancelled &&
      new Date(ride.startDate) > new Date()
  );
  const cancelledRides = rides.filter((ride) => ride.isCancelled);

  return (
    <div className="space-y-6">
      {/* Header - Simplified */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.fullname}!
        </h1>
        <p className="text-gray-600 mt-1">Here's your driving overview</p>
      </div>

      {/* Main Stats Cards - 6 cards in responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Total Assigned Rides */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Assigned</p>
              <p className="text-3xl font-bold">{totalAssignedRides}</p>
              <p className="text-blue-200 text-sm">All rides assigned</p>
            </div>
            <FaRoute className="text-4xl text-blue-200" />
          </div>
        </div>

        {/* Completed Rides */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed Rides</p>
              <p className="text-3xl font-bold">{user.totalRides || 0}</p>
              <p className="text-green-200 text-sm">Successfully completed</p>
            </div>
            <FaCheckCircle className="text-4xl text-green-200" />
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold">₹{user.earnings || 0}</p>
              <p className="text-purple-200 text-sm">From completed rides</p>
            </div>
            <FaRupeeSign className="text-4xl text-purple-200" />
          </div>
        </div>

        {/* Active Rides */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Active Rides</p>
              <p className="text-3xl font-bold">{activeRides.length}</p>
              <p className="text-orange-200 text-sm">Currently driving</p>
            </div>
            <FaCar className="text-4xl text-orange-200" />
          </div>
        </div>

        {/* ✅ NEW: Upcoming Rides */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Upcoming Rides</p>
              <p className="text-3xl font-bold">{upcomingRides.length}</p>
              <p className="text-teal-200 text-sm">Scheduled ahead</p>
            </div>
            <FaCalendarAlt className="text-4xl text-teal-200" />
          </div>
        </div>

        {/* ✅ NEW: Cancelled Rides */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Cancelled Rides</p>
              <p className="text-3xl font-bold">{cancelledRides.length}</p>
              <p className="text-red-200 text-sm">Cancelled bookings</p>
            </div>
            <FaTimesCircle className="text-4xl text-red-200" />
          </div>
        </div>

        {/* ✅ NEW: Rating Block */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Driver Rating</p>
              <p className="text-3xl font-bold">
                {user.rating?.toFixed(1) || "0.0"}
              </p>
              <p className="text-yellow-200 text-sm">Average rating</p>
            </div>
            <FaStar className="text-4xl text-yellow-200" />
          </div>
        </div>

        {/* ✅ NEW: Reviews Count Block */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Total Reviews</p>
              <p className="text-3xl font-bold">{user.ratingCount || 0}</p>
              <p className="text-indigo-200 text-sm">Customer reviews</p>
            </div>
            <FaUsers className="text-4xl text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Recent Rides */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Recent Rides</h3>
          <button
            onClick={() => onTabChange("rides")}
            className="text-teal-600 hover:text-teal-700 font-medium text-sm"
          >
            View All
          </button>
        </div>

        {rides.length === 0 ? (
          <div className="text-center py-8">
            <FaCar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No rides assigned yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rides
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 3)
              .map((ride) => (
                <DriverBookingCard
                  key={ride._id}
                  booking={ride}
                  onStartRide={onStartRide}
                  onEndRide={onEndRide}
                  onCompleteRide={onCompleteRide}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;
