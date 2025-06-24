const express = require("express");
const {
  getAvailableCars,
  bookCar,
  getCustomerProfile,
} = require("../controllers/customerController");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

router.get("/get-available-cars", protect(["customer"]), getAvailableCars);

router.post("/book-car", protect(["customer"]), bookCar);

router.get("/get-customer-profile", protect(["customer"]), getCustomerProfile);

module.exports = router;
