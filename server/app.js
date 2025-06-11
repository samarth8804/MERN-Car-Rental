const dotenv = require("dotenv");

const express = require("express");
const connectDB = require("./config/db");

const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to car rental app");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
