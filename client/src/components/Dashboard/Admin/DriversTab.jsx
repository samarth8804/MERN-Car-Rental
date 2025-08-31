import React, { useState, useMemo } from "react";
import { FaSpinner, FaSearch, FaFilter, FaUsers } from "react-icons/fa";
import { toast } from "react-hot-toast";
import AdminDriverCard from "./AdminDriverCard";
import {
  filterDataBySearch,
  filterDataByStatus,
  sortData,
  approveDriverAction,
  rejectDriverAction,
  deleteDriverAction,
} from "../../../utils/dashboard/adminDashboardUtils";

const DriversTab = ({ drivers, loading, onRefresh, onDriverUpdated }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [actionLoading, setActionLoading] = useState({});

  // ✅ Filter and sort drivers
  const filteredAndSortedDrivers = useMemo(() => {
    let filtered = drivers;

    // Apply search filter
    if (searchTerm) {
      filtered = filterDataBySearch(filtered, searchTerm, [
        "fullname",
        "email",
        "phone",
        "licenseNumber",
        "city",
        "address",
      ]);
    }

    // Apply status filter
    filtered = filterDataByStatus(filtered, statusFilter);

    // Apply sorting
    return sortData(filtered, sortBy, sortOrder);
  }, [drivers, searchTerm, statusFilter, sortBy, sortOrder]);

  // ✅ Handle driver approval
  const handleApproveDriver = async (driverId) => {
    setActionLoading((prev) => ({ ...prev, [driverId]: true }));

    try {
      const result = await approveDriverAction(driverId);

      if (result.success) {
        toast.success("Driver approved successfully!");
        onDriverUpdated(); // Refresh the data
      } else {
        toast.error(result.error || "Failed to approve driver");
      }
    } catch (error) {
      console.error("Error approving driver:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setActionLoading((prev) => ({ ...prev, [driverId]: false }));
    }
  };

  // ✅ Handle driver rejection
  const handleRejectDriver = async (driverId) => {
    setActionLoading((prev) => ({ ...prev, [driverId]: true }));

    try {
      const result = await rejectDriverAction(driverId);

      if (result.success) {
        toast.success("Driver rejected successfully!");
        onDriverUpdated(); // Refresh the data
      } else {
        toast.error(result.error || "Failed to reject driver");
      }
    } catch (error) {
      console.error("Error rejecting driver:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setActionLoading((prev) => ({ ...prev, [driverId]: false }));
    }
  };

  // ✅ Handle driver deletion
  const handleDeleteDriver = async (driverId) => {
    setActionLoading((prev) => ({ ...prev, [driverId]: true }));

    try {
      const result = await deleteDriverAction(driverId);

      if (result.success) {
        toast.success("Driver deleted successfully!");
        onDriverUpdated(); // Refresh the data
      } else {
        toast.error(result.error || "Failed to delete driver");
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setActionLoading((prev) => ({ ...prev, [driverId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading drivers...</p>
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
            Drivers Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage driver registrations and approvals ({drivers.length} total)
          </p>
        </div>

        <div className="mt-4 sm:mt-0">
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Drivers
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
              placeholder="Search drivers..."
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
            <option value="fullname">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="status">Sort by Status</option>
            <option value="totalRides">Sort by Rides</option>
            <option value="earnings">Sort by Earnings</option>
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

      {/* ✅ Drivers Grid */}
      {filteredAndSortedDrivers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FaUsers className="text-4xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No drivers found
          </h3>
          <p className="text-gray-600">
            {drivers.length === 0
              ? "No drivers have been registered yet."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDrivers.map((driver) => (
            <AdminDriverCard
              key={driver._id}
              driver={driver}
              onApprove={handleApproveDriver} // ✅ Direct handler
              onReject={handleRejectDriver} // ✅ Direct handler
              onDelete={handleDeleteDriver} // ✅ Direct handler
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DriversTab;
