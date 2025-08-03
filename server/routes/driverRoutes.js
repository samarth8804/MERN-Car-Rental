const express = require("express");
const router = express.Router();
const {
  deleteDriver,
  completeRide,
  startRide,
} = require("../controllers/driverController");
const { protect } = require("../middlewares/authMiddleware");

router.delete(
  "/deleteDriver/:driverId",
  protect(["admin", "driver"]),
  deleteDriver
);

router.post("/start-ride", protect(["driver"]), startRide);


router.post("/complete-ride", protect(["driver"]), completeRide);

module.exports = router;
