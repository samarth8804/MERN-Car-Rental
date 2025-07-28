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
  return cars.filter(
    (car) =>
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.city.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Get active tab from URL
export const getActiveTabFromURL = (location) => {
  const params = new URLSearchParams(location.search);
  return params.get("tab") || "cars";
};

// Get active bookings count for notifications
export const getActiveBookingsCount = (bookings) => {
  return bookings.filter((b) => !b.isCompleted && !b.isCancelled).length;
};
