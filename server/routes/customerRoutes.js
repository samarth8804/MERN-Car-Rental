const express = require("express");
const {
  getAvailableCars,
  bookCar,
  rateRide,
} = require("../controllers/customerController");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

router.get("/get-available-cars", getAvailableCars);

router.post("/book-car", protect(["customer"]), bookCar);

router.post("/rate-ride", protect(["customer"]), rateRide);

module.exports = router;
