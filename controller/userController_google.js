require("dotenv").config();
const User = require("../models/userModel_google");
const Token = require("../models/Token");
const generator = require("generate-password");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

/**
 * create the transporter for gmail so that we can send email to user.
 */
let transporter = nodemailer.createTransport({
  service: "gmail", //service type
  host: process.env.LOCAL_HOST,
  secure: false,
  auth: {
    //sender gmail information
    user: process.env.AUTH_EMAIL,
    pass: process.env.EMAIL_TEST_APP_PSWD,
  },
});

/**
 * This fucntion does allow user to sign in or sign up to my app using facebook login ,
 * where a body is send from android mobile app once user has logged in to their facebook account 
 * once the body is received , check inside database to see if using user facebook id and email 
 * exists and if so sign user in and respond with token that expires after 24 hrs 
 * and user shall be directed to landing page,else if user does not exist sign user up 
 * using the information provided with post request body {first_name,last_name,email,id} 
 * Also (OPTIONAL)a password that user shall receive using their email
 * using the function we created called setpassword(email,newpassword) 
 * and for that user can sign in directly through the app using email and password
 * and respond with user object.
 * 
 * @param {object} req containing information about the facebook login user (HTTP request that raised the event)
 * @param {object} res  send back the desired HTTP response
 * @param {object} next object with two properties done and value
 * @returns if user ->(token) , if(!user)->(user)
 */
exports.facebook_signin_and_signup = async (req, res, next) => {//for mobile app view
  const userFirstname = req.body.name;
  const userEmail = req.body.email;
  const userFacebook_Id = req.body.id;
  console.log(userFirstname);
  console.log(userEmail);
  console.log(userFacebook_Id);
  var newPassword = generator.generate({
    length: 10,
    numbers: true,
  });
  const newUser = {
    facebookId: userFacebook_Id,
    first_name: userFirstname,
    verified: true,
    email: userEmail,
    password: newPassword,
    social_media_user: true,
  };
  try {
    //checks if user exist first and if so, user shall be directed to landing page
    let user = await User.findOne({
      facebookId: userFacebook_Id,
      email: userEmail,
    });
    if (user) {
      //generate token for the signed in user
      const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET, {
        expiresIn: "24h",
      });
      let newtoken = {
        //create new token
        token: token,
        ownerId: user._id,
        expiredAt: Date.now() + 86400000,
      };
      //save this token along with user id
      newtoken = await Token.create(newtoken);
      return res.status(200).json({
        success: true,
        token,
        //user
      });
    }
    if (!user) {
      //New user is created and user shall be redirected to the landing page
      user = await User.create(newUser); //create new user
      console.log("here is your emailllllllll");
      console.log(userEmail);
      SetPassword(userEmail, newPassword); //set to user the new password
      return res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (err) {
    //error
    console.error(err);
    return res.status(400).json({
      success: false,
      message: "Failed to login or signup user",
    });
  }
};
///end of facebook function for mobile app
/**
 * This fucntion does allow user to sign in or sign up to my app using google login ,
 * where a body is send from android mobilse app once user has logged in to their google account 
 * once the body is received , check inside database to see if using user google id and email 
 * exists and if so sign user in and respond with token that expires after 24 hrs 
 * and user shall be directed to landing page,else if user does not exist sign user up 
 * using the information provided with post request body {first_name,last_name,email,id}
 * Also (OPTIONAL)a password that user shall receive using their email
 * using the function we created called setpassword(email,newpassword) 
 * and for that user can sign in directly through the app using email and password
 * and respond with user object.
 * 
 * @param {object} req containing information about the google login user (HTTP request that raised the event)
 * @param {object} res  send back the desired HTTP response
 * @param {object} next object with two properties done and value
 * @returns if user ->(token) , if(!user)->(user)
 */
exports.google_signin_and_signup = async (req, res, next) => { //for mobile app view
  
  const userFirstname = req.body.name;
  const userEmail = req.body.email;
  const userGoogle_Id = req.body.id;
  console.log(userFirstname);
  console.log(userEmail);
  console.log(userGoogle_Id);
  var newPassword = generator.generate({
    length: 10,
    numbers: true,
  });
  const newUser = {
    googleId: userGoogle_Id,
    first_name: userFirstname,
    verified: true,
    email: userEmail,
    password: newPassword,
    social_media_user: true,
  };
  try {
    //New user is created and user shall be redirected to the landing page
    let user = await User.findOne({
      googleId: userGoogle_Id,
      email: userEmail,
    }); 
    if (user) {
      //generate token for the signed in user
      const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET, {
        expiresIn: "24h", 
      });
      let newtoken = {
        //create new token
        token: token,
        ownerId: user._id,
        expiredAt: Date.now() + 86400000,
      };
      //save this token along with user id
      newtoken = await Token.create(newtoken);
      return res.status(200).json({
        success: true,
        token,
        //user
      });
    }
    if (!user) {
      //New user is created and user shall be directed to sign in
      user = await User.create(newUser); //create new user
      console.log("here is your emailllllllll");
      console.log(userEmail);
      SetPassword(userEmail, newPassword); //set to user the new password
      return res.status(200).json({
        success: true,
        user,
      });
    }
  } catch (err) {
    //error
    console.error(err);
    return res.status(400).json({
      success: false,
      message: "Failed to login or signup user",
    });
  }
};
/**
 * This fucntion shall send the user trying to sign up whether through google or facebook login
 * the newely generated password so that he could and it's an option for the user to sign in 
 * through the app directly. This function supposed to be called inside facebook and google functions.
 * 
 * @param {string} email receiver email with newly generated password
 * @param {string} newPassword newly generated password
 */

const SetPassword = async (email, newPassword) => {
  //delete any existing forgot password requests by the user
  try {
    const mailOptions = {
      //mail information
      from: process.env.AUTH_EMAIL, //sender
      to: email, //receiver
      subject: "Arriving from Google ? ",
      text: `Your generarted password is : ${newPassword}`,
    };

    await transporter.sendMail(mailOptions); //send mail
  } catch (
    e //error
  ) {
    console.log(e);
  }
};