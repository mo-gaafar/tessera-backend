const nodemailer = require("nodemailer");

async function sendVerificationEmail(email, token) {
  try {
    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Create email message
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Please verify your email address",
      html: `
        <p>Hello!</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${process.env.BASE_URL}/verify-email?token=${token}">Verify Email</a>
        <p>Here's a picture of a cat for you:</p>
        <img src="https://cataas.com/cat" alt="A cat">
      `,
    };

    // Send email message
    await transporter.sendMail(mailOptions);

    console.log(`Email verification sent to ${email}`);
  } catch (err) {
    console.error(err);
  }
}

module.exports = { sendVerificationEmail };
