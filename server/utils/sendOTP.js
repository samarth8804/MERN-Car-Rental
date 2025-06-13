const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOTP = async (toEmail, subject, otp) => {
  const templatePath = path.join(__dirname, "../templates/otpEmail.html");
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
  // Replace the placeholder with the actual OTP
  htmlTemplate = htmlTemplate.replace("{{OTP}}", otp);

  const mailOptions = {
    from: `"Car Rental App " <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: htmlTemplate,
  };

  return transporter
    .sendMail(mailOptions)
    .then(() => {
      console.log("OTP sent successfully");
    })
    .catch((error) => {
      console.error("Error sending OTP:", error);
      throw new Error("Failed to send OTP");
    });
};
