import React, { memo } from "react";
import {
  FaChartLine,
  FaCar,
  FaUsers,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";

const AdminDashboardTabs = memo(
  ({ activeTab, onTabChange, pendingCounts = {} }) => {
    const tabs = [
      {
        id: "overview",
        label: "Overview",
        icon: FaChartLine,
        badge: null,
      },
      {
        id: "cars",
        label: "Cars",
        icon: FaCar,
        badge: pendingCounts.cars > 0 ? pendingCounts.cars : null,
      },
      {
        id: "drivers",
        label: "Drivers",
        icon: FaUsers,
        badge: pendingCounts.drivers > 0 ? pendingCounts.drivers : null,
      },
      {
        id: "bookings",
        label: "Bookings",
        icon: FaCalendarAlt,
        badge: null,
      },
      {
        id: "profile",
        label: "Profile",
        icon: FaUser,
        badge: null,
      },
    ];

    return (
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Tabs */}
          <div className="hidden md:flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-all duration-200 group ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="group-hover:scale-110 transition-transform duration-200" />
                  <span>{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <span className="bg-red-100 text-red-600 text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Mobile Tab Selector */}
          <div className="md:hidden py-4">
            <select
              value={activeTab}
              onChange={(e) => onTabChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label} {tab.badge ? `(${tab.badge})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }
);

AdminDashboardTabs.displayName = "AdminDashboardTabs";

export default AdminDashboardTabs;
