const cron = require("node-cron");
const axios = require("axios");
const mongoose = require("mongoose");
const connectDB = require("../config/db");

function initializeCronJobs() {
  // 1) MongoDB ping every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      console.log("[CRON] MongoDB cron job started");

      if (mongoose.connection.readyState !== 1) {
        console.log("[CRON] MongoDB not connected. Reconnecting...");
        await connectDB();
      } else {
        console.log("[CRON] MongoDB is already connected.");
      }
    } catch (err) {
      console.error("[CRON] MongoDB cron job error:", err.message);
    }
  });

  // 2) Render keep-alive every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    const serviceUrl = process.env.SERVICE_URL;

    if (!serviceUrl) {
      console.log("[CRON] SERVICE_URL not set, skipping Render keep-alive.");
      return;
    }

    try {
      console.log("[CRON] Sending keep-alive to:", serviceUrl);
      await axios.get(serviceUrl);
      console.log("[CRON] Keep-alive successful");
    } catch (err) {
      console.error(
        "[CRON] Render keep-alive job error:",
        err.response?.status,
        err.message
      );
    }
  });
}

module.exports = { initializeCronJobs };
