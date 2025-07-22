import { FaCar, FaHome, FaUserTie, FaCog } from "react-icons/fa";

export const roles = [
  {
    id: "customer",
    title: "Customer",
    description: "Rent cars for your travel needs",
    icon: FaCar,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: "car-owner",
    title: "Car Owner",
    description: "List your cars and earn money",
    icon: FaHome,
    gradient: "from-green-500 to-green-600",
  },
  {
    id: "driver",
    title: "Driver",
    description: "Provide driving services",
    icon: FaUserTie,
    gradient: "from-purple-500 to-purple-600",
  },
  {
    id: "admin",
    title: "Admin",
    description: "Manage the platform",
    icon: FaCog,
    gradient: "from-red-500 to-red-600",
  },
];
