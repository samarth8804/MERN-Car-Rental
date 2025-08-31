import { toast } from "react-hot-toast";
import axiosInstance from "../axiosInstance";
import { API_PATHS } from "../apiPaths";

// ✅ Data formatting utilities
export const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "₹0";
  return `₹${amount.toLocaleString("en-IN")}`;
};

export const formatNumber = (number) => {
  if (typeof number !== "number") return "0";
  return number.toLocaleString("en-IN");
};

export const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ✅ Get active tab from URL
export const getActiveTabFromURL = (location) => {
  const urlParams = new URLSearchParams(location.search);
  const tabFromQuery = urlParams.get("tab");

  const validTabs = ["overview", "cars", "bookings", "drivers", "profile"];

  if (tabFromQuery && validTabs.includes(tabFromQuery)) {
    return tabFromQuery;
  }

  return "overview"; // Default tab for admin
};

// ✅ Status utilities
export const getStatusColor = (status, type = "booking") => {
  const statusMap = {
    booking: {
      completed: "text-green-600 bg-green-100",
      active: "text-blue-600 bg-blue-100",
      confirmed: "text-purple-600 bg-purple-100",
      pending: "text-yellow-600 bg-yellow-100",
      cancelled: "text-red-600 bg-red-100",
    },
    user: {
      approved: "text-green-600 bg-green-100",
      pending: "text-yellow-600 bg-yellow-100",
      rejected: "text-red-600 bg-red-100",
      active: "text-blue-600 bg-blue-100",
    },
    car: {
      approved: "text-green-600 bg-green-100",
      pending: "text-yellow-600 bg-yellow-100",
      rejected: "text-red-600 bg-red-100",
    },
  };

  return (
    statusMap[type]?.[status?.toLowerCase()] || "text-gray-600 bg-gray-100"
  );
};

// ✅ Enhanced function to calculate car earnings with detailed breakdown
export const calculateCarEarningsDetailed = (carId, allBookings) => {
  if (!carId || !Array.isArray(allBookings)) {
    return {
      totalEarnings: 0,
      totalBookings: 0,
      completedBookings: 0,
      averageEarningPerBooking: 0,
    };
  }

  // Convert carId to string for comparison
  const carIdString = carId.toString();

  // Filter all bookings for this car - check multiple possible car reference formats
  const carBookings = allBookings.filter((booking) => {
    // Handle different possible formats of car reference in booking
    const bookingCarId = booking.car?._id || booking.carId || booking.car;
    return bookingCarId && bookingCarId.toString() === carIdString;
  });

  

  // Filter completed bookings
  const completedBookings = carBookings.filter(
    (booking) =>
      (booking.isCompleted === true && booking.isCancelled === false) ||
      (booking.isCancelled === true && booking.isCompleted === false)
  );


  // Calculate total earnings
  const totalEarnings = completedBookings.reduce((sum, booking) => {
    const amount = booking.totalAmount || 0;
    return sum + amount;
  }, 0);


  // Calculate average earning per booking
  const averageEarningPerBooking =
    completedBookings.length > 0 ? totalEarnings / completedBookings.length : 0;

  return {
    totalEarnings,
    totalBookings: carBookings.length,
    completedBookings: completedBookings.length,
    averageEarningPerBooking,
  };
};

// ✅ Data transformation utilities
export const transformDriverData = (driver) => {
  if (!driver) return null;

  return {
    _id: driver._id,
    fullname: driver.fullname || "N/A",
    email: driver.email || "N/A",
    phone: driver.phone || "N/A",
    address: driver.address || "N/A",
    licenseNumber: driver.licenseNumber || "N/A",
    city: driver.city || "N/A",
    status: driver.status || "pending",
    rating: driver.rating || 0,
    totalRides: driver.totalRides || 0,
    earnings: driver.earnings || 0,
    createdAt: driver.createdAt,
    approvedBy: driver.approvedBy,
  };
};

