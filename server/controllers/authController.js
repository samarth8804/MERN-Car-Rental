const Admin = require("../models/Admin");
const Customer = require("../models/Customer");
const CarOwner = require("../models/CarOwner");
const Driver = require("../models/Driver");
const OTP = require("../models/OTP_Email");
const Cars = require("../models/Cars");
const Booking = require("../models/Bookings");

const generateToken = require("../utils/generateJwtToken");
const {
  validateEmail,
  validatePhone,
  validateDomainMX,
  validatePassword,
  validateLicenseNumber,
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
  });
};

exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if customer exists
    const customer = await Customer.findOne({ email });

    if (!customer || !(await customer.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      id: customer._id,
      message: "Customer logged in successfully",
      token: generateToken(customer._id, "customer"),
      admin: {
        id: customer._id,
        fullname: customer.fullname,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.registerCarOwner = async (req, res) => {
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

  // Check if CarOwner with email already exists
  const existingCarOwner = await CarOwner.findOne({ email });
  if (existingCarOwner) {
    return res.status(400).json({ message: "CarOwner already exists" });
  }

  await sendOTP(email, "CarOwner Email Verification");

  return res.status(200).json({
    message: `An OTP has been sent to ${email}. Please verify it.`,
  });
};

exports.createCarOwner = async (req, res) => {
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
  const existingCarOwner = await CarOwner.findOne({ email });
  if (existingCarOwner) {
    return res.status(400).json({ message: "CarOwner already exists" });
  }

  const storedOtp = await OTP.findOne({ email, otp });
  if (!storedOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await OTP.deleteMany({ email }); // Clear the OTP after successful verification

  const newCarOwner = new CarOwner({
    fullname,
    email,
    phone,
    address,
    password,
  });

  await newCarOwner.save();

  return res.status(201).json({
    id: newCarOwner._id,
    message: "CarOwner registered successfully",
    customer: {
      id: newCarOwner._id,
      fullname: newCarOwner.fullname,
      email: newCarOwner.email,
      phone: newCarOwner.phone,
      address: newCarOwner.address,
    },
  });
};

exports.loginCarOwner = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if carOwner exists
    const carOwner = await CarOwner.findOne({ email });

    if (!carOwner || !(await carOwner.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      id: carOwner._id,
      message: "CarOwner logged in successfully",
      token: generateToken(carOwner._id, "carOwner"),
      admin: {
        id: carOwner._id,
        fullname: carOwner.fullname,
        email: carOwner.email,
        phone: carOwner.phone,
        address: carOwner.address,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.registerDriver = async (req, res) => {
  const { fullname, email, phone, address, password, licenseNumber, city } =
    req.body;

  if (
    !fullname ||
    !email ||
    !phone ||
    !address ||
    !password ||
    !licenseNumber ||
    !city
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!validatePhone(phone)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    });
  }

  // ✅ Simple license validation error message
  if (!validateLicenseNumber(licenseNumber)) {
    return res.status(400).json({
      message: "Invalid license number format",
    });
  }

  const domainValid = await validateDomainMX(email);
  if (!domainValid) {
    return res.status(400).json({ message: "Invalid email domain" });
  }

  const existingDriver = await Driver.findOne({ email });
  if (existingDriver) {
    return res
      .status(400)
      .json({ message: "Driver already exists with this email" });
  }

  const licenseExists = await Driver.findOne({ licenseNumber });
  if (licenseExists) {
    return res.status(400).json({ message: "License number already exists" });
  }

  await sendOTP(email, "Driver Email Verification");

  return res.status(200).json({
    message: `An OTP has been sent to ${email}. Please verify it.`,
  });
};

exports.createDriver = async (req, res) => {
  const {
    fullname,
    email,
    phone,
    address,
    password,
    licenseNumber,
    otp,
    city,
  } = req.body;

  if (
    !fullname ||
    !email ||
    !phone ||
    !address ||
    !password ||
    !licenseNumber ||
    !otp ||
    !city
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!validatePhone(phone)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    });
  }

  // ✅ Simple license validation error message
  if (!validateLicenseNumber(licenseNumber)) {
    return res.status(400).json({
      message: "Invalid license number format",
    });
  }

  const domainValid = await validateDomainMX(email);
  if (!domainValid) {
    return res.status(400).json({ message: "Invalid email domain" });
  }

  const existingDriver = await Driver.findOne({ email });
  if (existingDriver) {
    return res
      .status(400)
      .json({ message: "Driver already exists with this email" });
  }

  const licenseExists = await Driver.findOne({ licenseNumber });
  if (licenseExists) {
    return res.status(400).json({ message: "License number already exists" });
  }

  const storedOtp = await OTP.findOne({ email, otp });
  if (!storedOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await OTP.deleteMany({ email });

  const newDriver = new Driver({
    fullname,
    email,
    phone,
    address,
    password,
    licenseNumber,
    city,
    // status is 'pending' by default
  });

  await newDriver.save();

  return res.status(201).json({
    id: newDriver._id,
    message:
      "Driver registered successfully. Await admin approval before login.",
    driver: {
      id: newDriver._id,
      fullname: newDriver.fullname,
      email: newDriver.email,
      phone: newDriver.phone,
      address: newDriver.address,
      licenseNumber: newDriver.licenseNumber,
      city: newDriver.city,
      status: newDriver.status,
    },
  });
};

exports.loginDriver = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if driver exists
    const driver = await Driver.findOne({ email });

    if (!driver || !(await driver.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Check if driver is approved by admin
    if (driver.status !== "approved") {
      if (driver.status === "pending") {
        return res.status(403).json({
          message:
            "Your account is pending admin approval. Please wait for approval before logging in.",
          status: "pending",
        });
      } else if (driver.status === "rejected") {
        return res.status(403).json({
          message:
            "Your account has been rejected by admin. Please contact support for more information.",
          status: "rejected",
        });
      } else {
        return res.status(403).json({
          message:
            "Your account is not approved for login. Please contact admin.",
          status: driver.status,
        });
      }
    }

    // ✅ Only allow login if driver is approved
    return res.status(200).json({
      id: driver._id,
      message: "Driver logged in successfully",
      token: generateToken(driver._id, "driver"),
      driver: {
        id: driver._id,
        fullname: driver.fullname,
        email: driver.email,
        phone: driver.phone,
        address: driver.address,
        licenseNumber: driver.licenseNumber,
        status: driver.status,
        rating: driver.rating,
        totalRides: driver.totalRides,
        earnings: driver.earnings,
        city: driver.city,
        ratingCount: driver.ratingCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.role;

    let profileData = null;

    switch (role) {
      case "admin":
        const admin = await Admin.findById(userId).select("-password");
        if (!admin) {
          return res.status(404).json({
            success: false,
            message: "Admin profile not found",
          });
        }

        profileData = {
          _id: admin._id,
          fullname: admin.fullname,
          email: admin.email,
          phone: admin.phone,
          address: admin.address,
          role: "admin",
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
        };
        break;

      case "customer":
        const customer = await Customer.findById(userId).select("-password");
        if (!customer) {
          return res.status(404).json({
            success: false,
            message: "Customer profile not found",
          });
        }

        profileData = {
          _id: customer._id,
          fullname: customer.fullname,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          role: "customer",
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        };
        break;

      case "carOwner":
        const carOwner = await CarOwner.findById(userId).select("-password");
        if (!carOwner) {
          return res.status(404).json({
            success: false,
            message: "Car owner profile not found",
          });
        }

        // Get car statistics for car owner
        const ownerCars = await Cars.find({ ownerId: userId });
        const totalCars = ownerCars.length;
        const approvedCars = ownerCars.filter(
          (car) => car.status === "approved"
        ).length;
        const totalRides = ownerCars.reduce(
          (sum, car) => sum + (car.totalRides || 0),
          0
        );
        const avgRating =
          ownerCars.length > 0
            ? (
                ownerCars.reduce((sum, car) => sum + (car.rating || 0), 0) /
                ownerCars.length
              ).toFixed(1)
            : 0;

        profileData = {
          _id: carOwner._id,
          fullname: carOwner.fullname,
          email: carOwner.email,
          phone: carOwner.phone,
          address: carOwner.address,
          role: "carOwner",
          // Car owner specific stats
          totalCars,
          approvedCars,
          totalRides,
          avgRating: parseFloat(avgRating),
          createdAt: carOwner.createdAt,
          updatedAt: carOwner.updatedAt,
        };
        break;

      case "driver":
        const driver = await Driver.findById(userId).select("-password");
        if (!driver) {
          return res.status(404).json({
            success: false,
            message: "Driver profile not found",
          });
        }

        profileData = {
          _id: driver._id,
          fullname: driver.fullname,
          email: driver.email,
          phone: driver.phone,
          address: driver.address,
          role: "driver",
          // Driver specific fields
          licenseNumber: driver.licenseNumber,
          city: driver.city,
          status: driver.status,
          rating: parseFloat(driver.rating) || 0,
          ratingCount: driver.ratingCount || 0,
          totalRides: driver.totalRides || 0,
          earnings: driver.earnings || 0,
          approvedBy: driver.approvedBy,
          createdAt: driver.createdAt,
          updatedAt: driver.updatedAt,
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid user role",
        });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: profileData,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
