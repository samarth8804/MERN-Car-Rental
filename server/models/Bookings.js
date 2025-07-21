const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    pickupLocation: {
      address: { type: String, required: true },
      coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    },
    dropLocation: {
      address: { type: String, required: true },
      coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    actualReturnDate: { type: Date, default: null },
    lateReturnFine: { type: Number, default: 0 },
    bookingType: { type: String, enum: ["perDay", "perKm"], required: true },
    kmTravelled: { type: Number, default: 0 },
    isAC: { type: Boolean, default: false },
    totalAmount: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    cancellationFine: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    uniqueCode: { type: String, unique: true, required: true },
    isRated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
