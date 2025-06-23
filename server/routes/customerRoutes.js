const express = require("express");
const {
  getAvailableCars,
  bookCar,
  cancelBooking,
  getCustomerProfile,
  updateCustomerProfile,
} = require("../controllers/customerController");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

router.get("/get-available-cars", protect(["customer"]), getAvailableCars);

router.post("/book-car", protect(["customer"]), bookCar);

router.post("/cancel-booking", protect(["customer"]), cancelBooking);

router.get("/get-customer-profile", protect(["customer"]), getCustomerProfile);

router.put(
  "/update-customer-profile",
  protect(["customer"]),
  updateCustomerProfile
);

module.exports = router;
