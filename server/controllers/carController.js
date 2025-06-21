const Cars = require("../models/Cars");
const { sendNotifications } = require("../utils/sendNotifications");
const Booking = require("../models/Bookings");
const path = require("path");
const fs = require("fs").promises;

exports.getCarDetails = async (req, res) => {
  try {
    const { id: carId } = req.params;

    const { role } = req;

    if (!role) {
      return res.status(403).json({
        success: false,
        message: "Access denied, User role not found",
      });
    }

    const car = await Cars.findById(carId)
      .populate("ownerId", "fullname email")
      .populate("approvedBy", "fullname email");

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    let basicCarDetails = {
      brand: car.brand,
      model: car.model,
      year: car.year,
      licensePlate: car.licensePlate,
      pricePerDay: car.pricePerDay,
      pricePerKm: car.pricePerKm,
      imageUrl: car.imageUrl,
      isAvailable: car.isAvailable,
    };

    let extendedCarDetails = {};

    if (role === "customer" || role === "driver") {
      // Basic details only
      extendedCarDetails = {};
    } else if (role === "carOwner") {
      extendedCarDetails = {
        ownerId: car.ownerId,
        status: car.status,
        createdAt: car.createdAt,
        updatedAt: car.updatedAt,
      };
    } else if (role === "admin") {
      extendedCarDetails = {
        ownerId: car.ownerId,
        status: car.status,
        approvedBy: car.approvedBy,
        createdAt: car.createdAt,
        updatedAt: car.updatedAt,
      };
    } else {
      return res.status(403).json({
        success: false,
        message: "Access Denied.Invalid User Role",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Car details fetched successfully",
      car: { ...basicCarDetails, ...extendedCarDetails },
    });
  } catch (error) {
    console.error("Error fetching car details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const role = req.role; // From auth middleware
    const userId = req.user._id; // From auth middleware

    // Find the car by ID and owner
    let car = await Cars.findById(carId).populate("ownerId", "fullname email");

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found or unauthorized access",
      });
    }

    if (
      role === "carOwner" &&
      car.ownerId._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this car",
      });
    }

    // Check if the car is in an active booking
    const activeBooking = await Booking.findOne({
      car: car._id,
      isCompleted: false,
      isCancelled: false,
    });

    if (activeBooking) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete car with an active booking",
      });
    }

    // Delete the car
    await car.deleteOne();

    // Delete the car image from storage
    if (car.imageUrl) {
      try {
        const imagePath = path.join(
          __dirname,
          "..",
          "uploads",
          path.basename(car.imageUrl)
        );
        await fs.unlink(imagePath);
        console.log("Car image deleted successfully");
      } catch (err) {
        console.error("Error deleting car image:", err);
      }
    }

    // If the user is an admin, send a notification email to the car owner

    if (role === "admin" && car.ownerId.email) {
      await sendNotifications(
        car.ownerId.email,
        "Your Car has been Removed by easyGo",
        `<p>Dear ${car.ownerId.fullname},</p>
         <p>Your car with the license plate ${car.licensePlate} has been removed from our system by an admin.</p>
         <p>If you have any questions, please contact support.</p>
         <p>Thank you for using easyGo!</p>`
      );
    }

    return res.status(200).json({
      success: true,
      message: "Car deleted successfully",
      carId: car._id,
    });
  } catch (error) {
    console.error("Error deleting car:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
