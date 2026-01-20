const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();
const { initializeCronJobs } = require("./utils/cronJobs");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const adminRoutes = require("./routes/adminRoutes");
const carOwnerRoutes = require("./routes/carOwnerRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const carRoutes = require("./routes/carRoutes");
const driverRoutes = require("./routes/driverRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const locationRoutes = require("./routes/locationRoutes");
const healthRoutes = require("./routes/healthRoutes");

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB();

initializeCronJobs();

// Debug endpoint to see all upload locations
app.get("/debug/uploads", (req, res) => {
  // Check multiple possible upload locations
  const possiblePaths = [
    path.join(__dirname, "uploads"),
    path.join(process.cwd(), "uploads"),
    "/opt/render/project/src/uploads",
    "/opt/render/project/src/server/uploads", // Add this path
  ];

  const results = {};

  for (const uploadPath of possiblePaths) {
    try {
      if (fs.existsSync(uploadPath)) {
        const files = fs.readdirSync(uploadPath);
        results[uploadPath] = {
          exists: true,
          fileCount: files.length,
          files: files.slice(0, 10), // Show first 10 files
        };
      } else {
        results[uploadPath] = {
          exists: false,
        };
      }
    } catch (error) {
      results[uploadPath] = {
        error: error.message,
      };
    }
  }

  res.json({
    results,
    dirname: __dirname,
    cwd: process.cwd(),
  });
});

// Improved static file serving for uploads
const uploadsDir = path.join(__dirname, "uploads");

// Make sure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  console.log(`Creating uploads directory: ${uploadsDir}`);
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Created successfully");
  } catch (err) {
    console.error("Error creating uploads directory:", err);
  }
}

// Serve uploaded images with improved error handling
app.use("/uploads", (req, res, next) => {
  // First try the original path
  const filePath = path.join(uploadsDir, req.path);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      // File exists, serve it
      res.sendFile(filePath);
    } else {
      // File doesn't exist in the main directory
      // Try alternative paths on Render
      const renderPath = path.join(process.cwd(), "uploads", req.path);
      const renderServerPath = path.join(__dirname, "uploads", req.path); // This will find the right path

      // Try the first alternative path
      fs.access(renderPath, fs.constants.F_OK, (err2) => {
        if (!err2) {
          // Found in alternative location
          res.sendFile(renderPath);
        } else {
          // Try the second alternative path
          fs.access(renderServerPath, fs.constants.F_OK, (err3) => {
            if (!err3) {
              // Found in server uploads
              res.sendFile(renderServerPath);
            } else {
              // Not found anywhere, log info and pass to next middleware
              console.log(`File not found: ${req.path}`);
              console.log(`Tried: ${filePath}`);
              console.log(`Tried: ${renderPath}`);
              console.log(`Tried: ${renderServerPath}`);
              res.status(404).send("Image not found");
            }
          });
        }
      });
    }
  });
});

// routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/carOwner", carOwnerRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/car", carRoutes);
app.use("/api/v1/driver", driverRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/location", locationRoutes);
app.use("/api", healthRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
