const express = require("express");
const {
  addCar,
  deleteCar,
  updateCar,
  getMyCars,
} = require("../controllers/carOwnerController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// Car Owner Adds a Car
router.post("/add-car", protect(["carOwner"]), addCar);

// Car Owner gets own cars
router.get("/my-cars", protect(["carOwner"]), getMyCars);

// Car Owner updates a Car
router.put("/update-car/:id", protect(["carOwner"]), updateCar);

// Car Owner deletes a Car
router.delete("/delete-car/:id", protect(["carOwner"]), deleteCar);

module.exports = router;
