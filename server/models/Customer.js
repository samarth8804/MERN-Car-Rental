const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const customerSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, match: /^[0-9]{10}$/ },
    address: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Hash the password before saving the customer document

customerSchema.pre("save", async function (next) {
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
customerSchema.methods.comparePassword = async function (candiadatePassword) {
  try {
    return await bcrypt.compare(candiadatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = mongoose.model("Customer", customerSchema);
