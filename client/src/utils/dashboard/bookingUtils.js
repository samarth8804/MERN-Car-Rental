import {
  FaTimesCircle,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

// ✅ FIXED: Enhanced booking status function
export const getBookingStatus = (booking) => {
  const now = new Date();
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);

  // ✅ Check cancelled first (highest priority)
  if (booking.isCancelled) {
    return {
      status: "Cancelled",
      color: "text-red-500",
      bgColor: "bg-red-50",
      icon: FaTimesCircle,
    };
  }

  // ✅ Check completed second (second highest priority)
  if (booking.isCompleted) {
    return {
      status: "Completed",
      color: "text-green-500",
      bgColor: "bg-green-50",
      icon: FaCheckCircle,
    };
  }

  // ✅ Check if ride is actively started
  if (booking.isStarted && !booking.isCompleted) {
    return {
      status: "Active",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      icon: FaClock,
    };
  }

  // ✅ FIXED: Check if booking is upcoming (not started and start date is in future)
  if (!booking.isStarted && startDate > now) {
    return {
      status: "Upcoming",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      icon: FaCalendarAlt,
    };
  }

  // ✅ FIXED: Check if booking is overdue/pending (not started and start date has passed)
  if (!booking.isStarted && startDate <= now) {
    return {
      status: "Pending",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      icon: FaExclamationTriangle,
    };
  }

  // ✅ Default fallback (should rarely be reached)
  return {
    status: "Unknown",
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    icon: FaExclamationTriangle,
  };
};

// ✅ FIXED: Check if booking can be cancelled
export const canCancelBooking = (booking) => {
  return !booking.isCancelled && !booking.isCompleted && !booking.isStarted;
};

// ✅ FIXED: Filter bookings by status for customers
export const filterBookingsByStatus = (bookings, filter) => {
  const now = new Date();

  return bookings.filter((booking) => {
    switch (filter) {
      case "all":
        return true;

      case "active":
        return (
          booking.isStarted && !booking.isCompleted && !booking.isCancelled
        );

      case "upcoming":
        return (
          !booking.isCancelled &&
          !booking.isCompleted &&
          !booking.isStarted &&
          new Date(booking.startDate) > now
        );

      case "pending":
        return (
          !booking.isCancelled &&
          !booking.isCompleted &&
          !booking.isStarted &&
          new Date(booking.startDate) <= now
        );

      case "completed":
        return booking.isCompleted;

      case "cancelled":
        return booking.isCancelled;

      default:
        return true;
    }
  });
};

// ✅ FIXED: Driver-specific booking filtering
export const filterBookingsByStatusForDriver = (bookings, filter) => {
  const now = new Date();

  return bookings.filter((booking) => {
    switch (filter) {
      case "all":
        return true;

      case "assigned":
        return (
          !booking.isStarted && !booking.isCompleted && !booking.isCancelled
        );

      case "active":
        return (
          booking.isStarted && !booking.isCompleted && !booking.isCancelled
        );

      case "completed":
        return booking.isCompleted;

      // ✅ ADDED: Missing cancelled case
      case "cancelled":
        return booking.isCancelled;

      default:
        return true;
    }
  });
};

// ✅ FIXED: Get booking counts for filters
export const getBookingFilterCounts = (bookings) => {
  const now = new Date();

  return {
    all: bookings.length,
    active: bookings.filter(
      (b) => b.isStarted && !b.isCompleted && !b.isCancelled
    ).length,
    upcoming: bookings.filter(
      (b) =>
        !b.isCancelled &&
        !b.isCompleted &&
        !b.isStarted &&
        new Date(b.startDate) > now
    ).length,
    completed: bookings.filter((b) => b.isCompleted).length,
    cancelled: bookings.filter((b) => b.isCancelled).length,
  };
};

// ✅ Rest of the utility functions remain the same...
export const calculateBookingAmounts = (booking, rentalDays) => {
  if (!booking) return null;

  // Calculate base amount from booking details
  let baseAmount = 0;

  if (booking.bookingType === "perDay") {
    baseAmount = booking.car.pricePerDay * rentalDays;
  } else if (booking.bookingType === "perKm") {
    if (booking.kmTravelled > 0) {
      const kmAmount = booking.kmTravelled * booking.car.pricePerKm;
      const minDayCharge = booking.car.pricePerDay;
      baseAmount = Math.max(kmAmount, minDayCharge);
    } else {
      baseAmount = booking.car.pricePerDay;
    }
  }

  // Calculate AC charges (10% of base amount)
  const acCharges = booking.isAC ? Math.round(baseAmount * 0.1) : 0;

  // Get fines
  const lateReturnFine = booking.lateReturnFine || 0;
  const cancellationFine = booking.cancellationFine || 0;

  // Calculate final amount based on booking state
  let finalAmount = 0;
  let displayAmount = 0;

  if (booking.isCancelled) {
    finalAmount = cancellationFine;
    displayAmount = cancellationFine;
  } else {
    finalAmount = baseAmount + acCharges + lateReturnFine;
    displayAmount = finalAmount;
  }

  return {
    baseAmount,
    acCharges,
    lateReturnFine,
    cancellationFine,
    finalAmount,
    displayAmount,
    originalBookingAmount: booking.totalAmount,
    breakdown: {
      base: baseAmount,
      ac: acCharges,
      lateFine: lateReturnFine,
      cancellationFine: cancellationFine,
    },
  };
};

export const calculateRentalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) || 1;
};

// Get booking display information
export const getBookingDisplayInfo = (booking, rentalDays) => {
  return {
    startDate: formatDateTimeIndian(booking.startDate),
    endDate: formatDateTimeIndian(booking.endDate),
    actualReturnDate: booking.actualReturnDate
      ? formatDateTimeIndian(booking.actualReturnDate)
      : null,
    bookingType:
      booking.bookingType === "perDay" ? "Per Day Rental" : "Per KM Rental",
    duration: `${rentalDays} ${rentalDays === 1 ? "Day" : "Days"}`,
    distanceTravelled:
      booking.kmTravelled > 0 ? `${booking.kmTravelled} km` : null,
    acFeature: booking.isAC ? "Yes" : "No",
    hasActualReturn: booking.actualReturnDate && booking.isCompleted,
    hasDistanceTravelled: booking.isCompleted && booking.kmTravelled > 0,
  };
};

// ✅ ADD: Car Owner specific booking filtering (correct statuses)
export const filterBookingsByStatusForCarOwner = (bookings, filter) => {
  return bookings.filter((booking) => {
    switch (filter) {
      case "all":
        return true;

      case "pending":
        // ✅ FIXED: Pending = Driver assigned, not started yet
        return (
          booking.driver && // Driver is assigned (booking exists = driver assigned)
          !booking.isStarted &&
          !booking.isCompleted &&
          !booking.isCancelled
        );

      case "active":
        // ✅ Ride in progress
        return (
          booking.isStarted && !booking.isCompleted && !booking.isCancelled
        );

      case "completed":
        return booking.isCompleted;

      case "cancelled":
        return booking.isCancelled;

      default:
        return true;
    }
  });
};

// ✅ ADD: Car Owner specific stats calculation
export const getCarOwnerBookingStats = (bookings) => {
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  return {
    total: safeBookings.length,
    pending: safeBookings.filter(
      (b) => b.driver && !b.isStarted && !b.isCompleted && !b.isCancelled
    ).length,
    active: safeBookings.filter(
      (b) => b.isStarted && !b.isCompleted && !b.isCancelled
    ).length,
    completed: safeBookings.filter((b) => b.isCompleted).length,
    cancelled: safeBookings.filter((b) => b.isCancelled).length,
  };
};
