const Car = require("../models/Cars");
const Booking = require("../models/Bookings");

exports.addCar = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      licensePlate,
      pricePerDay,
      pricePerKm,
      imageUrl,
    } = req.body;

    // Validate required fields
    if (
      !brand ||
      !model ||
      !year ||
      !licensePlate ||
      !pricePerDay ||
      !pricePerKm ||
      !imageUrl
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate year
    if (year < 2015) {
      return res.status(400).json({
        success: false,
        message: "Year must be 2015 or later",
      });
    }

    // Check if car with same license plate already exists
    const existingCar = await Car.findOne({ licensePlate });
    if (existingCar) {
      return res.status(400).json({
        success: false,
        message: "Car with this license plate already exists",
      });
    }

    // Create new car
    const newCar = await Car.create({
      brand,
      model,
      year,
      licensePlate,
      pricePerDay,
      pricePerKm,
      imageUrl,
      ownerId: req.user._id, // From auth middleware
    });

    return res.status(201).json({
      success: true,
      message: "Car submitted for approval",
    });
  } catch (error) {
    console.error("Error adding car:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getMyCars = async (req, res) => {
  try {
    const cars = await Car.find({ ownerId: req.user._id }).sort({
      createdAt: -1,
    });

    if (cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cars found for this owner",
      });
    }

    return res.status(200).json({
      success: true,
      count: cars.length,
      message: "Cars retrieved successfully",
      cars,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const carId = req.params.id;
    const ownerId = req.user._id; // From auth middleware

    const {
      brand,
      model,
      year,
      licensePlate,
      pricePerDay,
      pricePerKm,
      imageUrl,
    } = req.body;

    // Validate required fields
    if (
      !brand ||
      !model ||
      !year ||
      !licensePlate ||
      !pricePerDay ||
      !pricePerKm ||
      !imageUrl
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate year
    if (year < 2015) {
      return res.status(400).json({
        success: false,
        message: "Year must be 2015 or later",
      });
    }

    // Find the car by ID and owner
    const car = await Car.findOne({ _id: carId, ownerId });
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found or unauthorized access",
      });
    }

    // Check if the license plate is updated and already used by another car
    if (licensePlate !== car.licensePlate) {
      const existingCar = await Car.findOne({ licensePlate });
      if (existingCar) {
        return res.status(400).json({
          success: false,
          message: "Car with this license plate already exists",
        });
      }
    }

    // Update car fields
    car.brand = brand;
    car.model = model;
    car.year = year;
    car.licensePlate = licensePlate;
    car.pricePerDay = pricePerDay;
    car.pricePerKm = pricePerKm;
    car.imageUrl = imageUrl;
    car.status = "pending"; // Reset status to pending on update
    car.updatedAt = new Date(); // Update the timestamp

    await car.save();

    return res.status(200).json({
      success: true,
      message: "Car updated successfully and submitted for re-approval",
    });
  } catch (error) {
    console.error("Error updating car:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
