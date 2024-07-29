const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., Gmail, Yahoo, etc.
  auth: {
    user: "pranavtartey21@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

module.exports = { transporter };
