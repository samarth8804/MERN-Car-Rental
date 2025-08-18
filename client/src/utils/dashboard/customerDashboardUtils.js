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
