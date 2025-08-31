const Cars = require("../models/Cars");
const Driver = require("../models/Driver");
const Customer = require("../models/Customer");
const CarOwner = require("../models/CarOwner");

exports.getAllCars = async (req, res) => {
  try {
    const cars = await Cars.find()
      .populate("ownerId", "fullname email phone")
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

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find()
      .select("-password")
      .populate("approvedBy", "fullname email")
      .sort({ createdAt: -1 });

    if (drivers.length === 0) {
      return res
        .status(404)
        .json({ message: "No drivers found", success: false });
    }

    res.status(200).json({
      success: true,
      message: "Drivers fetched successfully",
      drivers,
    });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.approveDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const adminId = req.user._id;

    const driver = await Driver.findById(driverId).select("-password");

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    if (driver.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Driver is already approved",
      });
    }

    driver.status = "approved";
    driver.approvedBy = adminId;
    driver.updatedAt = new Date();

    await driver.save();

    return res.status(200).json({
      success: true,
      message: "Driver approved successfully",
      driver,
    });
  } catch (error) {
    console.error("Error approving driver:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.rejectDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const adminId = req.user._id;

    const driver = await Driver.findById(driverId).select("-password");

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    if (driver.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot reject an already approved driver",
      });
    }

    if (driver.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Driver is already rejected",
      });
    }

    driver.status = "rejected";
    driver.updatedAt = new Date();

    await driver.save();

    return res.status(200).json({
      success: true,
      message: "Driver rejected successfully",
      driver,
      rejectedBy: adminId,
    });
  } catch (error) {
    console.error("Error rejecting driver:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .select("-password")
      .sort({ createdAt: -1 });

    if (customers.length === 0) {
      return res
        .status(404)
        .json({ message: "No customers found", success: false });
    }

    res.status(200).json({
      success: true,
      message: "Customers fetched successfully",
      customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllCarOwners = async (req, res) => {
  try {
    const carOwners = await CarOwner.find()
      .select("-password")
      .sort({ createdAt: -1 });

    if (carOwners.length === 0) {
      return res
        .status(404)
        .json({ message: "No car owners found", success: false });
    }

    res.status(200).json({
      success: true,
      message: "Car owners fetched successfully",
      carOwners,
    });
  } catch (error) {
    console.error("Error fetching car owners:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
