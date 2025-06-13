const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure that each email can only have one OTP at a time
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP expires after 5 minutes
  },
});

module.exports = mongoose.model("OTP", otpSchema);
// This model is used to store OTPs for email verification or password reset
