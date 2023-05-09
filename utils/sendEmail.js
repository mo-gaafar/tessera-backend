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
async function sendUserEmail(email, token, option, qrcode = null) {
  try {
    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    let mailOptions;
    if (qrcode) {
      mailOptions = option(email, token, qrcode);
    } else {
      mailOptions = option(email, token);
    }
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
function orderBookedOption(email, order, qrCode) {
  const mailOptions = {
    from: process.env.EMAIL_USER, //sender
    // to: "mohamednasser2001@gmail.com", //receiver
    to: email,
    // to: "abdullahsaeedd6@gmail.com",
    subject: "Your order has been booked",
    attachments: [
      {
        content: Buffer.from(qrCode, "base64"),
        contentType: "image/png",
      },
    ],
    html: ` 

    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <title>Order Confirmation</title>
    </head>
    <body style="font-family: sans-serif; background-color: #F05537;">
    <div style="padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 2px 10px rgba(0,0,0,0.2); padding: 20px;">
    <img src="https://www.imgbly.com/ib/Nh2mfWScmW.png" alt="Tessera" width="200">
    <h1 style="font-size: 28px; margin-bottom: 0;">Order Confirmation</h1>
          <p style="font-size: 16px; margin-top: 0;">Thank you ${
            order.firstName
          } for your purchase!</p>
    
          <hr style="border: none; border-bottom: 1px solid #eee;">
    
          <h2 style="font-size: 24px; margin-top: 0;">Order Details</h2>
          <p style="font-size: 19px; margin-top: 0;">Order ID: ${
            order.orderId
          }</p>
     
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #eee;">
            <tr>
            <th style="text-align: left; padding: 10px;">Event Name:</th>
              <td style="text-align: right; padding: 10px;">${
                order.eventBasicInfo.eventName
              }</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 10px;">Date:</th>
              <td style="text-align: right; padding: 10px;">${
                order.eventBasicInfo.startDateTime
              }</td>
            </tr>
            <tr>
            <th style="text-align: left; padding: 10px;">Location:</th>
            <td style="text-align: right; padding: 10px;">${
              order.locationString
            }</td>
          </tr>
          <tr>
          <th style="text-align: left; padding: 10px;">Catagory:</th>
          <td style="text-align: right; padding: 10px;">${
            order.eventBasicInfo.categories
          }</td>
        </tr>
        <tr>
        <th style="text-align: left; padding: 10px;">Order Total Price:</th>
        <td style="text-align: right; padding: 10px;">$${
          order.totalOrderPrice
        }</td>
      </tr>
      
    </table>

            <hr style="border: none; border-bottom: 1px solid #eee;">

            <h2 style="font-size: 24px; margin-top: 0;">Tickets</h2>
            
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #eee;">
              <tr>
                <th style="text-align: left; padding: 10px;">Ticket Type</th>
                <th style="text-align: left; padding: 10px;">Quantity</th>
                <th style="text-align: right; padding: 10px;">Total Price </th>
              </tr>
              ${order.ticketTierSelectedArray
                .map(
                  (ticketTier) => `
              <tr>
                <td style="text-align: left; padding: 10px;">${
                  ticketTier.tierName
                }</td>
                <td style="text-align: left; padding: 10px;">${
                  ticketTier.quantity
                }</td>
                <td style="text-align: right; padding: 10px;">$${ticketTier.totalPrice.toFixed(
                  2
                )}</td>
              </tr>
              `
                )
                .join("")}
            </table>
            
          <hr style="border: none; border-bottom: 1px solid #eee;">

       
    
          <p style="font-size: 17px; font-weight: bold;">Thank you for your purchase! We look forward to seeing you at the event.</p>
    
          <p style="font-size: 14px; color: #999;">This email was sent to [${
            order.firstName
          }] because you recently made a purchase on our website.</p>
        </div>
      </div>
    </body>
    </html>


    `,
  };
  return mailOptions;
}

function addAttendeeOption(email, order, qrCode) {
  const mailOptions = {
    from: process.env.EMAIL_USER, //sender
    // to: "mohamednasser2001@gmail.com", //receiver
    to: email,
    // to: "tessera.backend@gmail.com",
    // to: "abdullahsaeedd6@gmail.com",
    subject: "Your order has been booked",
    attachments: [
      {
        content: Buffer.from(qrCode, "base64"),
        contentType: "image/png",
      },
    ],
    html: ` 
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invitation to Event</title>
    </head>
    <body style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
      <div style="text-align: center;">
        <img src="https://i.postimg.cc/0Nv1F9CP/Logo-Full-Text.png" alt="Tessera" style="max-width: 500px;">
      </div>
      <p style="font-size: 20px;">Hello, ${order.attendeesInformation[0].name}</p>
      <p style="font-size: 20px;">You have been invited to an event by ${order.buyerContactInformation.name}. The event details are as follows:</p>
      <ul>
        <li style="font-size: 18px;">Event Name: ${order.eventBasicInfo.eventName}</li>
        <li style="font-size: 18px;">Date: ${order.eventBasicInfo.eventDate}</li>
        <li style="font-size: 18px;">Location:${order.eventBasicInfo.eventLocation}</li>
      </ul>
      
      <p style="font-size: 20px;">The ticket details are as follows:</p>
      <ul>
        <li style="font-size: 18px;">Ticket Type: ${order.attendeesInformation[0].tierName}</li>
        <li style="font-size: 18px;">price: ${order.attendeesInformation[0].price}</li>
        <li style="font-size: 18px;">Quantity: 1 </li>
      </ul>
      
       
      <p style="font-size: 20px;">Thank you,</p>
     
    </body>
    </html>
    

    `,
  };
  return mailOptions;
}

function addAttendeeBuyerOption(email, order, qrCode) {
  const mailOptions = {
    from: process.env.EMAIL_USER, //sender
    to: email,
    // to: "tessera.backend@gmail.com",
    // to: "abdullahsaeedd6@gmail.com",
    subject: "Your order has been booked",
    attachments: [
      {
        content: Buffer.from(qrCode, "base64"),
        contentType: "image/png",
      },
    ],
    html: ` 
   
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <title>Order Confirmation</title>
    </head>
    <body style="font-family: sans-serif; background-color: #F05537;">
    <div style="padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 2px 10px rgba(0,0,0,0.2); padding: 20px;">
    <img src="https://www.imgbly.com/ib/Nh2mfWScmW.png" alt="Tessera" width="200">
    <h1 style="font-size: 28px; margin-bottom: 0;">Order Confirmation</h1>
          <p style="font-size: 16px; margin-top: 0;">Thank you ${
            order.buyerContactInformation.name
          } for your purchase!</p>
    
          <hr style="border: none; border-bottom: 1px solid #eee;">
    
          <h2 style="font-size: 24px; margin-top: 0;">Order Details</h2>
          <p style="font-size: 19px; margin-top: 0;">Order ID: ${
            order.eventBasicInfo.orderId
          }</p>
     
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #eee;">
            <tr>
            <th style="text-align: left; padding: 10px;">Event Name:</th>
              <td style="text-align: right; padding: 10px;">${
                order.eventBasicInfo.eventName
              }</td>
            </tr>
            <tr>
              <th style="text-align: left; padding: 10px;">Date:</th>
              <td style="text-align: right; padding: 10px;">${
                order.eventBasicInfo.eventDate
              }</td>
            </tr>
            <tr>
            <th style="text-align: left; padding: 10px;">Location:</th>
            <td style="text-align: right; padding: 10px;">${
              order.eventBasicInfo.eventLocation
            }</td>
          </tr>
        <tr>
        <th style="text-align: left; padding: 10px;">Order Total Price:</th>
        <td style="text-align: right; padding: 10px;">$${
          order.totalOrderPrice
        }</td>
      </tr>
      
    </table>

            <hr style="border: none; border-bottom: 1px solid #eee;">

            <h2 style="font-size: 24px; margin-top: 0;">Tickets</h2>
            
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #eee;">
              <tr>
              <th style="text-align: left; padding: 10px;">Attendee Name </th>
                <th style="text-align: left; padding: 10px;">Ticket Type</th>
                <th style="text-align: left; padding: 10px;">Quantity</th>
                <th style="text-align: right; padding: 10px;">Total Price </th>
              </tr>
              ${order.attendeesArray
                .map(
                  (attendee) => `
              <tr>
                <td style="text-align: left; padding: 10px;">${
                  attendee.name
                }</td>
                <td style="text-align: left; padding: 10px;">${
                  attendee.tierName
                }</td>
                <td style="text-align: left; padding: 10px;"> 1 </td>
                <td style="text-align: right; padding: 10px;">$${attendee.price.toFixed(
                  2
                )}</td>
              </tr>
              `
                )
                .join("")}
            </table>
            
          <hr style="border: none; border-bottom: 1px solid #eee;">

       
    
          <p style="font-size: 17px; font-weight: bold;">Thank you for your purchase! We look forward to seeing you at the event.</p>
    
          <p style="font-size: 14px; color: #999;">This email was sent to [${
            order.buyerContactInformation.name
          }] because you recently made a purchase on our website.</p>
        </div>
      </div>
    </body>
    </html>

    

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
  addAttendeeOption,
  addAttendeeBuyerOption,
};