// ✅ Enhanced transformBookingData with proper car reference
export const transformBookingData = (booking) => {
  if (!booking) return null;

  return {
    _id: booking._id,
    customerName: booking.customer?.fullname || "N/A",
    customerEmail: booking.customer?.email || "N/A",
    customerPhone: booking.customer?.phone || "N/A",
    driverName: booking.driver?.fullname || "N/A",
    driverEmail: booking.driver?.email || "N/A",
    carBrand: booking.car?.brand || "N/A",
    carModel: booking.car?.model || "N/A",
    carLicensePlate: booking.car?.licensePlate || "N/A",
    car: booking.car?._id || booking.carId || booking.car, // ✅ Ensure car ID is properly extracted
    pickupLocation: booking.pickupLocation?.address || "N/A",
    dropLocation: booking.dropLocation?.address || "N/A",
    startDate: booking.startDate,
    endDate: booking.endDate,
    actualReturnDate: booking.actualReturnDate,
    totalAmount: booking.totalAmount || 0,
    bookingType: booking.bookingType || "perDay",
    kmTravelled: booking.kmTravelled || 0,
    isAC: booking.isAC || false,
    isCompleted: booking.isCompleted || false,
    isCancelled: booking.isCancelled || false,
    isStarted: booking.isStarted || false,
    paymentStatus: booking.paymentStatus || "pending",
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
};

// ✅ Enhanced transformCarData function to include total earnings
export const transformCarData = (car, allBookings = []) => {
  if (!car) return null;

  // Calculate earnings for this car
  const earningsData = calculateCarEarningsDetailed(car._id, allBookings);

  return {
    _id: car._id,
    brand: car.brand || "N/A",
    model: car.model || "N/A",
    year: car.year || "N/A",
    licensePlate: car.licensePlate || "N/A",
    status: car.status || "pending",
    pricePerDay: car.pricePerDay || 0,
    pricePerKm: car.pricePerKm || 0,
    city: car.city || "N/A",
    isAvailable: car.isAvailable || false,
    ownerName: car.ownerId?.fullname || "N/A",
    ownerEmail: car.ownerId?.email || "N/A",
    ownerPhone: car.ownerId?.phone || "N/A",
    imageUrl: car.imageUrl || "",
    createdAt: car.createdAt,
    rating: car.rating || 0,
    totalRides: car.totalRides || 0,
    approvedBy: car.approvedBy,
    // ✅ Add earnings data
    totalEarnings: earningsData.totalEarnings,
    totalBookingsCount: earningsData.totalBookings,
    completedBookingsCount: earningsData.completedBookings,
    averageEarningPerBooking: earningsData.averageEarningPerBooking,
  };
};

// ✅ Action handlers - Fixed to use existing API paths correctly
export const approveCarAction = async (carId) => {
  try {
    const response = await axiosInstance.patch(
      API_PATHS.ADMIN.APPROVE_CAR(carId) // ✅ Using the function from apiPaths
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error approving car:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to approve car",
    };
  }
};

export const rejectCarAction = async (carId) => {
  try {
    const response = await axiosInstance.patch(
      API_PATHS.ADMIN.REJECT_CAR(carId) // ✅ Using the function from apiPaths
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error rejecting car:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to reject car",
    };
  }
};

export const deleteCarAction = async (carId) => {
  try {
    const response = await axiosInstance.delete(
      API_PATHS.CAR.DELETE_CAR(carId) // ✅ Using the existing car delete route for admin
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error deleting car:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete car",
    };
  }
};

export const approveDriverAction = async (driverId) => {
  try {
    const response = await axiosInstance.patch(
      API_PATHS.ADMIN.APPROVE_DRIVER(driverId)
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to approve driver",
    };
  }
};

export const rejectDriverAction = async (driverId) => {
  try {
    const response = await axiosInstance.patch(
      API_PATHS.ADMIN.REJECT_DRIVER(driverId)
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to reject driver",
    };
  }
};

export const cancelBookingAction = async (bookingId) => {
  try {
    const response = await axiosInstance.post(
      API_PATHS.BOOKING.CANCEL_BOOKING, // Base path without bookingId
      { bookingId: bookingId }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to cancel booking",
    };
  }
};

export const deleteDriverAction = async (driverId) => {
  try {
    const response = await axiosInstance.delete(
      API_PATHS.DRIVER.DELETE_DRIVER(driverId) // ✅ Using the existing driver delete route for admin
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error deleting driver:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete driver",
    };
  }
};

// ✅ Local storage utilities
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultValue;
  }
};

// ✅ Filter utilities
export const filterDataBySearch = (data, searchTerm, searchFields) => {
  if (!searchTerm || !searchTerm.trim()) return data;

  const term = searchTerm.toLowerCase().trim();
  return data.filter((item) => {
    return searchFields.some((field) => {
      const value = getNestedValue(item, field);
      return value && value.toString().toLowerCase().includes(term);
    });
  });
};

export const filterDataByStatus = (data, status) => {
  if (!status || status === "all") return data;
  return data.filter((item) => item.status === status);
};

// ✅ Helper to get nested object values
const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

