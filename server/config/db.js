const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (
      mongoose.connection.readyState === 1 ||
      mongoose.connection.readyState === 2
    ) {
      return;
    }

    console.log(
      "MONGO_URI in runtime:",
      !!process.env.MONGO_URI ? "PRESENT" : "MISSING"
    );

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error on Vercel:", error.message);
    console.error(error.stack);
  }
};

module.exports = connectDB;

// This function connects to the MongoDB database using Mongoose.
// It reads the connection string from the environment variable MONGO_URI.
