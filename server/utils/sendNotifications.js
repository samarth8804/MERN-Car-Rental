// const nodemailer = require("nodemailer");
const axios = require("axios");

exports.sendNotifications = async (to, subject, html) => {
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
  // await transporter.sendMail({
  //   from: `"easyGo" <${process.env.EMAIL_USER}`,
  //   to,
  //   subject,
  //   html,
  // });
  const payload = {
    sender: {
      email: process.env.BREVO_FROM_EMAIL,
      name: process.env.BREVO_FROM_NAME || "easyGo",
    },
    to: [{ email: to }],
    subject: subject,
    htmlContent: html,
  };

  try {
    await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
  } catch (error) {
    console.error("Error sending notification via Brevo:", error);
    throw new Error("Failed to send notification via Brevo");
  }
};
