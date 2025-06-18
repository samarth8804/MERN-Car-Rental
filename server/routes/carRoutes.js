const express = require("express");
const { getCarDetails } = require("../controllers/carController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get(
  "/car-details/:id",
  protect(["admin", "customer", "driver", "carOwner"]),
  getCarDetails
);

module.exports = router;
