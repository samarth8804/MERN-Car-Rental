const cron = require("node-cron");
const mongoose = require("mongoose");

// Cron job to keep mongodb connection alive
const keepMongoDBAlive = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.db.admin().ping();
        console.log(
          `[${new Date().toISOString()}] MongoDB connection is alive.`
        );
      } else {
        console.log(
          `[${new Date().toISOString()}] MongoDB connection is not disconnected.`
        );
      }
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] MongoDB ping failed : `,
        error.message
      );
    }
  });
};

// Cron job to keep render alive
const keepRenderAlive = () => {
  const SERVICE_URL = process.env.SERVICE_URL;

  if (!SERVICE_URL) {
    console.warn("SERVICE_URL is not defined in environment variables.");
    return;
  }

  cron.schedule("*/10 * * * *", async () => {
    try {
      const http = require("http");
      const https = require("https");
      const protocol = SERVICE_URL.startsWith("https") ? https : http;

      protocol
        .get(`${SERVICE_URL}/api/health`, (res) => {
          console.log(
            `[${new Date().toISOString()}] Render keep alive : ${
              res.statusCode
            }`
          );
        })
        .on("error", (error) => {
          console.error(
            `[${new Date().toISOString()}] Render keep alive failed : `,
            error.message
          );
        });
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Render keep alive error : `,
        error.message
      );
    }
  });
};

// Initialize all cron jobs

const initializeCronJobs = () => {
  console.log("Initializing cron jobs...");

  keepMongoDBAlive();
  console.log("MongoDB keep-alive cron job started.");

  if (process.env.NODE_ENV === "production") {
    keepRenderAlive();
    console.log("Render keep-alive cron job started.");
  } else {
    console.log("Render keep-alive cron job not started (not in production).");
  }

  console.log("All cron jobs initialized.");
};

module.exports = {initializeCronJobs};
