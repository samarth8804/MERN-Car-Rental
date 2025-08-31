import React, { useState, useMemo } from "react";
import { FaSpinner, FaSearch, FaFilter, FaCar } from "react-icons/fa";
import { toast } from "react-hot-toast";
import AdminCarsCard from "./AdminCarCard";
import AdminCarDetailsModal from "./AdminCarDetailsModal";
import {
  filterDataBySearch,
  filterDataByStatus,
  sortData,
  approveCarAction,
  rejectCarAction,
  deleteCarAction,
} from "../../../utils/dashboard/adminDashboardUtils";

const CarsTab = ({ cars, loading, onRefresh, onCarUpdated }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedCar, setSelectedCar] = useState(null);
  const [showCarModal, setShowCarModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  // ✅ Filter and sort cars
  const filteredAndSortedCars = useMemo(() => {
    let filtered = cars;

    // Apply search filter
    if (searchTerm) {
      filtered = filterDataBySearch(filtered, searchTerm, [
        "brand",
        "model",
        "licensePlate",
        "city",
        "ownerName",
        "ownerEmail",
      ]);
    }

    // Apply status filter
    filtered = filterDataByStatus(filtered, statusFilter);

    // Apply sorting
    return sortData(filtered, sortBy, sortOrder);
  }, [cars, searchTerm, statusFilter, sortBy, sortOrder]);

  // ✅ Handle car approval
  const handleApproveCar = async (carId) => {
    setActionLoading((prev) => ({ ...prev, [carId]: true }));

    try {
      const result = await approveCarAction(carId);

      if (result.success) {
        toast.success("Car approved successfully!");
        onCarUpdated(); // Refresh the data

        // Close modal if open
        if (showCarModal && selectedCar?._id === carId) {
          setShowCarModal(false);
          setSelectedCar(null);
        }
      } else {
        toast.error(result.error || "Failed to approve car");
      }
    } catch (error) {
      console.error("Error approving car:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setActionLoading((prev) => ({ ...prev, [carId]: false }));
    }
  };

  // ✅ Handle car rejection
  const handleRejectCar = async (carId) => {
    setActionLoading((prev) => ({ ...prev, [carId]: true }));

    try {
      const result = await rejectCarAction(carId);

      if (result.success) {
        toast.success("Car rejected successfully!");
        onCarUpdated(); // Refresh the data

        // Close modal if open
        if (showCarModal && selectedCar?._id === carId) {
          setShowCarModal(false);
          setSelectedCar(null);
        }
      } else {
        toast.error(result.error || "Failed to reject car");
      }
    } catch (error) {
      console.error("Error rejecting car:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setActionLoading((prev) => ({ ...prev, [carId]: false }));
    }
  };

  // ✅ Handle car deletion
  const handleDeleteCar = async (carId) => {
    setActionLoading((prev) => ({ ...prev, [carId]: true }));

    try {
      const result = await deleteCarAction(carId);

      if (result.success) {
        toast.success("Car deleted successfully!");
        onCarUpdated(); // Refresh the data

        // Close modal if open
        if (showCarModal && selectedCar?._id === carId) {
          setShowCarModal(false);
          setSelectedCar(null);
        }
      } else {
        toast.error(result.error || "Failed to delete car");
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setActionLoading((prev) => ({ ...prev, [carId]: false }));
    }
  };

  // ✅ Handle view car details
  const handleViewCar = (car) => {
    setSelectedCar(car);
    setShowCarModal(true);
  };

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
    <div className="space-y-6">
      {/* ✅ Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cars Management</h2>
          <p className="text-gray-600 mt-1">
            Manage vehicle listings and approvals ({cars.length} total)
          </p>
        </div>

        <div className="mt-4 sm:mt-0">
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Cars
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
              placeholder="Search cars..."
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
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="brand">Sort by Brand</option>
            <option value="pricePerDay">Sort by Price</option>
            <option value="status">Sort by Status</option>
            <option value="rating">Sort by Rating</option>
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

      {/* ✅ Cars Grid */}
      {filteredAndSortedCars.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FaCar className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No cars found
          </h3>
          <p className="text-gray-600">
            {cars.length === 0
              ? "No cars have been registered yet."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCars.map((car) => (
            <AdminCarsCard
              key={car._id}
              car={car}
              onViewDetails={handleViewCar}
              onApprove={handleApproveCar} // ✅ Direct handler
              onReject={handleRejectCar} // ✅ Direct handler
              onDelete={handleDeleteCar} // ✅ Direct handler
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}

      {/* ✅ Admin Car Details Modal */}
      {showCarModal && selectedCar && (
        <AdminCarDetailsModal
          car={selectedCar}
          isOpen={showCarModal}
          onClose={() => {
            setShowCarModal(false);
            setSelectedCar(null);
          }}
          onApprove={handleApproveCar} // ✅ Direct handler
          onReject={handleRejectCar} // ✅ Direct handler
          onDelete={handleDeleteCar} // ✅ Direct handler
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default CarsTab;
