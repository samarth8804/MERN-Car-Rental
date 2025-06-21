const nodemailer = require("nodemailer");

exports.sendNotifications = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Car Rental App" <${process.env.EMAIL_USER}`,
    to,
    subject,
    html,
  });
};
