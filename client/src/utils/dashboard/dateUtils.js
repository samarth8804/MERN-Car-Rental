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

// Fixed: Validate date range - now allows same-day and today's date
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

  const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  // Fixed: Allow same-day bookings (daysDifference = 0)
  if (daysDifference > 30) {
    return { isValid: false, error: "Maximum rental period is 30 days" };
  }

  // Return appropriate message for same-day vs multi-day bookings
  return {
    isValid: true,
    daysDifference: daysDifference === 0 ? 1 : daysDifference, // Treat same-day as 1 day
    isSameDay: daysDifference === 0,
  };
};

// Get date difference in days
export const getDateDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Return at least 1 day for same-day bookings
  return daysDiff === 0 ? 1 : daysDiff;
};
