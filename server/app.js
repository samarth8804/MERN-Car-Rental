const dotenv = require("dotenv");

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

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

// Middleware to handle CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust this to your frontend URL
    methods: ["GET,POST,PUT,DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB();

// routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/car-owner", carOwnerRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/car", carRoutes);
app.use("/api/v1/driver", driverRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
