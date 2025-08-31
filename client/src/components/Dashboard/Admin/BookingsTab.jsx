import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSpinner,
  FaSearch,
  FaFilter,
  FaEye,
  FaBan,
  FaCalendarAlt,
  FaUser,
  FaCar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";
import { toast } from "react-hot-toast";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getStatusColor,
  getBookingStatus,
  filterDataBySearch,
  filterDataByStatus,
  sortData,
  cancelBookingAction,
} from "../../../utils/dashboard/adminDashboardUtils";
import ConfirmationModal from "./ConfirmationModal";

const BookingsTab = ({ bookings, loading, onRefresh, onBookingUpdated }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [actionLoading, setActionLoading] = useState({});

  // ✅ Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    type: null,
    title: "",
    message: "",
    action: null,
    bookingId: null,
  });

  // ✅ Transform bookings with proper status
  const transformedBookings = useMemo(() => {
    return bookings.map((booking) => ({
      ...booking,
      status: getBookingStatus(booking),
    }));
  }, [bookings]);

  // ✅ Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = transformedBookings;

    // Apply search filter
    if (searchTerm) {
      filtered = filterDataBySearch(filtered, searchTerm, [
        "customerName",
        "customerEmail",
        "driverName",
        "carBrand",
        "carModel",
        "carLicensePlate",
        "pickupLocation",
        "dropLocation",
      ]);
    }

    // Apply status filter
    filtered = filterDataByStatus(filtered, statusFilter);

    // Apply sorting
    return sortData(filtered, sortBy, sortOrder);
  }, [transformedBookings, searchTerm, statusFilter, sortBy, sortOrder]);

  // ✅ Handle view booking details - Navigate to BookingDetails page
  const handleViewBooking = (booking) => {
    // Store current tab in sessionStorage for proper back navigation
    sessionStorage.setItem("adminDashboardReturnTab", "bookings");
    navigate(`/booking-details/${booking._id}`);
  };

  // ✅ Handle booking cancellation with confirmation modal
  const handleCancelClick = (booking) => {
    setConfirmationModal({
      isOpen: true,
      type: "delete", // Using delete type for red styling
      title: "Cancel Booking",
      message: `Are you sure you want to cancel booking #${booking._id.slice(
        -8
      )} for ${
        booking.customerName
      }? This action cannot be undone and may incur cancellation charges.`,
      action: () => {
        handleCancelBooking(booking._id);
        setConfirmationModal({ isOpen: false, type: null });
      },
      bookingId: booking._id,
    });
  };

  const handleCancelBooking = async (bookingId) => {
    setActionLoading((prev) => ({ ...prev, [bookingId]: true }));

    try {
      const result = await cancelBookingAction(bookingId);

      if (result.success) {
        toast.success("Booking cancelled successfully!");
        onBookingUpdated();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setActionLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  // ✅ Close confirmation modal
  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      type: null,
      title: "",
      message: "",
      action: null,
      bookingId: null,
    });
  };

  // ✅ Check if booking can be cancelled
  const canCancelBooking = (booking) => {
    return !booking.isCancelled && !booking.isCompleted && !booking.isStarted;
  };

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
      {/* ✅ Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Bookings Management
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor and manage all platform bookings ({bookings.length} total)
          </p>
        </div>

        <div className="mt-4 sm:mt-0">
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Bookings
          </button>
        </div>
      </div>

      {/* ✅ Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="startDate">Sort by Start Date</option>
            <option value="totalAmount">Sort by Amount</option>
            <option value="status">Sort by Status</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* ✅ Enhanced Full-Width Landscape Booking Cards */}
      {filteredAndSortedBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-600">
            {bookings.length === 0
              ? "No bookings have been made yet."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden group"
            >
              {/* ✅ Full-Width Landscape Card Layout */}
              <div className="p-6">
                <div className="flex flex-col xl:flex-row xl:items-center gap-6">
                  {/* ✅ Main Content Section - Takes Full Width */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Booking Info & Status Column */}
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <FaCalendarAlt className="text-blue-600" />
                              <span className="text-sm font-medium text-gray-900">
                                {booking.bookingType === "perDay"
                                  ? "Daily Rental"
                                  : "Per KM Rental"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">
                              Booking ID: #{booking._id.slice(-8)}
                            </p>
                            <p className="text-2xl font-bold text-gray-900 mb-2">
                              {formatCurrency(booking.totalAmount)}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                            booking.status,
                            "booking"
                          )}`}
                        >
                          {booking.status?.toUpperCase() || "PENDING"}
                        </span>

                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <FaClock className="mr-2 text-gray-400" />
                            <span>
                              Created: {formatDate(booking.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FaMoneyBillWave className="mr-2 text-gray-400" />
                            <span>
                              Payment: {booking.paymentStatus || "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Details Column */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center border-b border-gray-100 pb-2">
                          <FaUser className="mr-2 text-blue-600" />
                          Customer Details
                        </h4>
                        <div className="space-y-2">
                          <p className="font-semibold text-gray-900 text-lg">
                            {booking.customerName}
                          </p>
                          <div className="flex items-center text-sm text-gray-600">
                            <FaEnvelope className="mr-2 text-gray-400 text-xs flex-shrink-0" />
                            <span className="truncate">
                              {booking.customerEmail}
                            </span>
                          </div>
                          {booking.customerPhone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <FaPhone className="mr-2 text-gray-400 text-xs flex-shrink-0" />
                              <span>{booking.customerPhone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Vehicle Details Column */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center border-b border-gray-100 pb-2">
                          <MdDirectionsCar className="mr-2 text-green-600" />
                          Vehicle Details
                        </h4>
                        <div className="space-y-2">
                          <p className="font-semibold text-gray-900 text-lg">
                            {booking.carBrand} {booking.carModel}
                          </p>
                          <p className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                            {booking.carLicensePlate}
                          </p>
                          {booking.driverName && (
                            <p className="text-sm text-gray-600">
                              Driver:{" "}
                              <span className="font-medium text-gray-900">
                                {booking.driverName}
                              </span>
                            </p>
                          )}
                          <div className="flex items-center space-x-2">
                            {booking.isAC && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                AC
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Trip Details Column */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center border-b border-gray-100 pb-2">
                          <FaMapMarkerAlt className="mr-2 text-red-600" />
                          Trip Details
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-500 font-medium">
                              Start Date
                            </label>
                            <p className="font-medium text-gray-900">
                              {formatDate(booking.startDate)}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 font-medium">
                              End Date
                            </label>
                            <p className="font-medium text-gray-900">
                              {formatDate(booking.endDate)}
                            </p>
                          </div>
                          {booking.kmTravelled > 0 && (
                            <div>
                              <label className="text-xs text-gray-500 font-medium">
                                Distance Travelled
                              </label>
                              <p className="font-medium text-gray-900">
                                {booking.kmTravelled} km
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ✅ Action Buttons Section - Right Side */}
                  <div className="xl:w-56 flex xl:flex-col gap-3 xl:items-stretch">
                    <button
                      onClick={() => handleViewBooking(booking)}
                      className="flex-1 xl:w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <FaEye className="text-sm" />
                      <span>View Details</span>
                    </button>

                    {canCancelBooking(booking) && (
                      <button
                        onClick={() => handleCancelClick(booking)}
                        disabled={actionLoading[booking._id]}
                        className="flex-1 xl:w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
                      >
                        {actionLoading[booking._id] ? (
                          <FaSpinner className="animate-spin text-sm" />
                        ) : (
                          <>
                            <FaBan className="text-sm" />
                            <span>Cancel Booking</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Confirmation Modal for cancellation */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        onConfirm={confirmationModal.action}
        title={confirmationModal.title}
        message={confirmationModal.message}
        type={confirmationModal.type}
        loading={actionLoading[confirmationModal.bookingId]}
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
      />
    </div>
  );
};

export default BookingsTab;
