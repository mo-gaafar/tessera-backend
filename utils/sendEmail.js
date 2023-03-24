const nodemailer = require("nodemailer");

/**
 * create the transporter for gmail so that we can send email to user.
 */
async function sendUserEmail(email, token, option) {
  try {
    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = option(email, token);

    // Send email message
    await transporter.sendMail(mailOptions);

     console.log(`Email verification sent to ${email}`);
  } catch (err) {
    console.error(err);
  }
}

function verficationOption(email, token) {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Please verify your email address",
    html: `
      <p style="font-size: 20px;">Hello! </p>
      <p style="font-size: 20px;">Please click the button below to verify your email address:</p>
      <button style="background-color: #F05537; color: white; padding: 10px 20px; border: none; border-radius: 4px;">
      <a href="${process.env.BASE_URL}/auth/isverify/${token}" style="text-decoration: none; color: inherit;">Verify Email</a>
        </button>
        <img src="https://i.postimg.cc/0Nv1F9CP/Logo-Full-Text.png" alt="Tessera"> `,
  };

  return mailOptions;
}

function forgetPasswordOption(email, token) {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Please verify your email address",
    html: `
      <p style="font-size: 20px;">Hello! </p>
      <p style="font-size: 20px;">Please click the button below to reset your password:</p>
      <button style="background-color: #F05537; color: white; padding: 10px 20px; border: none; border-radius: 4px;">
      <a href="${process.env.BASE_URL}/auth/reset-password/${token}" style="text-decoration: none; color: inherit;">Reset Password</a>
        </button>
        <img src="https://i.postimg.cc/0Nv1F9CP/Logo-Full-Text.png" alt="Tessera"> `,
  };
  return mailOptions;
}

function sendSocialPassword(email, newPassword) {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS, //sender
    to: email, //receiver
    subject: "Arriving from Google ? ",
    // text: `Your generarted password is : ${newPassword}`,
    html: `
    <p style="font-size: 20px;">Hello! </p>
    <p style="font-size: 20px;">Your generarted password is : ${newPassword}</p>
    <img src="https://i.postimg.cc/0Nv1F9CP/Logo-Full-Text.png" alt="Tessera"> `,
  };
  return mailOptions;
}

module.exports = {
  sendUserEmail,
  verficationOption,
  forgetPasswordOption,
  sendSocialPassword,
};