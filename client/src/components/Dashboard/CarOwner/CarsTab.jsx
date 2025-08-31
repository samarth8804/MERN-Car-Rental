import React, { useState, useEffect } from "react";
import {
  FaCar,
  FaPlus,
  FaEdit,
  FaEye,
  FaSearch,
  FaFilter,
  FaCog,
  FaSpinner,
  FaTrash, // ✅ ADD: Trash icon
} from "react-icons/fa";
import CarDetailsModal from "../CarDetailsModal";

const CarsTab = ({
  cars,
  loading,
  onAddCar,
  onUpdateCar,
  onRefresh,
  onEditCarFromModal,
  onDeleteCar, // ✅ ADD: Delete car prop
  bookings = [],
}) => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [carsWithEarnings, setCarsWithEarnings] = useState([]);

  // ✅ Car details modal state
  const [selectedCar, setSelectedCar] = useState(null);
  const [showCarDetailsModal, setShowCarDetailsModal] = useState(false);

  // Calculate earnings for each car
  useEffect(() => {
    const calculateCarEarnings = () => {
      const updatedCars = cars.map((car) => {
        const carBookings = bookings.filter((booking) => {
          const bookingCarId = booking.car?._id || booking.car;
          return bookingCarId === car._id;
        });

        const totalEarnings = carBookings
          .filter((booking) => booking.isCompleted && !booking.isCancelled)
          .reduce((total, booking) => {
            return total + (booking.totalAmount || 0);
          }, 0);

        const totalRides = carBookings.filter(
          (booking) => booking.isCompleted && !booking.isCancelled
        ).length;

        return {
          ...car,
          totalEarnings,
          totalRides,
          originalTotalEarnings: car.totalEarnings,
          originalTotalRides: car.totalRides,
        };
      });

      setCarsWithEarnings(updatedCars);
    };

    if (cars.length > 0) {
      calculateCarEarnings();
    } else {
      setCarsWithEarnings([]);
    }
  }, [cars, bookings]);

  // ✅ REPLACE: Add car handler
  const handleAddCarClick = () => {
    onAddCar(); // Use prop function instead of local modal
  };

  // ✅ REPLACE: Edit car handler
  const handleEditCar = (car) => {
    if (onEditCarFromModal) {
      onEditCarFromModal(car); // Use the prop function with car object
    } else if (onUpdateCar) {
      onUpdateCar(car._id); // Fallback to legacy function
    }
  };

  // Handle car details view
  const handleViewCarDetails = (car) => {
    setSelectedCar(car);
    setShowCarDetailsModal(true);
  };

  const handleCloseCarDetailsModal = () => {
    setShowCarDetailsModal(false);
    setSelectedCar(null);
  };

  // ✅ NEW: Handle edit from CarDetailsModal
  const handleEditCarFromDetailsModal = (car) => {
    // Close the details modal first
    setShowCarDetailsModal(false);
    setSelectedCar(null);

    // Then trigger the edit via prop function
    setTimeout(() => {
      if (onEditCarFromModal) {
        onEditCarFromModal(car);
      } else {
        handleEditCar(car);
      }
    }, 300);
  };

  // ✅ ADD: Delete car from details modal handler
  const handleDeleteCarFromDetailsModal = (car) => {

    // Close the details modal first
    setShowCarDetailsModal(false);
    setSelectedCar(null);

    // Then trigger the delete via prop function
    setTimeout(() => {
      if (onDeleteCar) {
        onDeleteCar(car);
      } else {
        handleDeleteCar(car);
      }
    }, 300);
  };

  // ✅ ADD: Delete car handler (around line 90)
  const handleDeleteCar = (car) => {

    if (onDeleteCar) {
      onDeleteCar(car);
    }
  };

  // Custom action handler for car cards
  const handleCarCardAction = (action, car) => {
    if (action === "view") {
      handleViewCarDetails(car);
    } else if (action === "edit") {
      handleEditCar(car);
    } else if (action === "delete") {
      // ✅ ADD: Delete action
      handleDeleteCar(car);
    }
  };

  // Filter and sort cars
  const filteredCars = carsWithEarnings
    .filter((car) => {

      const matchesStatus =
        filterStatus === "all" || car.status === filterStatus;

      return matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price-high":
          return (b.pricePerDay || 0) - (a.pricePerDay || 0);
        case "price-low":
          return (a.pricePerDay || 0) - (b.pricePerDay || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "earnings":
          return (b.totalEarnings || 0) - (a.totalEarnings || 0);
        case "rides":
          return (b.totalRides || 0) - (a.totalRides || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading cars...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Cars</h1>
            <p className="text-gray-600 mt-1">
              Manage your vehicle fleet ({cars.length} cars)
            </p>
          </div>
          <button
            onClick={handleAddCarClick}
            className="mt-4 sm:mt-0 flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            <span>Add New Car</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Sort */}
            <div className="relative">
              <FaCog className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
                <option value="earnings">Highest Earnings</option>
                <option value="rides">Most Rides</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div
                key={car._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                {/* Car Image Section with Status Badge */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-2xl overflow-hidden">
                  {car.imageUrl ? (
                    <img
                      src={car.imageUrl}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <FaCar className="text-6xl text-white" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-lg ${
                        car.status === "approved"
                          ? "bg-green-500 text-white"
                          : car.status === "pending"
                          ? "bg-orange-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {car.status?.charAt(0).toUpperCase() +
                        car.status?.slice(1) || "Unknown"}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-md">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-medium text-gray-900 text-sm">
                        {car.rating && car.rating > 0
                          ? car.rating.toFixed(1)
                          : "New"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Car Details Section */}
                <div className="p-6">
                  {/* Car Basic Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {car.year} • {car.licensePlate}
                    </p>
                    {car.city && (
                      <div className="flex items-center text-sm text-blue-600 mt-1">
                        <span className="mr-1">📍</span>
                        <span>{car.city}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats Section */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-green-600 text-xs font-medium">
                        Total Rides
                      </p>
                      <p className="text-green-800 font-bold text-lg">
                        {car.totalRides || 0}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-blue-600 text-xs font-medium">
                        Total Earned
                      </p>
                      <p className="text-blue-800 font-bold text-lg">
                        ₹{car.totalEarnings?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>

                  {/* Pricing Info */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      ₹{car.pricePerDay}/day
                    </div>
                    <div className="text-sm text-gray-500">
                      ₹{car.pricePerKm}/km
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCarCardAction("edit", car);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCarCardAction("view", car);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <FaEye />
                      <span>View</span>
                    </button>

                    {/* ✅ ADD: Delete Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCarCardAction("delete", car);
                      }}
                      className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      title="Delete Car"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl border border-gray-200 p-12">
              {cars.length === 0 ? (
                <>
                  <FaCar className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No cars added yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start by adding your first car to begin earning
                  </p>
                  <button
                    onClick={handleAddCarClick}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaPlus />
                    <span>Add Your First Car</span>
                  </button>
                </>
              ) : (
                <>
                  <FaSearch className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No cars found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => {
                      setFilterStatus("all");
                      setSortBy("newest");
                    }}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <span>Clear Filters</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Car Details Modal */}
      {selectedCar && (
        <CarDetailsModal
          car={selectedCar}
          isOpen={showCarDetailsModal}
          onClose={handleCloseCarDetailsModal}
          variant="carOwner"
          onEditCar={handleEditCarFromDetailsModal}
          onDeleteCar={handleDeleteCarFromDetailsModal} // ✅ ADD: Delete car prop
        />
      )}
    </>
  );
};

export default CarsTab;
