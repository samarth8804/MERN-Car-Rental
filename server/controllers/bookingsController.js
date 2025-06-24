const Cars = require("../models/Cars");
const Bookings = require("../models/Bookings");
const Customer = require("../models/Customer");
const { sendNotifications } = require("../utils/sendNotifications");

exports.getBookingHistory = (req, res) => {};

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user._id;
    const role = req.role;

    const booking = await Bookings.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      role === "customer" &&
      booking.customer.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this booking",
      });
    }

    if (booking.isCancelled) {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    if (booking.isCompleted) {
      return res.status(400).json({
        success: false,
        message: "Booking is already completed and cannot be cancelled",
      });
    }

    // Calculate cancellation fee if applicable
    let cancellationFine = 0;
    if (role === "customer") {
      const currentDate = new Date();
      const startDate = new Date(booking.startDate);

      if (currentDate < startDate) {
        const diffInHours = Math.abs(startDate - currentDate) / 36e5; // Convert milliseconds to hours
        if (diffInHours < 24) {
          cancellationFine = 500;
        } else if (diffInHours < 48) {
          cancellationFine = 300;
        }
      }
    }
    // Update booking status
    booking.isCancelled = true;
    booking.cancellationFine = cancellationFine;
    booking.paymentStatus = "failed"; // Assuming payment is reversed on cancellation

    // Mark the car as available again
    const car = await Cars.findById(booking.car);
    if (car) {
      car.isAvailable = true;
      await car.save();
    }
    await booking.save();

    // Send notification to customer if admin cancels
    if (role === "admin") {
      const customer = await Customer.findById(booking.customer);

      if (customer?.email) {
        await sendNotifications(
          customer.email,
          "Your Booking has been cancelled by easyGo Admin",
          `<p>Dear ${customer.fullname},</p>
          <p>Your booking for the car <strong>${car.brand} ${car.model} ${
            car.licensePlate
          }</strong> from <strong>${booking.startDate.toDateString()}</strong> to <strong>${booking.endDate.toDateString()}</strong> has been cancelled by an admin.</p>
           <p>If you have any questions or need further assistance, please contact our support team.</p>
           <p>Thank you for using easyGo!</p>`
        );
      }
    }
    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
