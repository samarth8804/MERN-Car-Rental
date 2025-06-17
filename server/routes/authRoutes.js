const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  registerCustomer,
  loginCustomer,
  registerCarOwner,
  loginCarOwner,
  registerDriver,
  loginDriver,
  createCustomer,
  createCarOwner,
  createDriver,
} = require("../controllers/authController");

// Admin login route
router.post("/login/admin", loginAdmin);

// Customer registration and login routes
router.post("/register/customer", registerCustomer);
router.post("/create/customer", createCustomer);
router.post("/login/customer", loginCustomer);

// Car Owner registration and login routes

router.post("/register/car-owner", registerCarOwner);
router.post("/create/car-owner", createCarOwner);
router.post("/login/car-owner", loginCarOwner);

// Driver registration and login routes

router.post("/register/driver", registerDriver);
router.post("/create/driver", createDriver);
router.post("/login/driver", loginDriver);

module.exports = router;
