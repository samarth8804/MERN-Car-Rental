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
  if (startDate <= now && endDate >= now) {
    return {
      status: "Active",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      icon: FaClock,
    };
  }
  if (startDate > now) {
    return {
      status: "Upcoming",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      icon: FaCalendarAlt,
    };
  }
  return {
    status: "Overdue",
    color: "text-red-500",
    bgColor: "bg-red-50",
    icon: FaExclamationTriangle,
  };
};

// Check if booking can be cancelled
export const canCancelBooking = (booking) => {
  const now = new Date();
  const startDate = new Date(booking.startDate);

  return (
    !booking.isCancelled &&
    !booking.isCompleted &&
    startDate > new Date(now.getTime() - 60 * 60 * 1000) // 1 hour buffer
  );
};

// Filter bookings by status
export const filterBookingsByStatus = (bookings, filter) => {
  const now = new Date();

  return bookings.filter((booking) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    switch (filter) {
      case "active":
        return (
          !booking.isCancelled &&
          !booking.isCompleted &&
          startDate <= now &&
          endDate >= now
        );
      case "upcoming":
        return !booking.isCancelled && !booking.isCompleted && startDate > now;
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
    active: bookings.filter((b) => {
      const startDate = new Date(b.startDate);
      const endDate = new Date(b.endDate);
      return (
        !b.isCancelled && !b.isCompleted && startDate <= now && endDate >= now
      );
    }).length,
    upcoming: bookings.filter((b) => {
      const startDate = new Date(b.startDate);
      return !b.isCancelled && !b.isCompleted && startDate > now;
    }).length,
    completed: bookings.filter((b) => b.isCompleted).length,
    cancelled: bookings.filter((b) => b.isCancelled).length,
  };
};
