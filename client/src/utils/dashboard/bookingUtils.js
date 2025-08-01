import {
  FaTimesCircle,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

// Enhanced booking status function
export const getBookingStatus = (booking) => {
  const now = new Date();
  const startDate = new Date(booking.startDate);
  const endDate = new Date(booking.endDate);

  if (booking.isCancelled) {
    return {
      status: "Cancelled",
      color: "text-red-500",
      bgColor: "bg-red-50",
      icon: FaTimesCircle,
    };
  }
  if (booking.isCompleted) {
    return {
      status: "Completed",
      color: "text-green-500",
      bgColor: "bg-green-50",
      icon: FaCheckCircle,
    };
  }
  if (booking.isStarted) {
    return {
      status: "Active",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      icon: FaClock,
    };
  }
  if (!booking.isStarted && startDate > now) {
    return {
      status: "Upcoming",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      icon: FaCalendarAlt,
    };
  }
  if (!booking.isStarted && endDate < now) {
    return {
      status: "Overdue",
      color: "text-red-500",
      bgColor: "bg-red-50",
      icon: FaExclamationTriangle,
    };
  }
  return {
    status: "unknown",
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    icon: FaExclamationTriangle,
  };
};

// Check if booking can be cancelled
export const canCancelBooking = (booking) => {
  const now = new Date();
  const startDate = new Date(booking.startDate);

  return !booking.isCancelled && !booking.isCompleted && !booking.isStarted;
};

// Filter bookings by status
export const filterBookingsByStatus = (bookings, filter) => {
  const now = new Date();

  return bookings.filter((booking) => {
    const startDate = new Date(booking.startDate);

    switch (filter) {
      case "active":
        return (
          !booking.isCancelled && !booking.isCompleted && booking.isStarted
        );
      case "upcoming":
        return (
          !booking.isCancelled &&
          !booking.isCompleted &&
          !booking.isStarted &&
          startDate > now
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

// Get booking counts for filters
export const getBookingFilterCounts = (bookings) => {
  const now = new Date();

  return {
    all: bookings.length,
    active: bookings.filter(
      (b) => !b.isCancelled && !b.isCompleted && b.isStarted
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

// utils/bookingCalculations.js
export const calculateBookingAmounts = (booking, rentalDays) => {
  if (!booking) return null;

  // ✅ CALCULATE BASE AMOUNT from booking details
  let baseAmount = 0;

  if (booking.bookingType === "perDay") {
    baseAmount = booking.car.pricePerDay * rentalDays;
  } else if (booking.bookingType === "perKm") {
    if (booking.kmTravelled > 0) {
      // For completed rides, use actual KM with minimum day charge
      const kmAmount = booking.kmTravelled * booking.car.pricePerKm;
      const minDayCharge = booking.car.pricePerDay;
      baseAmount = Math.max(kmAmount, minDayCharge);
    } else {
      // For pending rides, show minimum day charge
      baseAmount = booking.car.pricePerDay;
    }
  }

  // ✅ CALCULATE AC CHARGES (10% of base amount)
  const acCharges = booking.isAC ? Math.round(baseAmount * 0.1) : 0;

  // ✅ GET FINES
  const lateReturnFine = booking.lateReturnFine || 0;
  const cancellationFine = booking.cancellationFine || 0;

  // ✅ CALCULATE FINAL AMOUNT based on booking state
  let finalAmount = 0;
  let displayAmount = 0;

  if (booking.isCancelled) {
    // For cancelled bookings, only charge cancellation fine
    finalAmount = cancellationFine;
    displayAmount = cancellationFine;
  } else {
    // For active/completed bookings
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
    originalBookingAmount: booking.totalAmount, // Original amount when booking was made
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

// ✅ NEW: Get booking display information
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
