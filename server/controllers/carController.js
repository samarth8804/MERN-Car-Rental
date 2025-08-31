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
      _id: car._id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      licensePlate: car.licensePlate,
      pricePerDay: car.pricePerDay,
      pricePerKm: car.pricePerKm,
      imageUrl: car.imageUrl,
      isAvailable: car.isAvailable,
      rating: car.rating,
      city: car.city,
      totalRides: car.totalRides,
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

exports.getAvailableCities = async (req, res) => {
  try {
    // Get cities with available cars
    const citiesData = await Cars.aggregate([
      {
        $match: {
          status: "approved",
          isAvailable: true,
        },
      },
      {
        $group: {
          _id: "$city",
          availableCars: { $sum: 1 },
          minPrice: { $min: "$pricePerDay" },
          maxPrice: { $max: "$pricePerDay" },
          avgPrice: { $avg: "$pricePerDay" },
        },
      },
      {
        $project: {
          city: "$_id",
          availableCars: 1,
          minPrice: 1,
          maxPrice: 1,
          avgPrice: { $round: ["$avgPrice", 0] },
          _id: 0,
        },
      },
      {
        $sort: { availableCars: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: citiesData.length,
      data: citiesData,
    });
  } catch (error) {
    console.error("Error fetching available cities:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching available cities",
      error: error.message,
    });
  }
};

exports.getCarsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const { startDate, endDate } = req.query;

    let cars = await Cars.find({
      city: city,
      status: "approved",
      isAvailable: true,
    })
      .select(
        "brand model year licensePlate pricePerKm pricePerDay imageUrl isAvailable city rating totalRides"
      )
      .sort({ pricePerDay: 1 });

    let bookedCarIds = [];

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Find booking that conflict with the given dates
      bookedCarIds = await Booking.find({
        car: { $in: cars.map((car) => car._id) },
        isCancelled: false,
        isCompleted: false,
        startDate: { $lte: end },
        endDate: { $gte: start },
      }).distinct("car");
    }

    // Filter out booked cars
    cars = cars.filter((car) => {
      return !bookedCarIds
        .map((id) => id.toString())
        .includes(car._id.toString());
    });

    res.status(200).json({
      success: true,
      count: cars.length,
      city: city,
      cars: cars,
    });
  } catch (error) {
    console.error("Error fetching cars by city:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cars by city",
      error: error.message,
    });
  }
};

exports.checkCarAvailability = async (req, res) => {
  try {
    console.log("=== AVAILABILITY CHECK START ===");
    console.log("Request body:", req.body);

    const { carId, startDate, endDate } = req.body;

    if (!carId || !startDate || !endDate) {
      console.log("Missing required fields:", { carId, startDate, endDate });
      return res.status(400).json({
        success: false,
        message: "Car ID, start date, and end date are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    console.log("Parsed dates:", { start, end });

    // Validate that start date is before end date
    if (start > end) {
      console.log("Invalid date range: start > end");
      return res.status(400).json({
        success: false,
        message: "Start date must be before or same as end date",
      });
    }

    // First, let's see ALL bookings for this car
    const allBookingsForCar = await Booking.find({ car: carId });
    console.log(
      "All bookings for car:",
      allBookingsForCar.map((b) => ({
        id: b._id,
        startDate: b.startDate,
        endDate: b.endDate,
        isCancelled: b.isCancelled,
        isCompleted: b.isCompleted,
      }))
    );

    // ✅ FIXED: For full day rentals, no same-day transitions allowed
    // Conflict exists if dates overlap OR touch (same day)
    const conflictingBookings = await Booking.find({
      car: carId,
      startDate: { $lte: end }, // Booking starts on or before our end date
      endDate: { $gte: start }, // Booking ends on or after our start date
      isCancelled: { $ne: true },
      isCompleted: { $ne: true },
    }).populate("customer", "fullname email");

    console.log("Query used for conflicts:", {
      car: carId,
      startDate: { $lte: end }, // <= instead of <
      endDate: { $gte: start }, // >= instead of >
      isCancelled: { $ne: true },
      isCompleted: { $ne: true },
    });

    console.log(
      "Conflicting bookings found:",
      conflictingBookings.map((b) => ({
        id: b._id,
        startDate: b.startDate,
        endDate: b.endDate,
        isCancelled: b.isCancelled,
        isCompleted: b.isCompleted,
        customer: b.customerId?.fullname,
        conflictReason: `Existing: ${b.startDate.toDateString()} to ${b.endDate.toDateString()}, Requested: ${start.toDateString()} to ${end.toDateString()}`,
      }))
    );

    const isAvailable = conflictingBookings.length === 0;

    console.log("Final result:", {
      isAvailable,
      conflictCount: conflictingBookings.length,
      requestedPeriod: `${start.toDateString()} to ${end.toDateString()}`,
    });
    console.log("=== AVAILABILITY CHECK END ===");

    res.status(200).json({
      success: true,
      isAvailable,
      conflictingBookings: conflictingBookings.map((booking) => ({
        id: booking._id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        customerName: booking.customerId?.fullname || "Unknown",
        customerEmail: booking.customerId?.email || "Unknown",
      })),
      message: isAvailable
        ? "Car is available for the selected dates"
        : `Car is not available. ${conflictingBookings.length} conflicting booking(s) found.`,
    });
  } catch (error) {
    console.error("Error checking car availability:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while checking availability",
    });
  }
};
