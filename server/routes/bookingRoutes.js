const express = require("express");
const {
  cancelBooking,
  getBookingHistory,
  getSingleBooking,
} = require("../controllers/bookingsController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get(
  "/get-booking-history",
  protect(["customer", "admin", "driver", "carOwner"]),
  getBookingHistory
);

router.get(
  "/get-single-booking/:bookingId",
  protect(["customer", "admin", "driver", "carOwner"]),
  getSingleBooking
);

router.post("/cancel-booking", protect(["customer", "admin"]), cancelBooking);

module.exports = router;
