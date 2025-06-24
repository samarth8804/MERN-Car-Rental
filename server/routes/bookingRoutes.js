const express = require("express");
const { cancelBooking } = require("../controllers/bookingsController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/cancel-booking", protect(["customer","admin"]), cancelBooking);

module.exports = router;
