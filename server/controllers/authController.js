const Admin = require("../models/Admin");
const Customer = require("../models/Customer");
const CarOwner = require("../models/CarOwner");
const Driver = require("../models/Driver");
const OTP = require("../models/OTP_Email");

const generateToken = require("../utils/generateJwtToken");
const {
  validateEmail,
  validatePhone,
  validateDomainMX,
  validatePassword,
} = require("../utils/validators");
const { sendOTP } = require("../utils/sendOTP");

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      id: admin._id,
      message: "Admin logged in successfully",
      token: generateToken(admin._id, "admin"),
      admin: {
        id: admin._id,
        fullname: admin.fullname,
        email: admin.email,
        phone: admin.phone,
        address: admin.address,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.registerCustomer = async (req, res) => {
  const { fullname, email, phone, address, password } = req.body;

  // Check if all required fields are provided
  if (!fullname || !email || !phone || !address || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate phone number format
  if (!validatePhone(phone)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }

  // Validate password format
  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character",
    });
  }

  const domainValid = await validateDomainMX(email);
  if (!domainValid) {
    return res.status(400).json({ message: "Invalid email domain" });
  }

  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) {
    return res.status(400).json({ message: "Customer already exists" });
  }

  await sendOTP(email, "Customer Email Verification");

  return res.status(200).json({
    message: `An OTP has been sent to ${email}. Please verify it.`,
  });
};

exports.createCustomer = async (req, res) => {
  const { fullname, email, phone, address, password, otp } = req.body;

  // Check if all required fields are provided
  if (!fullname || !email || !phone || !address || !password || !otp) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate phone number format
  if (!validatePhone(phone)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }

  // Validate password format
  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character",
    });
  }

  // Validated email domain exists
  const domainValid = await validateDomainMX(email);
  if (!domainValid) {
    return res.status(400).json({ message: "Invalid email domain" });
  }

  // Check if customer with already exists
  const existingCustomer = await Customer.findOne({ email });
  if (existingCustomer) {
    return res.status(400).json({ message: "Customer already exists" });
  }

  const storedOtp = await OTP.findOne({ email, otp });
  if (!storedOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await OTP.deleteMany({ email }); // Clear the OTP after successful verification

  const newCustomer = new Customer({
    fullname,
    email,
    phone,
    address,
    password,
  });

  await newCustomer.save();

  return res.status(201).json({
    id: newCustomer._id,
    message: "Customer registered successfully",
    customer: {
      id: newCustomer._id,
      fullname: newCustomer.fullname,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address,
    },
    token: generateToken(newCustomer._id, "customer"),
  });
};

exports.loginCustomer = async (req, res) => {};

exports.registerCarOwner = async (req, res) => {};

exports.createCarOwner = async (req, res) => {};

exports.loginCarOwner = async (req, res) => {};

exports.registerDriver = async (req, res) => {};

exports.createDriver = async (req, res) => {};

exports.loginDriver = async (req, res) => {};
