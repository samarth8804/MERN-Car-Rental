import axiosInstance from "../axiosInstance";
import { API_PATHS } from "../apiPaths";

// Enhanced booking filters
export const customerBookingFilters = [
  { key: "all", label: "All Bookings" },
  { key: "active", label: "Active" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// Filter cars based on search term
export const filterCarsBySearch = (cars, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    return cars;
  }

  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  return cars.filter((car) => {
    // Search in multiple fields
    const searchableFields = [
      car.brand,
      car.model,
      car.licensePlate,
      car.city,
      car.fuelType,
      car.transmission,
      car.color,
      `${car.brand} ${car.model}`, // Combined brand and model
      car.carOwner?.fullname, // Owner name if available
    ];

    return searchableFields.some((field) => {
      if (!field) return false;
      return field.toString().toLowerCase().includes(normalizedSearchTerm);
    });
  });
};

// Get active tab from URL
export const getActiveTabFromURL = (location) => {
  const urlParams = new URLSearchParams(location.search);
  const tabFromQuery = urlParams.get("tab");

  const validTabs = ["cars", "bookings", "profile"];

  if (tabFromQuery && validTabs.includes(tabFromQuery)) {
    return tabFromQuery;
  }

  return "cars"; // Default tab for customer
};

// Get active bookings count for notifications
export const getActiveBookingsCount = (bookings) => {
  return bookings.filter((b) => !b.isCompleted && !b.isCancelled).length;
};

export const checkCarAvailability = async (carId, startDate, endDate) => {
  try {
    console.log("Frontend: About to call API with:", {
      carId,
      startDate,
      endDate,
    });

    const response = await axiosInstance.post(
      "/api/v1/car/check-availability",
      {
        carId,
        startDate,
        endDate,
      }
    );

    console.log("Frontend: API response:", response.data);

    return {
      success: true,
      isAvailable: response.data.isAvailable,
      conflictingBookings: response.data.conflictingBookings || [],
      message: response.data.message,
    };
  } catch (error) {
    console.error("Frontend: Error checking car availability:", error);
    console.error("Frontend: Error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    });
    return {
      success: false,
      isAvailable: false,
      error: error.response?.data?.message || "Failed to check availability",
    };
  }
};