// ✅ Sort utilities
export const sortData = (data, sortBy, sortOrder = "asc") => {
  return [...data].sort((a, b) => {
    let aValue = getNestedValue(a, sortBy);
    let bValue = getNestedValue(b, sortBy);

    // Handle different data types
    if (typeof aValue === "string") aValue = aValue.toLowerCase();
    if (typeof bValue === "string") bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
};

// ✅ Enhanced getBookingStatus function for better status determination
export const getBookingStatus = (booking) => {
  if (booking.isCancelled) return "cancelled";
  if (booking.isCompleted) return "completed";

  const now = new Date();
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);

  if (now < startDate) return "pending";
  if (now >= startDate && now <= endDate) return "active";
  if (now > endDate && !booking.isCompleted) return "overdue";

  return booking.status || "pending";
};

// ✅ Calculate dashboard statistics
export const calculateDashboardStats = (
  cars,
  bookings,
  drivers,
  customers = [],
  carOwners = []
) => {
  const stats = {
    totalCars: cars.length,
    totalBookings: bookings.length,
    totalDrivers: drivers.length,
    totalCustomers: customers.length,
    totalCarOwners: carOwners.length,
    totalUsers: customers.length + drivers.length + carOwners.length,
    totalRevenue: bookings
      .filter((b) => b.isCompleted)
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0),

    // Car statistics
    pendingCars: cars.filter((c) => c.status === "pending").length,
    approvedCars: cars.filter((c) => c.status === "approved").length,
    rejectedCars: cars.filter((c) => c.status === "rejected").length,

    // Driver statistics
    pendingDrivers: drivers.filter((d) => d.status === "pending").length,
    approvedDrivers: drivers.filter((d) => d.status === "approved").length,
    rejectedDrivers: drivers.filter((d) => d.status === "rejected").length,

    // Booking statistics
    completedBookings: bookings.filter((b) => b.isCompleted).length,
    activeBookings: bookings.filter(
      (b) => !b.isCompleted && !b.isCancelled && b.isStarted
    ).length,
    cancelledBookings: bookings.filter((b) => b.isCancelled).length,
    pendingBookings: bookings.filter(
      (b) => !b.isCompleted && !b.isCancelled && !b.isStarted
    ).length,
  };

  return stats;
};

// ✅ API utilities
export const fetchAdminDashboardData = async () => {
  try {
    // Fetch all data needed for dashboard overview
    const [carsRes, driversRes, bookingsRes, customersRes, carOwnersRes] =
      await Promise.all([
        axiosInstance.get(API_PATHS.ADMIN.GET_ALL_CARS),
        axiosInstance.get(API_PATHS.ADMIN.GET_ALL_DRIVERS),
        axiosInstance.get(API_PATHS.BOOKING.GET_BOOKING_HISTORY),
        axiosInstance.get(API_PATHS.ADMIN.GET_ALL_CUSTOMERS),
        axiosInstance.get(API_PATHS.ADMIN.GET_ALL_CAR_OWNERS),
      ]);

    const cars = (carsRes.data.cars || []).map((car) => transformCarData(car));
    const drivers = (driversRes.data.drivers || []).map(transformDriverData);
    const bookings = (bookingsRes.data.bookingHistory || []).map(
      transformBookingData
    );
    const customers = customersRes.data.customers || [];
    const carOwners = carOwnersRes.data.carOwners || [];

    const stats = calculateDashboardStats(
      cars,
      bookings,
      drivers,
      customers,
      carOwners
    );

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to fetch dashboard statistics",
    };
  }
};

// ✅ Enhanced fetchAdminCars with earnings calculation
export const fetchAdminCars = async () => {
  try {
    // Fetch both cars and bookings to calculate earnings
    const [carsResponse, bookingsResponse] = await Promise.all([
      axiosInstance.get(API_PATHS.ADMIN.GET_ALL_CARS),
      axiosInstance.get(API_PATHS.BOOKING.GET_BOOKING_HISTORY),
    ]);

    const cars = carsResponse.data.cars || [];
    const bookings = bookingsResponse.data.bookingHistory || [];



    // Transform car data with earnings calculation
    const carsWithEarnings = cars.map((car) => {
      const transformedCar = transformCarData(car, bookings);
      
      return transformedCar;
    });

    return {
      success: true,
      data: carsWithEarnings,
    };
  } catch (error) {
    console.error("Error fetching cars:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch cars",
    };
  }
};

export const fetchAdminDrivers = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_DRIVERS);
    return {
      success: true,
      data: (response.data.drivers || []).map(transformDriverData),
    };
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch drivers",
    };
  }
};

export const fetchAdminBookings = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.BOOKING.GET_BOOKING_HISTORY
    );
    return {
      success: true,
      data: (response.data.bookingHistory || []).map(transformBookingData),
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch bookings",
    };
  }
};

export const fetchAdminCustomers = async () => {
  try {
    const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_CUSTOMERS);
    return {
      success: true,
      data: response.data.customers || [],
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch customers",
    };
  }
};

export const fetchAdminCarOwners = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.ADMIN.GET_ALL_CAR_OWNERS
    );
    return {
      success: true,
      data: response.data.carOwners || [],
    };
  } catch (error) {
    console.error("Error fetching car owners:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch car owners",
    };
  }
};
