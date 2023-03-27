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
 * Allows mobile app user to sign in or sign up to my app using facebook login using user information.
 * 
 * @async
 * @function facebookLogin
 * @param {object} req -Information about the google login user
 * @param {object} res -Send back the desired HTTP response
 * @param {object} next -Object with two properties done and value
 * @returns if user ->(token) , if(!user)->(user)
 * @throws {Error} - If could not get user information
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
 * Allows mobile app user to sign in or sign up to my app using google login using user information.
 * @async
 * @function googleLogin
 * @param {object} req -Information about the google login user
 * @param {object} res  - Send back the desired HTTP response
 * @param {object} next - Object with two properties done and value
 * @returns if user ->(token) , if(!user)->(user)
 * @throws {Error} - If could not get user information
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


