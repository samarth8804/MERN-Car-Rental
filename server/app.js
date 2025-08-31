const dotenv = require("dotenv");

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const app = express();

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

// Middleware to handle CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    methods: ["GET,POST,PUT,DELETE,PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB();

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

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
