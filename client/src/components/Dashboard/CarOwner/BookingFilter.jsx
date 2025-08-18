import React from "react";
import { FaFilter } from "react-icons/fa";

const BookingFilter = ({ selectedFilter, onFilterChange, stats }) => {
  // ✅ UPDATED: Car Owner specific booking filters (no "confirmed" status)
  const carOwnerBookingFilters = [
    {
      key: "all",
      label: "All Bookings",
      count: stats.total,
      color: "bg-gray-100 text-gray-700 border-gray-200",
    },
    {
      key: "pending",
      label: "Pending Start",
      count: stats.pending,
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    {
      key: "active",
      label: "Active Rides",
      count: stats.active,
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      key: "completed",
      label: "Completed",
      count: stats.completed,
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: stats.cancelled,
      color: "bg-red-100 text-red-700 border-red-200",
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <FaFilter className="text-gray-400 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Filter Bookings</h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {carOwnerBookingFilters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center space-x-2 hover:shadow-md ${
              selectedFilter === filter.key
                ? filter.color + " shadow-md ring-2 ring-blue-300"
                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            <span>{filter.label}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                selectedFilter === filter.key ? "bg-white/80" : "bg-white"
              }`}
            >
              {filter.count || 0}
            </span>
          </button>
        ))}
      </div>

      {/* ✅ ADDED: Active filter description */}
      {selectedFilter !== "all" && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {getFilterDescription(selectedFilter)}
          </p>
        </div>
      )}
    </div>
  );
};

// ✅ Helper function for filter descriptions
const getFilterDescription = (filter) => {
  const descriptions = {
    pending:
      "Bookings confirmed with driver assigned, waiting for ride to start",
    active: "Rides currently in progress",
    completed: "Successfully completed rides",
    cancelled: "Cancelled bookings",
  };

  return descriptions[filter] || "";
};

export default BookingFilter;
