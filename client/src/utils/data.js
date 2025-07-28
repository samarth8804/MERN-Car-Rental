import {
  FaHome,
  FaUserTie,
  FaCog,
  FaRegUser,
  FaCar,
  FaHistory,
  FaUser,
  FaChartBar,
  FaUsers,
  FaShieldAlt,
  FaClipboardList,
  FaWallet,
  FaRoute,
  FaCogs,
} from "react-icons/fa";
import { GiHomeGarage } from "react-icons/gi";

export const roles = [
  {
    id: "customer",
    title: "Customer",
    description: "Rent cars for your travel needs",
    icon: FaRegUser,
    gradient: "from-blue-500 to-blue-600",
    loginInfo: {
      title: "Book Your Perfect Ride",
      subtitle: "Access thousands of vehicles across the city",
      highlights: [
        "Wide selection of vehicles",
        "Secure booking process",
        "24/7 customer support",
      ],
    },
  },
  {
    id: "car-owner",
    title: "Car Owner",
    description: "List your cars and earn money",
    icon: GiHomeGarage,
    gradient: "from-green-500 to-green-600",
    loginInfo: {
      title: "Turn Your Car Into Income",
      subtitle: "List your vehicle and start earning today",
      highlights: [
        "Earn money from your car",
        "Full insurance coverage",
        "Verified customers only",
      ],
    },
  },
  {
    id: "driver",
    title: "Driver",
    description: "Provide driving services",
    icon: FaUserTie,
    gradient: "from-teal-500 to-teal-600",
    loginInfo: {
      title: "Drive & Earn Flexibly",
      subtitle: "Join our network of professional drivers",
      highlights: [
        "Flexible working hours",
        "Admin approval required",
        "Safety guaranteed",
      ],
    },
  },
  {
    id: "admin",
    title: "Admin",
    description: "Manage the platform",
    icon: FaCog,
    gradient: "from-red-500 to-red-600",
    loginInfo: {
      title: "Platform Control Center",
      subtitle: "Manage the entire easyGo ecosystem",
      highlights: ["User management", "Fleet monitoring", "Security controls"],
    },
  },
];

// Dashboard Tab Configurations
export const dashboardTabs = {
  customer: [
    {
      id: "cars",
      label: "Available Cars",
      icon: FaCar,
      description: "Browse and book cars",
      getBadge: (data) => (data.cars?.length > 0 ? data.cars.length : null),
    },
    {
      id: "bookings",
      label: "My Bookings",
      icon: FaHistory,
      description: "View your booking history",
      getBadge: (data) =>
        data.bookings?.filter((b) => !b.isCompleted && !b.isCancelled).length ||
        null,
    },
    {
      id: "profile",
      label: "Profile",
      icon: FaUser,
      description: "Manage your account",
      getBadge: () => null,
    },
  ],

  "car-owner": [
    {
      id: "overview",
      label: "Overview",
      icon: FaChartBar,
      description: "Dashboard overview",
      getBadge: () => null,
    },
    {
      id: "cars",
      label: "My Cars",
      icon: FaCar,
      description: "Manage your vehicles",
      getBadge: (data) => data.cars?.length || null,
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: FaClipboardList,
      description: "View car bookings",
      getBadge: (data) =>
        data.bookings?.filter((b) => b.status === "pending").length || null,
    },
    {
      id: "earnings",
      label: "Earnings",
      icon: FaWallet,
      description: "Track your income",
      getBadge: () => null,
    },
    {
      id: "profile",
      label: "Profile",
      icon: FaUser,
      description: "Manage your account",
      getBadge: () => null,
    },
  ],

  driver: [
    {
      id: "overview",
      label: "Overview",
      icon: FaChartBar,
      description: "Dashboard overview",
      getBadge: () => null,
    },
    {
      id: "rides",
      label: "My Rides",
      icon: FaRoute,
      description: "View assigned rides",
      getBadge: (data) =>
        data.rides?.filter((r) => r.status === "active").length || null,
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: FaClipboardList,
      description: "Available bookings",
      getBadge: (data) => data.availableBookings?.length || null,
    },
    {
      id: "earnings",
      label: "Earnings",
      icon: FaWallet,
      description: "Track your income",
      getBadge: () => null,
    },
    {
      id: "profile",
      label: "Profile",
      icon: FaUser,
      description: "Manage your account",
      getBadge: () => null,
    },
  ],

  admin: [
    {
      id: "overview",
      label: "Overview",
      icon: FaChartBar,
      description: "System overview",
      getBadge: () => null,
    },
    {
      id: "users",
      label: "Users",
      icon: FaUsers,
      description: "Manage users",
      getBadge: (data) => data.pendingUsers?.length || null,
    },
    {
      id: "cars",
      label: "Cars",
      icon: FaCar,
      description: "Manage vehicles",
      getBadge: (data) => data.pendingCars?.length || null,
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: FaClipboardList,
      description: "Manage bookings",
      getBadge: (data) => data.disputedBookings?.length || null,
    },
    {
      id: "security",
      label: "Security",
      icon: FaShieldAlt,
      description: "Security settings",
      getBadge: (data) => data.securityAlerts?.length || null,
    },
    {
      id: "settings",
      label: "Settings",
      icon: FaCogs,
      description: "System settings",
      getBadge: () => null,
    },
  ],
};

// Helper function to get tabs for a specific role
export const getDashboardTabs = (userRole, data = {}) => {
  const tabs = dashboardTabs[userRole] || [];

  return tabs.map((tab) => ({
    ...tab,
    badge: tab.getBadge ? tab.getBadge(data) : null,
  }));
};

// Enhanced booking filter configurations
export const bookingFilters = {
  customer: [
    { key: "all", label: "All Bookings" },
    { key: "active", label: "Active" },
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ],
  "car-owner": [
    { key: "all", label: "All Bookings" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ],
  driver: [
    { key: "all", label: "All Rides" },
    { key: "assigned", label: "Assigned" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ],
  admin: [
    { key: "all", label: "All Bookings" },
    { key: "pending", label: "Pending" },
    { key: "active", label: "Active" },
    { key: "disputed", label: "Disputed" },
    { key: "completed", label: "Completed" },
  ],
};
