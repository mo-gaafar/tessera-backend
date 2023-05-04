const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * Sends a verification email to a user
 * @async
 * @function sendUserEmail
 * @param {string} email - The email address of the user to send the email to
 * @param {string} token - The verification token to include in the email
 * @param {Function} option - The function to generate the email options
 * @returns {object}  - return the user's email if the email sent
 * @throws {Error} If an error occurs while sending the email
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

    console.log(`Email sent to ${email}`);
  } catch (err) {
    console.error(err);
    throw new Error("Error sending email");
  }
}

function verficationOption(email, token) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
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
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Please verify your email address",
    html: `
      <p style="font-size: 20px;">Hello! </p>
      <p style="font-size: 20px;">Please click the button below to reset your password:</p>
      <button style="background-color: #F05537; color: white; padding: 10px 20px; border: none; border-radius: 4px;">
      <a href="https://www.tessera.social/forgetPassword/:${token}" style="text-decoration: none; color: inherit;">Reset Password</a>
        </button>
        <img src="https://i.postimg.cc/0Nv1F9CP/Logo-Full-Text.png" alt="Tessera"> `,
  };
  return mailOptions;
}

function sendSocialPassword(email, newPassword) {
  const mailOptions = {
    from: process.env.EMAIL_USER, //sender
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

// make a function to return the order booked by attendee
function orderBookedOption(email, order) {
  console.log("🚀 ~ file: sendEmail.js:86 ~ orderBookedOption ~ order:", order);
  console.log(
    "🚀 ~ file: sendEmail.js:86 ~ orderBookedOption ~ order.ticketTierSelectedArray.totalPrice:",
    order.ticketTierSelectedArray[1].totalPrice
  );

  const mailOptions = {
    from: process.env.EMAIL_USER, //sender
    to: email, //receiver
    subject: "Your order has been booked",
    // calcalute the price after promocode from order
    html: `
    <p style="font-size: 20px;">Hello! </p>
    <p style="font-size: 20px;">Your order has been booked</p>
    <p style="font-size: 20px;">Your order details : </p>
    <p style="font-size: 20px;">Event Name : ${order.eventBasicInfo[1].eventName}</p>
    <p style="font-size: 20px;">Event Date & Time : ${order.eventBasicInfo[1].eventStartTime}</p>
    <p style="font-size: 20px;">Event Location : ${order.eventBasicInfo[1].location}</p>
    <p style="font-size: 20px;">Ticket Type : ${order.ticketTierSelectedArray.quantity} x ${order.ticketTierSelectedArray.tierName}</p>
    <p style="font-size: 20px;">Total Price : ${order.ticketTierSelectedArray.totalPrice}</p>
    <img src="https://i.postimg.cc/0Nv1F9CP/Logo-Full-Text.png" alt="Tessera">

    `,
  };
  return mailOptions;
}

module.exports = {
  sendUserEmail,
  verficationOption,
  forgetPasswordOption,
  sendSocialPassword,
  orderBookedOption,
};
