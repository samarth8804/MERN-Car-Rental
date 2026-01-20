const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB : ", err);
    // process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;

// This function connects to the MongoDB database using Mongoose.
// It reads the connection string from the environment variable MONGO_URI.
