const express = require("express");
const {
  getCarDetails,
  deleteCar,
  getAvailableCities,
  getCarsByCity,
  checkCarAvailability,
} = require("../controllers/carController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/cities", getAvailableCities);

router.get("/get-cars/:city", getCarsByCity);

router.get(
  "/car-details/:id",
  protect(["admin", "customer", "driver", "carOwner"]),
  getCarDetails
);

// Car Owner or admin deletes a Car
router.delete("/delete-car/:carId", protect(["carOwner", "admin"]), deleteCar);

// Check car availability for specific dates
router.post("/check-availability", checkCarAvailability);

module.exports = router;
