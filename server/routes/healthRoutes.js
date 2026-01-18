const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Health check endpoint
router.get("/", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: Math.floor(process.uptime()),
  });
});

module.exports = router;
