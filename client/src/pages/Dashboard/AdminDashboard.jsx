import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/UserContext";
import Navbar from "../../components/layouts/Navbar";
import AdminDashboardTabs from "../../components/Dashboard/Admin/AdminDashboardTabs";
import OverviewTab from "../../components/Dashboard/Admin/OverviewTab";
import CarsTab from "../../components/Dashboard/Admin/CarsTab";
import BookingsTab from "../../components/Dashboard/Admin/BookingsTab";
import DriversTab from "../../components/Dashboard/Admin/DriversTab";
import ProfileTab from "../../components/Dashboard/ProfileTab";
import {
  fetchAdminDashboardData,
  fetchAdminCars,
  fetchAdminBookings,
  fetchAdminDrivers,
  getActiveTabFromURL,
  saveToLocalStorage,
  getFromLocalStorage,
} from "../../utils/dashboard/adminDashboardUtils";

const AdminDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ State Management
  const [activeTab, setActiveTab] = useState(
    getActiveTabFromURL(location) || "overview"
  );
  const [loading, setLoading] = useState({
    overview: false,
    cars: false,
    bookings: false,
    drivers: false,
    initial: true,
  });

  // ✅ Data State
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    cars: [],
    bookings: [],
    drivers: [],
    lastUpdated: null,
  });

  const [errors, setErrors] = useState({});

  // ✅ Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/", { replace: true });
      toast.error("Access denied. Admin login required.");
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  // ✅ Generic data fetcher
  const fetchData = useCallback(async (dataType, fetchFunction) => {
    setLoading((prev) => ({ ...prev, [dataType]: true }));
    setErrors((prev) => ({ ...prev, [dataType]: null }));

    try {
      const result = await fetchFunction();

      if (result.success) {
        setDashboardData((prev) => ({
          ...prev,
          [dataType]: result.data,
          lastUpdated: new Date().toISOString(),
        }));

        // Cache the data
        saveToLocalStorage(`adminDashboard_${dataType}`, {
          data: result.data,
          timestamp: Date.now(),
        });

        console.log(
          `✅ [AdminDashboard] ${dataType} loaded:`,
          Array.isArray(result.data) ? result.data.length : "object"
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(`❌ Error fetching ${dataType}:`, error);
      setErrors((prev) => ({ ...prev, [dataType]: error.message }));
      toast.error(`Failed to fetch ${dataType}`);

      // Try to load from cache as fallback
      const cached = getFromLocalStorage(`adminDashboard_${dataType}`);
      if (cached?.data) {
        setDashboardData((prev) => ({ ...prev, [dataType]: cached.data }));
        toast.success(`Loaded ${dataType} from cache`);
      }
    } finally {
      setLoading((prev) => ({ ...prev, [dataType]: false }));
    }
  }, []);

  // ✅ Specific fetch functions
  const fetchOverview = useCallback(
    () => fetchData("stats", fetchAdminDashboardData),
    [fetchData]
  );
  const fetchCars = useCallback(
    () => fetchData("cars", fetchAdminCars),
    [fetchData]
  );
  const fetchBookings = useCallback(
    () => fetchData("bookings", fetchAdminBookings),
    [fetchData]
  );
  const fetchDrivers = useCallback(
    () => fetchData("drivers", fetchAdminDrivers),
    [fetchData]
  );

  // ✅ Tab change handler
  const handleTabChange = useCallback(
    (newTab) => {
      if (newTab === activeTab) return;

      setActiveTab(newTab);
      const newUrl = `${location.pathname}?tab=${newTab}`;
      window.history.pushState({}, "", newUrl);

      // Preload data for the new tab if not already loaded
      switch (newTab) {
        case "overview":
          if (!dashboardData.stats.totalUsers) fetchOverview();
          break;
        case "cars":
          if (dashboardData.cars.length === 0) fetchCars();
          break;
        case "bookings":
          if (dashboardData.bookings.length === 0) fetchBookings();
          break;
        case "drivers":
          if (dashboardData.drivers.length === 0) fetchDrivers();
          break;
      }
    },
    [
      activeTab,
      location.pathname,
      dashboardData,
      fetchOverview,
      fetchCars,
      fetchBookings,
      fetchDrivers,
    ]
  );

  // ✅ Initial data loading
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;

    const loadInitialData = async () => {
      setLoading((prev) => ({ ...prev, initial: true }));

      try {
        // Load cached data first for faster UI
        const cachedStats = getFromLocalStorage("adminDashboard_stats");
        const cachedCars = getFromLocalStorage("adminDashboard_cars");
        const cachedBookings = getFromLocalStorage("adminDashboard_bookings");
        const cachedDrivers = getFromLocalStorage("adminDashboard_drivers");

        if (cachedStats?.data) {
          setDashboardData((prev) => ({ ...prev, stats: cachedStats.data }));
        }
        if (cachedCars?.data) {
          setDashboardData((prev) => ({ ...prev, cars: cachedCars.data }));
        }
        if (cachedBookings?.data) {
          setDashboardData((prev) => ({
            ...prev,
            bookings: cachedBookings.data,
          }));
        }
        if (cachedDrivers?.data) {
          setDashboardData((prev) => ({
            ...prev,
            drivers: cachedDrivers.data,
          }));
        }

        // Fetch fresh data based on active tab
        switch (activeTab) {
          case "overview":
            await Promise.all([
              fetchOverview(),
              fetchCars(),
              fetchBookings(),
              fetchDrivers(),
            ]);
            break;
          case "cars":
            await Promise.all([fetchOverview(), fetchCars()]);
            break;
          case "bookings":
            await Promise.all([fetchOverview(), fetchBookings()]);
            break;
          case "drivers":
            await Promise.all([fetchOverview(), fetchDrivers()]);
            break;
          default:
            await fetchOverview();
        }

        console.log("✅ [AdminDashboard] Initial data loaded successfully");
      } catch (error) {
        console.error("❌ [AdminDashboard] Error loading initial data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading((prev) => ({ ...prev, initial: false }));
      }
    };

    loadInitialData();
  }, [
    isAuthenticated,
    user?.role,
    activeTab,
    fetchOverview,
    fetchCars,
    fetchBookings,
    fetchDrivers,
  ]);

  // ✅ Refresh handlers
  const refreshHandlers = useMemo(
    () => ({
      overview: fetchOverview,
      cars: fetchCars,
      bookings: fetchBookings,
      drivers: fetchDrivers,
    }),
    [fetchOverview, fetchCars, fetchBookings, fetchDrivers]
  );

  // ✅ Update handlers for data modifications
  const updateHandlers = useMemo(
    () => ({
      onCarUpdated: () => {
        fetchCars();
        fetchOverview(); // Update stats
      },
      onBookingUpdated: () => {
        fetchBookings();
        fetchOverview();
      },
      onDriverUpdated: () => {
        fetchDrivers();
        fetchOverview();
      },
    }),
    [fetchCars, fetchBookings, fetchDrivers, fetchOverview]
  );

  // ✅ Memoized data for tabs
  const tabData = useMemo(
    () => ({
      stats: dashboardData.stats,
      cars: dashboardData.cars,
      bookings: dashboardData.bookings,
      drivers: dashboardData.drivers,
      pendingApprovals: {
        drivers: dashboardData.drivers.filter((d) => d.status === "pending")
          .length,
        cars: dashboardData.cars.filter((c) => c.status === "pending").length,
      },
    }),
    [dashboardData]
  );

  // ✅ Loading state for current tab
  const currentTabLoading = loading[activeTab] || loading.initial;
  const currentTabError = errors[activeTab];

  // ✅ Show loading screen during initial auth check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // ✅ Don't render if not authenticated or not admin
  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  // ✅ Show loading for initial data load
  if (loading.initial && !dashboardData.stats.totalUsers) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar
          isDashboard={true}
          dashboardTitle="Admin Dashboard"
          userRole="admin"
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Navbar */}
      <Navbar
        isDashboard={true}
        dashboardTitle="Admin Dashboard"
        userRole="admin"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ✅ Error Display */}
        {currentTabError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading data
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{currentTabError}</p>
                </div>
                <div className="mt-3">
                  <button
                    onClick={() => refreshHandlers[activeTab]()}
                    className="bg-red-100 hover:bg-red-200 text-red-800 text-sm px-3 py-1 rounded"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Tabs Navigation */}
        <AdminDashboardTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          pendingCounts={tabData.pendingApprovals}
        />

        {/* ✅ Tab Content */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <OverviewTab
              stats={tabData.stats}
              loading={currentTabLoading}
              onRefresh={refreshHandlers.overview}
              pendingApprovals={tabData.pendingApprovals}
            />
          )}

          {activeTab === "cars" && (
            <CarsTab
              cars={tabData.cars}
              loading={currentTabLoading}
              onRefresh={refreshHandlers.cars}
              onCarUpdated={updateHandlers.onCarUpdated}
            />
          )}

          {activeTab === "bookings" && (
            <BookingsTab
              bookings={tabData.bookings}
              loading={currentTabLoading}
              onRefresh={refreshHandlers.bookings}
              onBookingUpdated={updateHandlers.onBookingUpdated}
            />
          )}

          {activeTab === "drivers" && (
            <DriversTab
              drivers={tabData.drivers}
              loading={currentTabLoading}
              onRefresh={refreshHandlers.drivers}
              onDriverUpdated={updateHandlers.onDriverUpdated}
            />
          )}

          {activeTab === "profile" && (
            <ProfileTab user={user} loading={currentTabLoading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
