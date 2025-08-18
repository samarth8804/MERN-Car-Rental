import React from "react";
import {
  FaCar,
  FaRoute,
  FaRupeeSign,
  FaCheckCircle,
  FaClock,
  FaEye,
  FaPlus,
  FaStar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTrophy,
  FaExclamationTriangle,
  FaBookmark,
  FaEdit,
} from "react-icons/fa";
import { MdDirectionsCar } from "react-icons/md";

const OverviewTab = ({
  user,
  cars,
  bookings,
  loading,
  onTabChange,
  onAddCar,
  onUpdateCar,
  lastRefresh,
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ✅ ENHANCED: Better stats calculation
  const totalCars = cars.length;
  const approvedCars = cars.filter((car) => car.status === "approved").length;
  const pendingCars = cars.filter((car) => car.status === "pending").length;
  const rejectedCars = cars.filter((car) => car.status === "rejected").length;

  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(
    (booking) => booking.isCompleted
  ).length;
  const activeBookings = bookings.filter(
    (booking) => !booking.isCompleted && !booking.isCancelled
  ).length;
  const cancelledBookings = bookings.filter(
    (booking) => booking.isCancelled
  ).length;

  // ✅ MODIFIED: Total booking amount (not car owner earnings)
  const totalBookingAmount = bookings
    .filter((booking) => booking.isCompleted && !booking.isCancelled)
    .reduce((total, booking) => total + (booking.totalAmount || 0), 0);

  // ✅ ENHANCED: Performance metrics
  const totalKilometers = bookings
    .filter((booking) => booking.isCompleted)
    .reduce((total, booking) => total + (booking.kmTravelled || 0), 0);

  const avgRating =
    cars.length > 0
      ? (
          cars.reduce((sum, car) => sum + (car.rating || 0), 0) / cars.length
        ).toFixed(1)
      : 0;

  // ✅ NEW: Top performing car
  const topPerformingCar = cars
    .filter((car) => car.status === "approved" && car.rating > 0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];

  // ✅ MODIFIED: Single recent activity (recent 5 bookings regardless of status)
  const recentActivity = bookings
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // ✅ NEW: Cars needing attention
  const carsNeedingAttention = cars.filter(
    (car) => car.status === "rejected" || car.status === "pending"
  );

  return (
    <div className="space-y-8">
      {/* ✅ ENHANCED: Header with last refresh */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.fullname}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's your car rental business overview
          {lastRefresh && (
            <span className="text-sm text-gray-500 ml-2">
              • Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
        </p>
      </div>

      {/* ✅ REDUCED: Stats Cards (removed monthly and average earnings) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Total Cars */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Cars</p>
              <p className="text-3xl font-bold">{totalCars}</p>
              <p className="text-blue-200 text-sm">{approvedCars} approved</p>
            </div>
            <FaCar className="text-4xl text-blue-200" />
          </div>
        </div>

        {/* Pending Cars */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Pending Cars</p>
              <p className="text-3xl font-bold">{pendingCars}</p>
              <p className="text-amber-200 text-sm">Awaiting approval</p>
            </div>
            <FaClock className="text-4xl text-amber-200" />
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold">{totalBookings}</p>
              <p className="text-indigo-200 text-sm">All time bookings</p>
            </div>
            <FaBookmark className="text-4xl text-indigo-200" />
          </div>
        </div>

        {/* Completed Bookings */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed Bookings</p>
              <p className="text-3xl font-bold">{completedBookings}</p>
              <p className="text-green-200 text-sm">Successfully finished</p>
            </div>
            <FaCheckCircle className="text-4xl text-green-200" />
          </div>
        </div>

        {/* ✅ RENAMED: Total Booking Amount */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Total Booking Amount</p>
              <p className="text-3xl font-bold">
                ₹{totalBookingAmount.toLocaleString()}
              </p>
              <p className="text-emerald-200 text-sm">
                From {completedBookings} rides
              </p>
            </div>
            <FaRupeeSign className="text-4xl text-emerald-200" />
          </div>
        </div>

        {/* Active Bookings */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Active Bookings</p>
              <p className="text-3xl font-bold">{activeBookings}</p>
              <p className="text-orange-200 text-sm">Currently ongoing</p>
            </div>
            <FaRoute className="text-4xl text-orange-200" />
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Average Rating</p>
              <p className="text-3xl font-bold">{avgRating}</p>
              <p className="text-yellow-200 text-sm">Across all cars</p>
            </div>
            <FaStar className="text-4xl text-yellow-200" />
          </div>
        </div>

        {/* Total Distance */}
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">Total Distance</p>
              <p className="text-3xl font-bold">
                {totalKilometers.toLocaleString()} km
              </p>
              <p className="text-cyan-200 text-sm">Kilometers travelled</p>
            </div>
            <FaMapMarkerAlt className="text-4xl text-cyan-200" />
          </div>
        </div>
      </div>

      {/* ✅ IMPROVED: Top Performing Car with better UI */}
      {topPerformingCar && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
            <div className="flex items-center text-white">
              <FaTrophy className="text-2xl mr-3 text-yellow-300" />
              <h3 className="text-2xl font-bold">Top Performing Car</h3>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      {topPerformingCar.brand} {topPerformingCar.model}
                    </h4>
                    <div className="flex items-center text-gray-600 mb-3">
                      <span className="text-sm">{topPerformingCar.year}</span>
                      <span className="mx-2">•</span>
                      <span className="text-sm font-mono">
                        {topPerformingCar.licensePlate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">
                      Daily Rate
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      ₹{topPerformingCar.pricePerDay}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">
                      Total Rides
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {topPerformingCar.totalRides || 0}
                    </p>
                  </div>
                  {/* ✅ MODIFIED: Show ratings instead of status */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600 font-medium">
                      Customer Rating
                    </p>
                    <div className="flex items-center space-x-2">
                      <FaStar className="text-2xl text-yellow-500" />
                      <p className="text-2xl font-bold text-yellow-700">
                        {topPerformingCar.rating}
                      </p>
                      <span className="text-yellow-600 text-md">
                        ({topPerformingCar.ratingCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ COMPLETE: Recent Activity section (around line 200) */}
      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <div className="flex items-center justify-between text-white">
              <h3 className="text-2xl font-bold">Recent Activity</h3>
              <button
                onClick={() => onTabChange("bookings")}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                View All
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((booking, index) => (
                <div
                  key={booking._id}
                  className={`relative border-l-4 pl-6 py-4 rounded-r-lg transition-all hover:shadow-md ${
                    booking.isCompleted
                      ? "border-green-500 bg-green-50 hover:bg-green-100"
                      : booking.isCancelled
                      ? "border-red-500 bg-red-50 hover:bg-red-100"
                      : "border-blue-500 bg-blue-50 hover:bg-blue-100"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 mb-3 md:mb-0">
                      <div className="flex items-center mb-2">
                        <h4 className="font-bold text-gray-900 text-lg">
                          {booking.car?.brand} {booking.car?.model}
                        </h4>
                        <span
                          className={`ml-3 inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                            booking.isCompleted
                              ? "bg-green-100 text-green-800"
                              : booking.isCancelled
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {booking.isCompleted
                            ? "Completed"
                            : booking.isCancelled
                            ? "Cancelled"
                            : "Active"}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600 mb-2">
                        <span className="font-medium">
                          {booking.customer?.fullname}
                        </span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(booking.startDate).toLocaleDateString()}
                        </span>
                      </div>

                      {booking.isCompleted && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{booking.kmTravelled || 0} km travelled</span>
                          <span className="mx-3">•</span>
                          <span>
                            Returned:{" "}
                            {new Date(
                              booking.actualReturnDate || booking.endDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4">
                      {booking.carRating && (
                        <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg">
                          <FaStar className="text-yellow-500 mr-1" />
                          <span className="font-medium text-yellow-700">
                            {booking.carRating}
                          </span>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ₹{booking.totalAmount?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Activity number indicator */}
                  <div className="absolute -left-2 top-4 w-4 h-4 bg-white border-2 border-current rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ✅ NEW: Cars Needing Attention */}
      {carsNeedingAttention.length > 0 && (
        <div className="bg-amber-50 rounded-2xl shadow-sm border border-amber-200 p-6">
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="text-amber-600 mr-2" />
            <h3 className="text-xl font-bold text-amber-800">
              Cars Needing Attention
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {carsNeedingAttention.map((car) => (
              <div
                key={car._id}
                className="bg-white rounded-lg p-4 border border-amber-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {car.brand} {car.model}
                    </h4>
                    <p className="text-sm text-gray-600">{car.licensePlate}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      car.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {car.status === "rejected" ? "Rejected" : "Pending"}
                  </span>
                </div>
                {car.status === "rejected" && car.rejectionReason && (
                  <p className="text-sm text-red-600 mt-2">
                    {car.rejectionReason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ MODIFIED: Quick Actions (added Update Car button) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={onAddCar}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            <span>Add New Car</span>
          </button>
          <button
            onClick={() => onTabChange("cars")}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FaEye />
            <span>Manage Cars</span>
          </button>
          {/* ✅ NEW: Update Car button */}
          <button
            onClick={() => onTabChange("cars")}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FaEdit />
            <span>Update Cars</span>
          </button>
          <button
            onClick={() => onTabChange("bookings")}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaCalendarAlt />
            <span>View Bookings</span>
          </button>
        </div>
      </div>

      {/* No data message if empty */}
      {cars.length === 0 && bookings.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl border border-gray-200 p-12">
            <MdDirectionsCar className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Your Car Rental Business
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first car to start earning with easyGo
            </p>
            <button
              onClick={onAddCar}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPlus />
              <span>Add Your First Car</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
