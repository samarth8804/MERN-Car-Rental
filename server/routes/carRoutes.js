const express = require("express");
const { getCarDetails, deleteCar } = require("../controllers/carController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get(
  "/car-details/:id",
  protect(["admin", "customer", "driver", "carOwner"]),
  getCarDetails
);

// Car Owner or admin deletes a Car
router.delete("/delete-car/:carId", protect(["carOwner", "admin"]), deleteCar);

module.exports = router;
