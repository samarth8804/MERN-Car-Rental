const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { protect } = require("../middlewares/authMiddleware");

// Route to handle image upload

router.post(
  "/upload-image",
  protect(["carOwner"]),
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Return the file path or any other information you need
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
    });
  }
);

module.exports = router;
