const Cars = require("../models/Cars");

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
