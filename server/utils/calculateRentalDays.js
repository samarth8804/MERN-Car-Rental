exports.calculateRentalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Reset time to start of day
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // ✅ FIXED: Inclusive calculation (both start and end days included)
  const daysDiff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

  return daysDiff;
};
