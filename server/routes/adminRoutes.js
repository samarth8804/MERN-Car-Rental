const express = require("express");
const {
  getAllCars,
  approveCar,
  rejectCar,
  getAllDrivers,
  approveDriver,
  rejectDriver,
  getAllBookings,
} = require("../controllers/adminController");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

router.get("/getAllCars", protect(["admin"]), getAllCars);

router.patch("/approveCar/:carId", protect(["admin"]), approveCar);

router.patch("/rejectCar/:carId", protect(["admin"]), rejectCar);

router.get("/getAllDrivers", protect(["admin"]), getAllDrivers);

router.patch("/approveDriver/:driverId", protect(["admin"]), approveDriver);

router.patch("/rejectDriver/:driverId", protect(["admin"]), rejectDriver);

router.get("/getAllBookings", protect(["admin"]), getAllBookings);

module.exports = router;
