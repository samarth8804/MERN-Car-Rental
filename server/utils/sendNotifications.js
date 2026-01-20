const nodemailer = require("nodemailer");

exports.sendNotifications = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000, // 10 seconds
  });

  await transporter.sendMail({
    from: `"easyGo" <${process.env.EMAIL_USER}`,
    to,
    subject,
    html,
  });
};
