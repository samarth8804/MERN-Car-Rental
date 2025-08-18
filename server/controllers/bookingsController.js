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
      const ownerCars = await Cars.find({ ownerId: userId }).select(
        "_id brand model"
      );
      if (ownerCars.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No bookings found for your cars",
          bookingHistory: [],
        });
      }

      const carIds = ownerCars.map((car) => car._id);
      filter.car = { $in: carIds };
    } else if (role === "admin") {
      // Admin can see all bookings
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view booking history",
      });
    }

    const bookings = await Bookings.find(filter)
      .populate(
        "car",
        "brand model licensePlate rating ratingCount totalRides ownerId"
      )
      .populate("customer", "fullname email phone")
      .populate("driver", "fullname email phone")
      .sort({ createdAt: -1 });

    if (bookings.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No bookings found",
        bookingHistory: [],
      });
    }

    // Format bookings to include only necessary fields
    const bookingHistory = bookings.map((booking) => {
      const commonFields = {
        _id: booking._id,
        car: booking.car
          ? {
              _id: booking.car._id,
              brand: booking.car.brand,
              model: booking.car.model,
              licensePlate: booking.car.licensePlate,
              rating: booking.car.rating,
              ratingCount: booking.car.ratingCount,
              totalRides: booking.car.totalRides,
              ownerId: booking.car.ownerId,
            }
          : null,
        customer: booking.customer
          ? {
              fullname: booking.customer.fullname,
              email: booking.customer.email,
              phone: booking.customer.phone,
            }
          : null,
        driver: booking.driver
          ? {
              fullname: booking.driver?.fullname || "N/A",
              email: booking.driver?.email || "N/A",
            }
          : null,
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
        isRated: booking.isRated || false,
        carRating: booking.carRating,
        driverRating: booking.driverRating,
        ratingComment: booking.ratingComment,
        ratedAt: booking.ratedAt,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        isStarted: booking.isStarted,
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
      count: bookingHistory.length,
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
      .populate(
        "car",
        "brand model licensePlate ownerId rating ratingCount totalRides imageUrl city pricePerDay pricePerKm"
      )
      .populate("customer", "fullname email phone")
      .populate(
        "driver",
        "fullname email phone licenseNumber rating totalRides city"
      );

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
        imageUrl: booking.car.imageUrl,
        pricePerDay: booking.car.pricePerDay,
        pricePerKm: booking.car.pricePerKm,
      },
      customer: {
        fullname: booking.customer.fullname,
        email: booking.customer.email,
      },
      driver: {
        fullname: booking.driver?.fullname || "N/A",
        email: booking.driver?.email || "N/A",
        phone: booking.driver?.phone || "N/A",
        licenseNumber: booking.driver?.licenseNumber || "N/A",
        rating: booking.driver?.rating || 0,
        totalRides: booking.driver?.totalRides || 0,
      },
      pickupLocation: booking.pickupLocation,
      dropLocation: booking.dropLocation,
      startDate: booking.startDate,
      endDate: booking.endDate,
      actualReturnDate: booking.actualReturnDate || null,
      lateReturnFine: booking.lateReturnFine || 0,
      bookingType: booking.bookingType,
      kmTravelled: booking.kmTravelled || 0,
      isAC: booking.isAC,
      totalAmount: booking.totalAmount,
      isCompleted: booking.isCompleted,
      isCancelled: booking.isCancelled,
      cancellationFine: booking.cancellationFine || 0,
      paymentStatus: booking.paymentStatus,
      isRated: booking.isRated || false,
      carRating: booking.carRating,
      driverRating: booking.driverRating,
      ratingComment: booking.ratingComment,
      ratedAt: booking.ratedAt,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      isStarted: booking.isStarted,
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
      } else {
        cancellationFine = 1000;
      }
    }

    // Update booking status
    booking.isCancelled = true;
    booking.cancellationFine = cancellationFine;
    booking.totalAmount = cancellationFine;
    booking.paymentStatus = "completed"; // Assuming payment is reversed on cancellation

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
      booking: {
        _id: booking._id,
        totalAmount: booking.totalAmount,
        cancellationFine: booking.cancellationFine,
        paymentStatus: booking.paymentStatus,
        isCancelled: booking.isCancelled,
      },
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
