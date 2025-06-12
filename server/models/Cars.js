const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const carSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    licensePlate: { type: String, required: true, unique: true },
    year: { type: Number, required: true, min: 2015 },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);
