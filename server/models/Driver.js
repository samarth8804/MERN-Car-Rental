const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const driverSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, match: /^[0-9]{10}$/ },
    address: { type: String, required: true },
    password: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rating: { type: Number, default: 0, max: 5, min: 0 },
    totalRides: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Hash the password before saving the driver document

driverSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords

driverSchema.method.comparePassword = async function (candiadatePassword) {
  try {
    return await bcrypt.compare(candiadatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = mongoose.model("Driver", driverSchema);
