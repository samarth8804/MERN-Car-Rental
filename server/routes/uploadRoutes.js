const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary"); // Import directly from config
const { protect } = require("../middlewares/authMiddleware");

// Test route to check if Cloudinary is correctly configured
router.get("/cloudinary-test", (req, res) => {
  res.json({
    configured: !!process.env.CLOUDINARY_CLOUD_NAME,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKeyConfigured: !!process.env.CLOUDINARY_API_KEY,
  });
});

router.post(
  "/upload-image",
  protect(["carOwner"]),
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Log detailed information about the upload
    console.log("=== CLOUDINARY UPLOAD RESPONSE ===");
    console.log("File:", req.file);
    console.log("URL:", req.file.path);
    console.log("================================");

    // Return the Cloudinary URL
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully to Cloudinary",
      imageUrl: req.file.path,
    });
  }
);

module.exports = router;
