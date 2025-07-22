const express = require("express");
const {
  getAvailableCars,
  bookCar,
  getCustomerProfile,
  rateDriver,
} = require("../controllers/customerController");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");

router.get("/get-available-cars", getAvailableCars);

router.post("/book-car", protect(["customer"]), bookCar);

router.get("/get-customer-profile", protect(["customer"]), getCustomerProfile);

router.post("/rate-driver", protect(["customer"]), rateDriver);

module.exports = router;
