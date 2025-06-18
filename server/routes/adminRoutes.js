const express = require("express");
const {
  getAllCars,
  approveCar,
  rejectCar,
  deleteCar,
  getAllDrivers,
  approveDriver,
  rejectDriver,
  deleteDriver,
  getAllBookings,
} = require("../controllers/adminController");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

router.get("/getAllCars", protect(["admin"]), getAllCars);

router.patch("/approveCar", protect(["admin"]), approveCar);

router.patch("/rejectCar", protect(["admin"]), rejectCar);

router.delete("/deleteCar/:carId", protect(["admin"]), deleteCar);

router.get("/getAllDrivers", protect(["admin"]), getAllDrivers);

router.patch("/approveDriver", protect(["admin"]), approveDriver);

router.patch("/rejectDriver", protect(["admin"]), rejectDriver);

router.delete("/deleteDriver/:driverId", protect(["admin"]), deleteDriver);

router.get("/getAllBookings", protect(["admin"]), getAllBookings);

module.exports = router;
