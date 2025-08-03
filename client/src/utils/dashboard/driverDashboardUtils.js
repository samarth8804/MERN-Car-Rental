// Driver-specific utility functions

// ===== ACTIVE BOOKINGS COUNT =====
// Used in DriverDashboard.jsx: import { getActiveBookingsCount }
export const getActiveBookingsCount = (rides) => {
  if (!Array.isArray(rides)) return 0;
  return rides.filter(
    (ride) =>
      (ride.isStarted && !ride.isCompleted && !ride.isCancelled) ||
      (ride.driver && !ride.isStarted && !ride.isCompleted && !ride.isCancelled)
  ).length;
};

// ===== SEARCH FUNCTIONALITY =====
// Used in RidesTab.jsx for search filtering
export const searchRides = (rides, searchTerm) => {
  if (!searchTerm || !searchTerm.trim()) {
    return rides;
  }

  const search = searchTerm.toLowerCase().trim();

  return rides.filter(
    (ride) =>
      ride.car?.brand?.toLowerCase().includes(search) ||
      ride.car?.model?.toLowerCase().includes(search) ||
      ride.car?.licensePlate?.toLowerCase().includes(search) ||
      ride.pickupLocation?.toLowerCase().includes(search) ||
      ride.dropLocation?.toLowerCase().includes(search) ||
      ride.customer?.fullname?.toLowerCase().includes(search) ||
      ride.customer?.phone?.includes(search)
  );
};
