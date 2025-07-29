const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    licensePlate: { type: String, required: true, unique: true },
    year: { type: Number, required: true, min: 2015 },
    city: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Mumbai",
        "Delhi",
        "Bangalore",
        "Chennai",
        "Kolkata",
        "Hyderabad",
        "Pune",
        "Ahmedabad",
        "Jaipur",
        "Lucknow",
        "Kanpur",
        "Nagpur",
        "Indore",
        "Thane",
        "Bhopal",
        "Coimbatore",
        "Visakhapatnam",
        "Vadodara",
        "Patna",
        "Ghaziabad",
        "Ludhiana",
        "Agra",
        "Madurai",
        "Nashik",
      ],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarOwner",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isAvailable: { type: Boolean, default: true },
    pricePerDay: { type: Number, required: true, min: 0 },
    pricePerKm: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    totalRides: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Add index for city-based queries
carSchema.index({ city: 1, status: 1, isAvailable: 1 });

module.exports = mongoose.model("Car", carSchema);
