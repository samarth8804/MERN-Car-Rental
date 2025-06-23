const Cars = require("../models/Cars");
const Bookings = require("../models/Bookings");
const Customer = require("../models/Customer");
const Driver = require("../models/Driver");
const { nanoid } = require("nanoid");

exports.getAvailableCars = async (req, res) => {
  try {
    const cars = await Cars.find({
      isAvailable: true,
      status: "approved",
    })
      .select(
        "brand model year licensePlate pricePerKm pricePerDay imageUrl isAvailable"
      )
      .sort({
        createdAt: -1,
      });

    if (cars.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No available cars found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Available cars fetched successfully",
      cars,
    });
  } catch (error) {
    console.error("Error fetching available cars:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.bookCar = async (req, res) => {
  try {
    const { carId, startDate, endDate, bookingType, isAC = false } = req.body;

    const customerId = req.user._id;

    // Validate required fields
    if (!carId || !startDate || !endDate || !bookingType) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check for startDate and endDate validity
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const car = await Cars.findOne({
      _id: carId,
      status: "approved",
      isAvailable: true,
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found or not available",
      });
    }

    // Check if the car is already booked for the given dates

    const overlappingBooking = await Bookings.findOne({
      car: carId,
      isCancelled: false,
      isCompleted: false,
      startDate: { $lte: new Date(endDate) },
      endDate: { $gte: new Date(startDate) },
    });

    if (overlappingBooking) {
      return res.status(400).json({
        success: false,
        message: "Car is already booked for the selected dates",
      });
    }

    const drivers = await Driver.find({ status: "approved" }).sort({
      rating: -1,
    });

    if (drivers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No drivers available",
      });
    }

    // check drivers availability for given dates

    let selectedDriver = null;

    for (const driver of drivers) {
      const isBusy = await Bookings.exists({
        driver: driver._id,
        isCancelled: false,
        isCompleted: false,
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) },
      });

      if (!isBusy) {
        selectedDriver = driver;
        break; // Pick the first(highest-rated) available driver
      }
    }

    if (!selectedDriver) {
      return res.status(404).json({
        success: false,
        message: "No drivers available for the selected dates",
      });
    }

    // Create a new booking
    const newBooking = new Bookings({
      customer: customerId,
      driver: selectedDriver._id,
      car: carId,
      startDate,
      endDate,
      bookingType,
      isAC,
      uniqueCode: nanoid(10),
    });

    // Mark the car as unavailable
    car.isAvailable = false;

    await newBooking.save();
    await car.save();

    return res.status(201).json({
      success: true,
      message: "Car booked successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error booking car:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.cancelBooking = (req, res) => {};

exports.getCustomerProfile = (req, res) => {};

exports.updateCustomerProfile = (req, res) => {};
