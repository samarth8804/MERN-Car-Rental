const Driver = require("../models/Driver");
const Bookings = require("../models/Bookings");
const { sendNotifications } = require("../utils/sendNotifications");

exports.deleteDriver = async (req, res) => {
  try {
    const { driverId } = req.params;
    const role = req.role;
    const userId = req.user._id;
    console.log(role);

    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    if (role === "driver" && driver._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this account",
      });
    }

    // Check if the driver has any bookings
    const activeBooking = await Bookings.findOne({
      driverId: driverId,
      isCompleted: false,
      isCancelled: false,
    });

    if (activeBooking) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete driver with active bookings",
      });
    }

    // Delete the driver
    await driver.deleteOne();

    // Optionally, send an email notification to the driver if admin is deleting
    if (role === "admin" && driver.email) {
      await sendNotifications(
        driver.email,
        "Your Account has been Removed by easyGo",
        `<p>Dear ${driver.fullname},</p>
             <p>Your Account with the license number ${driver.licenseNumber} has been removed from our system by an admin.</p>
             <p>If you have any questions, please contact support.</p>
             <p>Thank you for using easyGo!</p>`
      );
    }

    return res.status(200).json({
      success: true,
      message: "Driver deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting driver:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
