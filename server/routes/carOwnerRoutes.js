const express = require("express");
const {
  addCar,
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


module.exports = router;
