import React, { memo, useMemo, useCallback } from "react";
import {
  FaUsers,
  FaCar,
  FaCalendarAlt,
  FaRupeeSign,
  FaSpinner,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaChartLine,
  FaUserTie,
  FaUserFriends,
  FaPercentage,
  FaTachometerAlt,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaTrophy,
  FaUserCheck,
} from "react-icons/fa";
import {
  formatCurrency,
  formatNumber,
  formatDateTime,
} from "../../../utils/dashboard/adminDashboardUtils";

// ✅ Memoized StatCard Component
const StatCard = memo(
  ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className={`bg-gradient-to-r ${color} p-6 rounded-xl text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-opacity-80 text-sm">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend !== undefined ? (
            <div className="flex items-center space-x-1 mt-2">
              {trend >= 0 ? (
                <FaArrowUp className="text-green-300 text-sm" />
              ) : (
                <FaArrowDown className="text-red-300 text-sm" />
              )}
              <span className="text-white text-opacity-70 text-sm">
                {Math.abs(trend).toFixed(1)}% this month
              </span>
            </div>
          ) : (
            <p className="text-white text-opacity-70 text-sm mt-2">
              {subtitle}
            </p>
          )}
        </div>
        <Icon className="text-4xl text-white text-opacity-70" />
      </div>
    </div>
  )
);
StatCard.displayName = "StatCard";

// ✅ Memoized StatusCard Component
const StatusCard = memo(({ title, items, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className={`flex items-center justify-between p-3 ${item.bgColor} rounded-lg`}
        >
          <div className="flex items-center space-x-3">
            <item.icon className={item.iconColor} />
            <span className="font-medium">{item.label}</span>
          </div>
          <span className={`text-xl font-bold ${item.textColor}`}>
            {formatNumber(item.value)}
          </span>
        </div>
      ))}
    </div>
  </div>
));
StatusCard.displayName = "StatusCard";

// ✅ Memoized MetricCard Component
const MetricCard = memo(
  ({ title, value, subtitle, icon: Icon, color, isPercentage = false }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-2xl text-white" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">
            {isPercentage ? `${value.toFixed(1)}%` : value}
          </p>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
  )
);
MetricCard.displayName = "MetricCard";

const OverviewTab = memo(({ stats, loading, onRefresh, pendingApprovals }) => {
  // ✅ Early return for loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  // ✅ Memoized stats extraction with proper fallbacks
  const statsData = useMemo(() => {
    const {
      totalCars = 0,
      totalDrivers = 0,
      totalBookings = 0,
      totalCustomers = 0,
      totalCarOwners = 0,
      totalUsers = 0,
      totalRevenue = 0,
      pendingCars = 0,
      approvedCars = 0,
      rejectedCars = 0,
      pendingDrivers = 0,
      approvedDrivers = 0,
      rejectedDrivers = 0,
      completedBookings = 0,
      activeBookings = 0,
      cancelledBookings = 0,
      pendingBookings = 0,
    } = stats;

    return {
      totalCars,
      totalDrivers,
      totalBookings,
      totalCustomers,
      totalCarOwners,
      totalUsers,
      totalRevenue,
      pendingCars,
      approvedCars,
      rejectedCars,
      pendingDrivers,
      approvedDrivers,
      rejectedDrivers,
      completedBookings,
      activeBookings,
      cancelledBookings,
      pendingBookings,
    };
  }, [stats]);

  // ✅ Memoized calculated metrics
  const calculatedMetrics = useMemo(() => {
    const {
      totalCars,
      totalDrivers,
      totalBookings,
      totalRevenue,
      approvedCars,
      approvedDrivers,
      completedBookings,
      activeBookings,
      cancelledBookings,
      pendingCars,
      pendingDrivers,
    } = statsData;

    return {
      carApprovalRate: totalCars > 0 ? (approvedCars / totalCars) * 100 : 0,
      driverApprovalRate:
        totalDrivers > 0 ? (approvedDrivers / totalDrivers) * 100 : 0,
      bookingCompletionRate:
        totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
      averageRevenuePerBooking:
        completedBookings > 0 ? totalRevenue / completedBookings : 0,
      totalPendingApprovals: pendingCars + pendingDrivers,
      platformUtilization:
        totalCars > 0 ? (activeBookings / totalCars) * 100 : 0,
      cancellationRate:
        totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0,
      successfulBookingRate:
        totalBookings > 0
          ? ((completedBookings + activeBookings) / totalBookings) * 100
          : 0,
    };
  }, [statsData]);

  // ✅ Memoized core stat cards data
  const coreStatCards = useMemo(
    () => [
      {
        title: "Total Users",
        value: formatNumber(statsData.totalUsers),
        color: "from-blue-500 to-blue-600",
        icon: FaUsers,
        subtitle: "All registered users",
      },
      {
        title: "Total Cars",
        value: formatNumber(statsData.totalCars),
        color: "from-green-500 to-green-600",
        icon: FaCar,
        subtitle: `${statsData.pendingCars} pending approval`,
      },
      {
        title: "Total Bookings",
        value: formatNumber(statsData.totalBookings),
        color: "from-purple-500 to-purple-600",
        icon: FaCalendarAlt,
        subtitle: `${statsData.activeBookings} active now`,
      },
      {
        title: "Total Revenue",
        value: formatCurrency(statsData.totalRevenue),
        color: "from-orange-500 to-orange-600",
        icon: FaRupeeSign,
        subtitle: "From completed bookings",
      },
    ],
    [statsData]
  );

  // ✅ Memoized user type cards data
  const userTypeCards = useMemo(
    () => [
      {
        title: "Customers",
        value: formatNumber(statsData.totalCustomers),
        color: "from-indigo-500 to-indigo-600",
        icon: FaUserFriends,
        subtitle: `${
          statsData.totalUsers > 0
            ? ((statsData.totalCustomers / statsData.totalUsers) * 100).toFixed(
                1
              )
            : 0
        }% of total users`,
      },
      {
        title: "Drivers",
        value: formatNumber(statsData.totalDrivers),
        color: "from-teal-500 to-teal-600",
        icon: FaUsers,
        subtitle: `${statsData.pendingDrivers} pending approval`,
      },
      {
        title: "Car Owners",
        value: formatNumber(statsData.totalCarOwners),
        color: "from-pink-500 to-pink-600",
        icon: FaUserTie,
        subtitle: "Vehicle owners",
      },
    ],
    [statsData]
  );

  // ✅ Memoized status card items
  const statusCardItems = useMemo(
    () => ({
      carStatus: [
        {
          label: "Total Cars",
          value: statsData.totalCars,
          icon: FaCar,
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
          textColor: "text-blue-600",
        },
        {
          label: "Pending",
          value: statsData.pendingCars,
          icon: FaClock,
          bgColor: "bg-yellow-50",
          iconColor: "text-yellow-600",
          textColor: "text-yellow-600",
        },
        {
          label: "Approved",
          value: statsData.approvedCars,
          icon: FaCheckCircle,
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
          textColor: "text-green-600",
        },
        {
          label: "Rejected",
          value: statsData.rejectedCars,
          icon: FaTimesCircle,
          bgColor: "bg-red-50",
          iconColor: "text-red-600",
          textColor: "text-red-600",
        },
      ],
      driverStatus: [
        {
          label: "Total Drivers",
          value: statsData.totalDrivers,
          icon: FaUsers,
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
          textColor: "text-blue-600",
        },
        {
          label: "Pending",
          value: statsData.pendingDrivers,
          icon: FaClock,
          bgColor: "bg-yellow-50",
          iconColor: "text-yellow-600",
          textColor: "text-yellow-600",
        },
        {
          label: "Approved",
          value: statsData.approvedDrivers,
          icon: FaCheckCircle,
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
          textColor: "text-green-600",
        },
        {
          label: "Rejected",
          value: statsData.rejectedDrivers,
          icon: FaTimesCircle,
          bgColor: "bg-red-50",
          iconColor: "text-red-600",
          textColor: "text-red-600",
        },
      ],
      bookingStatus: [
        {
          label: "Total Bookings",
          value: statsData.totalBookings,
          icon: FaCalendarAlt,
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
          textColor: "text-blue-600",
        },
        {
          label: "Active",
          value: statsData.activeBookings,
          icon: FaChartLine,
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
          textColor: "text-green-600",
        },
        {
          label: "Completed",
          value: statsData.completedBookings,
          icon: FaCheckCircle,
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600",
          textColor: "text-purple-600",
        },
        {
          label: "Cancelled",
          value: statsData.cancelledBookings,
          icon: FaTimesCircle,
          bgColor: "bg-red-50",
          iconColor: "text-red-600",
          textColor: "text-red-600",
        },
      ],
    }),
    [statsData]
  );

  // ✅ Memoized approval metrics data
  const approvalMetrics = useMemo(
    () => [
      {
        title: "Car Approval Rate",
        value: calculatedMetrics.carApprovalRate,
        subtitle: `${statsData.approvedCars} out of ${statsData.totalCars} cars approved`,
        icon: FaTrophy,
        color: "bg-emerald-500",
        isPercentage: true,
      },
      {
        title: "Driver Approval Rate",
        value: calculatedMetrics.driverApprovalRate,
        subtitle: `${statsData.approvedDrivers} out of ${statsData.totalDrivers} drivers approved`,
        icon: FaUserCheck,
        color: "bg-blue-500",
        isPercentage: true,
      },
      {
        title: "Booking Success Rate",
        value: calculatedMetrics.successfulBookingRate,
        subtitle: `${
          statsData.completedBookings + statsData.activeBookings
        } successful bookings`,
        icon: FaTachometerAlt,
        color: "bg-cyan-500",
        isPercentage: true,
      },
      {
        title: "Platform Utilization",
        value: calculatedMetrics.platformUtilization,
        subtitle: `${statsData.activeBookings} cars currently in use`,
        icon: FaChartLine,
        color: "bg-violet-500",
        isPercentage: true,
      },
    ],
    [calculatedMetrics, statsData]
  );

  // ✅ Memoized performance metrics data
  const performanceMetrics = useMemo(
    () => [
      {
        title: "Average Revenue per Booking",
        value: formatCurrency(calculatedMetrics.averageRevenuePerBooking),
        subtitle: "Revenue efficiency per completed booking",
        icon: FaMoneyBillWave,
        color: "bg-amber-500",
        isPercentage: false,
      },
      {
        title: "Cancellation Rate",
        value: calculatedMetrics.cancellationRate,
        subtitle: `${statsData.cancelledBookings} out of ${statsData.totalBookings} bookings cancelled`,
        icon: FaTimesCircle,
        color: "bg-red-500",
        isPercentage: true,
      },
      {
        title: "Pending Approvals",
        value: formatNumber(calculatedMetrics.totalPendingApprovals),
        subtitle: `${statsData.pendingCars} cars, ${statsData.pendingDrivers} drivers waiting`,
        icon: FaExclamationTriangle,
        color: "bg-orange-500",
        isPercentage: false,
      },
    ],
    [calculatedMetrics, statsData]
  );

  // ✅ Memoized user distribution data
  const userDistribution = useMemo(
    () => [
      {
        title: "Total Platform Users",
        value: formatNumber(statsData.totalUsers),
        subtitle: "All registered users",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
      },
      {
        title: "Customers",
        value: formatNumber(statsData.totalCustomers),
        subtitle: `${
          statsData.totalUsers > 0
            ? ((statsData.totalCustomers / statsData.totalUsers) * 100).toFixed(
                1
              )
            : 0
        }% of users`,
        bgColor: "bg-purple-50",
        textColor: "text-purple-600",
      },
      {
        title: "Drivers",
        value: formatNumber(statsData.totalDrivers),
        subtitle: `${
          statsData.totalUsers > 0
            ? ((statsData.totalDrivers / statsData.totalUsers) * 100).toFixed(1)
            : 0
        }% of users`,
        bgColor: "bg-green-50",
        textColor: "text-green-600",
      },
      {
        title: "Car Owners",
        value: formatNumber(statsData.totalCarOwners),
        subtitle: `${
          statsData.totalUsers > 0
            ? ((statsData.totalCarOwners / statsData.totalUsers) * 100).toFixed(
                1
              )
            : 0
        }% of users`,
        bgColor: "bg-teal-50",
        textColor: "text-teal-600",
      },
    ],
    [statsData]
  );

  // ✅ Memoized header status message
  const headerMessage = useMemo(() => {
    if (calculatedMetrics.totalPendingApprovals > 0) {
      return (
        <span className="text-orange-600 font-medium">
          {calculatedMetrics.totalPendingApprovals} pending approval
          {calculatedMetrics.totalPendingApprovals !== 1 ? "s" : ""} require
          your attention
        </span>
      );
    }
    return <span className="text-gray-600">All approvals are up to date</span>;
  }, [calculatedMetrics.totalPendingApprovals]);

  // ✅ Memoized refresh handler to prevent unnecessary re-renders
  const handleRefresh = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <div className="space-y-8">
      {/* ✅ Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mt-1">{headerMessage}</p>
        </div>

        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* ✅ Core Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coreStatCards.map((card, index) => (
          <StatCard key={`core-${index}`} {...card} />
        ))}
      </div>

      {/* ✅ User Types Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {userTypeCards.map((card, index) => (
          <StatCard key={`user-${index}`} {...card} />
        ))}
      </div>

      {/* ✅ Status Breakdown */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-2">
          <h3 className="text-xl font-bold text-gray-900">Status Breakdown</h3>
          <p className="text-gray-600 text-sm">
            Detailed status information for all platform entities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatusCard title="Car Status" items={statusCardItems.carStatus} />
          <StatusCard
            title="Driver Status"
            items={statusCardItems.driverStatus}
          />
          <StatusCard
            title="Booking Status"
            items={statusCardItems.bookingStatus}
          />
        </div>
      </div>

      {/* ✅ Platform Metrics */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-2">
          <h3 className="text-xl font-bold text-gray-900">Platform Metrics</h3>
          <p className="text-gray-600 text-sm">
            Performance indicators and efficiency rates
          </p>
        </div>

        {/* Approval Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approvalMetrics.map((metric, index) => (
            <MetricCard key={`approval-${index}`} {...metric} />
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {performanceMetrics.map((metric, index) => (
            <MetricCard key={`performance-${index}`} {...metric} />
          ))}
        </div>
      </div>

      {/* ✅ User Distribution */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-2">
          <h3 className="text-xl font-bold text-gray-900">User Distribution</h3>
          <p className="text-gray-600 text-sm">
            Breakdown of platform users by type and percentage
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {userDistribution.map((item, index) => (
              <div
                key={`distribution-${index}`}
                className={`text-center p-4 ${item.bgColor} rounded-lg`}
              >
                <div className={`text-2xl font-bold ${item.textColor} mb-2`}>
                  {item.value}
                </div>
                <p className="text-sm text-gray-600">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

OverviewTab.displayName = "OverviewTab";

export default OverviewTab;
