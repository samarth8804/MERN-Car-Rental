const express = require("express");
const { getCarDetails } = require("../controllers/carController");
const router = express.Router();

router.get("/car-details/:id", getCarDetails);

module.exports = router;
