require("dotenv").config();
const User = require("../models/userModel");
const generator = require("generate-password");
const jwt = require("jsonwebtoken");
const {
  sendUserEmail,
  verficationOption,
  sendSocialPassword,
} = require("../utils/sendEmail");
const mobileSocials = require("./mobileSocials");


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
exports.facebookLogin = async (req, res, next) => {
  //for mobile app view
  const socialMediaType="facebook";
  const userInfo=req.body;
  const userFacebook_Id=userInfo.id;
  const userEmail=userInfo.email;
  try {
    //checks if user exist first and if so, user shall be directed to landing page
    let user = await User.findOne({
      facebookId: userFacebook_Id,
      email: userEmail,
    });
    if (user) {
      //generate token for the signed in user
      mobileSocials.signIn(user,res);
      console.log("signing user in using facebook mobile app view");
    }
    if (!user) {
      mobileSocials.signUp(userInfo,socialMediaType,res);
      console.log("signing user up using facebook mobile app view");
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
exports.googleLogin = async (req, res, next) => {
  //for mobile app view

  const socialMediaType="google";
  const userInfo=req.body;
  userGoogle_Id=userInfo.id;
  userEmail=userInfo.email;

  try {
    //New user is created and user shall be redirected to the landing page
    let user = await User.findOne({
      googleId: userGoogle_Id,
      email: userEmail,
    });
    if (user) {
      mobileSocials.signIn(user,res);
      console.log("signing user in using google");
      
    }
    if (!user) {
      mobileSocials.signUp(userInfo,socialMediaType,res);
      console.log("signing user up using google");
      
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

const setPassword = async (email, newPassword) => {
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
