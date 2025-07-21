const Cars = require("../models/Cars");
const Bookings = require("../models/Bookings");
const Customer = require("../models/Customer");
const { sendNotifications } = require("../utils/sendNotifications");

exports.getBookingHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.role;

    let filter = {};

    if (role === "customer") {
      filter.customer = userId;
    } else if (role === "driver") {
      filter.driver = userId;
    } else if (role === "carOwner") {
      const ownerCars = await Cars.find({ ownerId: userId }).select("_id");
      filter.car = { $in: ownerCars.map((c) => c._id) };
    } else if (role === "admin") {
      // Admin can see all bookings
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view booking history",
      });
    }

    const bookings = await Bookings.find(filter)
      .populate("car", "brand model licensePlate")
      .populate("customer", "fullname email")
      .populate("driver", "fullname email")
      .sort({ createdAt: -1 });

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found",
      });
    }

    // Format bookings to include only necessary fields
    const bookingHistory = bookings.map((booking) => {
      const commonFields = {
        _id: booking._id,
        car: {
          brand: booking.car.brand,
          model: booking.car.model,
          licensePlate: booking.car.licensePlate,
        },
        customer: {
          fullname: booking.customer.fullname,
          email: booking.customer.email,
        },
        driver: {
          fullname: booking.driver?.fullname || "N/A",
          email: booking.driver?.email || "N/A",
        },
        pickupLocation: booking.pickupLocation,
        dropLocation: booking.dropLocation,
        startDate: booking.startDate,
        endDate: booking.endDate,
        actualReturnDate: booking.actualReturnDate,
        lateReturnFine: booking.lateReturnFine,
        bookingType: booking.bookingType,
        kmTravelled: booking.kmTravelled,
        isAC: booking.isAC,
        totalAmount: booking.totalAmount,
        isCompleted: booking.isCompleted,
        isCancelled: booking.isCancelled,
        cancellationFine: booking.cancellationFine,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };
      if (role === "customer") {
        return {
          ...commonFields,
          uniqueCode: booking.uniqueCode,
        };
      }

      return commonFields;
    });

    return res.status(200).json({
      success: true,
      message: "Booking history fetched successfully",
      bookingHistory,
    });
  } catch (error) {
    console.error("Error fetching booking history:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getSingleBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;
    const role = req.role;

    const booking = await Bookings.findById(bookingId)
      .populate("car", "brand model licensePlate ownerId")
      .populate("customer", "fullname email")
      .populate("driver", "fullname email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if the user has permission to view this booking
    if (
      (role === "customer" &&
        booking.customer._id.toString() !== userId.toString()) ||
      (role === "driver" &&
        booking.driver._id.toString() !== userId.toString()) ||
      (role === "carOwner" &&
        booking.car.ownerId.toString() !== userId.toString()) ||
      (role !== "admin" &&
        role !== "customer" &&
        role !== "driver" &&
        role !== "carOwner")
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this booking",
      });
    }

    // Format booking details
    const bookingDetails = {
      _id: booking._id,
      car: {
        brand: booking.car.brand,
        model: booking.car.model,
        licensePlate: booking.car.licensePlate,
      },
      customer: {
        fullname: booking.customer.fullname,
        email: booking.customer.email,
      },
      driver: {
        fullname: booking.driver?.fullname || "N/A",
        email: booking.driver?.email || "N/A",
      },
      pickupLocation: booking.pickupLocation,
      dropLocation: booking.dropLocation,
      startDate: booking.startDate,
      endDate: booking.endDate,
      actualReturnDate: booking.actualReturnDate,
      lateReturnFine: booking.lateReturnFine,
      bookingType: booking.bookingType,
      kmTravelled: booking.kmTravelled,
      isAC: booking.isAC,
      totalAmount: booking.totalAmount,
      isCompleted: booking.isCompleted,
      isCancelled: booking.isCancelled,
      cancellationFine: booking.cancellationFine,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };

    if (role === "customer") {
      bookingDetails.uniqueCode = booking.uniqueCode;
    }

    return res.status(200).json({
      success: true,
      message: "Booking details fetched successfully",
      booking: bookingDetails,
    });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

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
