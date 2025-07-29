const Driver = require("../models/Driver");
const Bookings = require("../models/Bookings");
const Cars = require("../models/Cars");
const OTP = require("../models/OTP_Email");
const Customer = require("../models/Customer");
const { sendOTP } = require("../utils/sendOTP");
const { sendNotifications } = require("../utils/sendNotifications");

exports.deleteDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const role = req.role;
    const userId = req.user._id;
    console.log(role);

    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    if (role === "driver" && driver._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this account",
      });
    }

    // Check if the driver has any bookings
    const activeBooking = await Bookings.findOne({
      driverId: driverId,
      isCompleted: false,
      isCancelled: false,
    });

    if (activeBooking) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete driver with active bookings",
      });
    }

    // Delete the driver
    await driver.deleteOne();

    // Optionally, send an email notification to the driver if admin is deleting
    if (role === "admin" && driver.email) {
      await sendNotifications(
        driver.email,
        "Your Account has been Removed by easyGo",
        `<p>Dear ${driver.fullname},</p>
             <p>Your Account with the license number ${driver.licenseNumber} has been removed from our system by an admin.</p>
             <p>If you have any questions, please contact support.</p>
             <p>Thank you for using easyGo!</p>`
      );
    }

    return res.status(200).json({
      success: true,
      message: "Driver deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting driver:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.endRide = async (req, res) => {
  try {
    const { bookingId, uniqueCode, actualReturnDate, kmTravelled } = req.body;
    const driverId = req.user._id;

    // Validate input
    if (!actualReturnDate || !kmTravelled || !uniqueCode || !bookingId) {
      return res.status(400).json({
        success: "false",
        message: "Please provide all required fields.",
      });
    }

    const booking = await Bookings.findById(bookingId);

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if driver is authorized to end this ride
    if (booking.driver.toString() !== driverId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to end this ride",
      });
    }

    // Check if ride is already completed
    if (booking.isCompleted) {
      return res.status(400).json({
        success: false,
        message: "Ride is already ended",
      });
    }

    // Check if unique code matches
    if (booking.uniqueCode !== uniqueCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid unique code",
      });
    }

    const car = await Cars.findById(booking.car);

    // Check if car exists
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Calculate billing summary
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    const actualReturn = new Date(actualReturnDate);

    let rideDays;
    if (endDate > actualReturn) {
      rideDays = Math.ceil((endDate - startDate) / oneDay);
    } else {
      rideDays = Math.ceil((actualReturn - startDate) / oneDay);
    }

    const plannedDays = Math.ceil((endDate - startDate) / oneDay);
    const lateDays = Math.max(0, rideDays - plannedDays);

    let totalAmount = 0;

    let lateReturnFine = 0;

    if (booking.bookingType === "perDay") {
      totalAmount = rideDays * car.pricePerDay;
    } else if (booking.bookingType === "perKm") {
      totalAmount = kmTravelled * car.pricePerKm;
    }

    if (booking.isAC) {
      totalAmount += totalAmount * 0.1; // 10% extra for AC
    }

    if (lateDays > 0) {
      lateReturnFine = lateDays * 500; // Assuming 500 is the fine per late day
      totalAmount += lateReturnFine; // Add late return fine to total amount
    }

    // Update booking details
    booking.actualReturnDate = actualReturn;
    booking.kmTravelled = kmTravelled;
    booking.totalAmount = totalAmount;
    booking.lateReturnFine = lateReturnFine;

    await booking.save();

    // Send OTP to driver
    await sendOTP(req.user.email, "OTP for ending the ride");

    return res.status(200).json({
      success: true,
      message: "Verified Unique Code. OTP sent to driver email.",
      bookingId: booking._id,
      readyForCompletion: true,
      summary: {
        brand: car.brand,
        model: car.model,
        licensePlate: car.licensePlate,
        pickupLocation: booking.pickupLocation,
        dropLocation: booking.dropLocation,
        startDate: booking.startDate,
        endDate: booking.endDate,
        actualReturnDate: actualReturnDate,
        bookingType: booking.bookingType,
        kmTravelled: kmTravelled,
        isAC: booking.isAC,
        lateReturnFine: lateReturnFine,
        totalAmount: totalAmount,
      },
    });
  } catch (error) {
    console.error("Error ending ride:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.completeRide = async (req, res) => {
  try {
    const { bookingId, otp, readyForCompletion } = req.body;
    const driverId = req.user._id;

    // Validate input
    if (!bookingId || !otp || readyForCompletion !== true) {
      return res.status(400).json({
        success: false,
        message: "BookingId, OTP, and readyForCompletion are required.",
      });
    }

    // Find the booking
    const booking = await Bookings.findById(bookingId);

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if driver is authorized to complete this ride
    if (booking.driver.toString() !== driverId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to complete this ride",
      });
    }

    // Check if ride is already completed
    if (booking.isCompleted) {
      return res.status(400).json({
        success: false,
        message: "Ride is already completed",
      });
    }

    // Find the OTP for the driver
    const existingOtp = await OTP.findOne({
      email: req.user.email,
      otp: otp,
    });

    // Check if OTP is valid
    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Delete the OTP record after successful completion
    await OTP.deleteOne({ email: req.user.email, otp: otp });

    // Mark the booking as completed
    booking.isCompleted = true;
    booking.updatedAt = new Date();
    booking.paymentStatus = "completed"; // Assuming payment is done upon completion

    await booking.save();

    // Add 20% of the total amount as commission to the driver
    const driver = await Driver.findById(driverId);
    const earning = Math.round(booking.totalAmount * 0.2); // 20% commission
    driver.earnings += earning;
    driver.totalRides += 1; // Increment total rides count
    await driver.save();

    // Mark the car as available again
    const car = await Cars.findById(booking.car);
    if (car) {
      car.isAvailable = true;
      car.totalRides = (car.totalRides || 0) + 1; // Increment total rides count
      await car.save();
    }

    // Send ride summary to customer
    const customer = await Customer.findById(booking.customer);
    const rideSummary = `
      <p>Dear ${customer.fullname},</p>
      <p>Your ride has been completed. Here is the summary:</p>
      <ul>
        <li><strong>Car:</strong> ${car.brand} ${car.model} (${
      car.licensePlate
    })</li>
        <li><strong>Start Date:</strong> ${booking.startDate.toDateString()}</li>
        <li><strong>Return Date:</strong> ${booking.actualReturnDate?.toDateString()}</li>
        <li><strong>Type:</strong> ${booking.bookingType}</li>
        <li><strong>AC Used:</strong> ${booking.isAC ? "Yes" : "No"}</li>
        <li><strong>KMs Travelled:</strong> ${booking.kmTravelled}</li>
        <li><strong>Late Fine:</strong> ₹${booking.lateReturnFine}</li>
        <li><strong>Total Amount Paid:</strong> ₹${booking.totalAmount}</li>
      </ul>
      <p>Thanks for choosing easyGo!</p>
    `;

    await sendNotifications(
      customer.email,
      "easyGo Ride Completed",
      rideSummary
    );

    return res.status(200).json({
      success: true,
      message: "Ride completed successfully",
      bookingId: booking._id,
    });
  } catch (error) {
    console.error("Error completing ride:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
