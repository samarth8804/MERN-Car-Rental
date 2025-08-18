import React, { useState, useMemo } from "react";
import { FaCalendarAlt, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import BookingFilter from "./BookingFilter"; // ✅ NEW: Import filter component
import CarOwnerBookingCard from "./CarOwnerBookingCard";
import {
  filterBookingsByStatusForCarOwner,
  getCarOwnerBookingStats,
} from "../../../utils/dashboard/bookingUtils"; // ✅ NEW: Import utilities

const BookingsTab = ({ bookings, cars, loading }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // ✅ Ensure bookings is always an array
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  // ✅ UPDATED: Use car owner specific filtering
  const filteredBookings = useMemo(() => {
    const filtered = filterBookingsByStatusForCarOwner(
      safeBookings,
      selectedFilter
    );

    // Sort by creation date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [safeBookings, selectedFilter]);

  // ✅ UPDATED: Use car owner specific stats
  const stats = useMemo(() => {
    return getCarOwnerBookingStats(safeBookings);
  }, [safeBookings]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Bookings</h1>
          <p className="text-gray-600 mt-1">
            Manage bookings for your cars ({safeBookings.length} total)
          </p>
        </div>
      </div>

      {/* ✅ UPDATED: Use new BookingFilter component */}
      <BookingFilter
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        stats={stats}
      />

      {/* ✅ Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl border border-gray-200 p-12">
            {safeBookings.length === 0 ? (
              <>
                <FaCalendarAlt className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Bookings Yet
                </h3>
                <p className="text-gray-600">
                  Your car bookings will appear here once customers start
                  booking your vehicles.
                </p>
              </>
            ) : (
              <>
                <FaExclamationCircle className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Matching Bookings
                </h3>
                <p className="text-gray-600">
                  Try selecting a different filter to see more results.
                </p>
                <button
                  onClick={() => setSelectedFilter("all")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Show All Bookings
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredBookings.length} of {safeBookings.length}{" "}
              bookings
            </p>
          </div>

          {/* ✅ Booking Cards (unchanged) */}
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <CarOwnerBookingCard
                key={booking._id}
                booking={booking}
                onViewDetails={(bookingId) => {
                  // You can implement a detailed view modal here if needed
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsTab;
