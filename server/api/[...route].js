const app = require("../app");
const connectDB = require("../config/db");

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    return res.status(500).json({
      message: "Failed to connect to database",
      error: err.message,
    });
  }

  return app(req, res);
};
