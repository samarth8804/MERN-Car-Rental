const express = require("express");
const router = express.Router();
const { deleteDriver } = require("../controllers/driverController");
const { protect } = require("../middlewares/authMiddleware");

router.delete(
  "/deleteDriver/:driverId",
  protect(["admin", "driver"]),
  deleteDriver
);

module.exports = router;
