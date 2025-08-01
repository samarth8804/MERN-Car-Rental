import { FaCalendarAlt } from "react-icons/fa";
import BookingFilters from "./BookingFilters";
import BookingCard from "./BookingCard";
import { filterBookingsByStatus } from "../../utils/dashboard/bookingUtils";

const BookingsTab = ({
  bookings,
  bookingFilter,
  bookingCounts,
  cancellingBooking,
  onFilterChange,
  onViewBookingDetails,
  onCancelBooking,
  onTabChange,
  onBookingUpdate
}) => {
  const filteredBookings = filterBookingsByStatus(bookings, bookingFilter);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
            <p className="text-gray-600 mt-1">Track and manage your rentals</p>
          </div>
          <div className="mt-4 sm:mt-0 text-sm text-gray-500">
            {filteredBookings.length} booking
            {filteredBookings.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Booking Filters */}
      <BookingFilters
        bookingFilter={bookingFilter}
        onFilterChange={onFilterChange}
        bookingCounts={bookingCounts}
      />

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-20">
          <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-500 mb-6">
            {bookingFilter === "all"
              ? "You haven't made any bookings yet."
              : `No ${bookingFilter} bookings found.`}
          </p>
          {bookingFilter === "all" && (
            <button
              onClick={() => onTabChange("cars")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Browse Cars
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onViewDetails={onViewBookingDetails}
              onCancelBooking={onCancelBooking}
              cancellingBooking={cancellingBooking}
              onBookingUpdate={onBookingUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsTab;
