const OTP = require("../models/OTP_Email");
const dotenv = require("dotenv");
const { generateOTP } = require("./generateOTP");
axios = require("axios");

dotenv.config();

const fs = require("fs");
const path = require("path");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // use TLS
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   connectionTimeout: 10000, // 10 seconds
// });

exports.sendOTP = async (toEmail, subject) => {
  const otp = generateOTP();

  await OTP.deleteMany({ email: toEmail }); // Clear any existing OTPs for this email

  await OTP.create({
    email: toEmail,
    otp: otp,
  });

  const templatePath = path.join(__dirname, "../templates/otpEmail.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  // Replace the placeholder with the actual OTP
  htmlTemplate = htmlTemplate.replace("{{OTP}}", otp);

  // const mailOptions = {
  //   from: `"easyGo " <${process.env.EMAIL_USER}>`,
  //   to: toEmail,
  //   subject: subject,
  //   html: htmlTemplate,
  // };

  // return transporter
  //   .sendMail(mailOptions)
  //   .then(() => {
  //     console.log("OTP sent successfully");
  //   })
  //   .catch((error) => {
  //     console.error("Error sending OTP:", error);
  //     throw new Error("Failed to send OTP");
  //   });

  const payload = {
    sender: {
      email: process.env.BREVO_FROM_EMAIL,
      name: process.env.BREVO_FROM_NAME || "easyGo",
    },
    to: [
      {
        email: toEmail,
      },
    ],
    subject,
    htmlContent: htmlTemplate,
  };

  try {
    await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    console.log("OTP sent successfully via Brevo");
  } catch (error) {
    console.error("Error sending OTP via Brevo:", error);
    throw new Error("Failed to send OTP via Brevo");
  }
};
