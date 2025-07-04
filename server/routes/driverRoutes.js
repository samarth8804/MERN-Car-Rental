const express = require("express");
const router = express.Router();
const {
  deleteDriver,
  endRide,
  completeRide,
} = require("../controllers/driverController");
const { protect } = require("../middlewares/authMiddleware");

router.delete(
  "/deleteDriver/:driverId",
  protect(["admin", "driver"]),
  deleteDriver
);

router.post("/end-ride", protect(["driver"]), endRide);

router.post("/complete-ride", protect(["driver"]), completeRide);

module.exports = router;
