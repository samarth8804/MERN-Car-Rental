import { FaHome, FaUserTie, FaCog, FaRegUser } from "react-icons/fa";
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
        "Admin approval required", // ✅ Updated to mention approval
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
