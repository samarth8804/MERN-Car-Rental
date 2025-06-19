const Cars = require("../models/Cars");
const Driver = require("../models/Driver");
const Customer = require("../models/Customer");

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Cars.find()
      .populate("ownerId", "fullname email")
      .sort({ createdAt: -1 });

    if (cars.length === 0) {
      return res.status(404).json({ message: "No cars found" });
    }

    res.status(200).json({
      success: true,
      message: "Cars fetched successfully",
      cars,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.approveCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const adminId = req.user._id;

    const car = await Cars.findById(carId);

    if (!car) {
      return res.status(404).json({
        message: "Car not found",
        success: false,
      });
    }

    if (car.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Car is already approved",
      });
    }

    car.status = "approved";
    car.approvedBy = adminId;
    car.updatedAt = new Date();

    await car.save();

    return res.status(200).json({
      success: true,
      message: "Car approved successfully",
      car,
    });
  } catch (error) {
    console.error("Error approving car:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.rejectCar = async (req, res) => {
  try {
    const { carId } = req.params;
    const adminId = req.user._id;

    const car = await Cars.findById(carId);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    if (car.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot reject already approved car",
      });
    }

    if (car.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Car is already rejected",
      });
    }

    car.status = "rejected";
    car.updatedAt = new Date();

    await car.save();

    return res.status(200).json({
      success: true,
      message: "Car rejected successfully",
      car,
      rejectedBy: adminId,
    });
  } catch (error) {
    console.error("Error rejecting car:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteCar = async (req, res) => {};

exports.getAllDrivers = async (req, res) => {};

exports.approveDriver = async (req, res) => {};

exports.rejectDriver = async (req, res) => {};

exports.deleteDriver = async (req, res) => {};

exports.getAllBookings = async (req, res) => {};
