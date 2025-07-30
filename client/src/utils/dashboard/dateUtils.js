// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return "Not available";

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format date in Indian style (DD/MM/YYYY)
export const formatDateIndian = (dateString) => {
  if (!dateString) return "Not available";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Format date with time in Indian style
export const formatDateTimeIndian = (dateString) => {
  if (!dateString) return "Not available";

  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ✅ FIXED: Calculate inclusive date range (both start and end days included)
export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  // Reset time to start of day for accurate comparison
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // Fixed: Allow same-day bookings - end date can be same as start date
  if (end < start) {
    return { isValid: false, error: "End date cannot be before start date" };
  }

  // Fixed: Allow today's date - only prevent past dates
  if (start < today) {
    return { isValid: false, error: "Start date cannot be in the past" };
  }

  // ✅ FIXED: Calculate inclusive days (start day + end day included)
  const daysDifference = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const isSameDay = start.getTime() === end.getTime();

  // Fixed: Allow same-day bookings (daysDifference = 1 for same day)
  if (daysDifference > 30) {
    return { isValid: false, error: "Maximum rental period is 30 days" };
  }

  // Return appropriate message for same-day vs multi-day bookings
  return {
    isValid: true,
    daysDifference, // Now correctly includes both start and end days
    isSameDay,
  };
};

// ✅ FIXED: Get inclusive date difference in days
export const getDateDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Reset time to start of day
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // ✅ FIXED: Inclusive calculation (both days included)
  const daysDiff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

  return daysDiff;
};

// ✅ NEW: Helper function for consistent date calculation across the app
export const calculateRentalDays = (startDate, endDate) => {
  return getDateDifference(startDate, endDate);
};
