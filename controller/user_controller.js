const nodemailer = require("nodemailer");

// The transporter object will be used to send the emails in the signup function
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});
