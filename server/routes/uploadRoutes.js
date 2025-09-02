const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/uploadMiddleware");
const { protect } = require("../middlewares/authMiddleware");

router.post(
  "/upload-image",
  protect(["carOwner"]),
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Cloudinary provides secure URL in req.file.path
    const imageUrl = req.file.path;

    console.log("Cloudinary image uploaded:", imageUrl);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
    });
  }
);

module.exports = router;
