import React, { useState } from "react";
import { FaFilter, FaCar } from "react-icons/fa";
import { filterBookingsByStatusForDriver } from "../../../utils/dashboard/bookingUtils";
import DriverBookingCard from "./DriverBookingCard";

const RidesTab = ({
  rides,
  loading,
  onStartRide,
  onEndRide,
  onCompleteRide,
  onRideUpdate,
}) => {
  const [statusFilter, setStatusFilter] = useState("all");

  // Driver-specific filters
  const driverFilters = [
    { key: "all", label: "All Rides" },
    { key: "assigned", label: "Assigned" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  // Filter rides using driver-specific logic
  const getFilteredRides = () => {
    let filtered = rides;

    // Apply status filter using driver-specific utility
    if (statusFilter !== "all") {
      filtered = filterBookingsByStatusForDriver(filtered, statusFilter);
    }

    return filtered;
  };

  const filteredRides = getFilteredRides();

  // Get counts for filters
  const getFilterCounts = () => {
    return driverFilters.reduce((counts, filter) => {
      if (filter.key === "all") {
        counts[filter.key] = rides.length;
      } else {
        counts[filter.key] = filterBookingsByStatusForDriver(
          rides,
          filter.key
        ).length;
      }
      return counts;
    }, {});
  };

  const filterCounts = getFilterCounts();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Rides</h1>
        <p className="text-gray-600 mt-1">
          Manage your assigned rides and track progress
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {driverFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === filter.key
                    ? "bg-teal-100 text-teal-700 border border-teal-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label} ({filterCounts[filter.key] || 0})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rides List */}
      <div>
        {filteredRides.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FaCar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {statusFilter === "all"
                ? "No rides assigned yet"
                : `No ${statusFilter} rides`}
            </h3>
            <p className="text-gray-600">
              Rides will appear here when assigned by admin
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRides.map((ride) => (
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

export default RidesTab;
