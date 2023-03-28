require("dotenv").config();
const User = require("../models/userModel");
const generator = require("generate-password");
const jwt = require("jsonwebtoken");
const {
  sendUserEmail,
  verficationOption,
  sendSocialPassword,
} = require("../utils/sendEmail");
const mobileSocials = {
/**
 * Sign user up using facebook or google login for mobile application by user information.
 * @async
 * @function signUp
 * @param {Object} userInfo - User information object
 * @param {String} socialMediaType - Facebook or Google
 * @param {Object} res - Express response object
 * @returns - Response object with success, user info and token
 * @throws {Error} - If user information is not complete
 * @throws {Error} - If could not create new user inside database
 */
  signUp: async (userInfo, socialMediaType, res) => {
    try {
      var newPassword = generator.generate({
        length: 10,
        numbers: true,
      });

      const newUser = {
        firstName: userInfo.firstname,
        lastName: userInfo.lastname,
        isVerified: true,
        email: userInfo.email,
        password: newPassword,
        userType: socialMediaType,
      };
      if (newUser.userType === "facebook") {
        // const userFacebook_Id = userInfo.id;
        newUser.facebookId = userInfo.id;
      } else if (newUser.userType === "google") {
        // const userGoogle_Id = userInfo.id;
        newUser.googleId = userInfo.id;
      }

      //New user is created and user shall be directed to sign in
      const user = await User.create(newUser); //create new user
      //generate token for the signed in user
      const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.SECRETJWT,
        {
          expiresIn: "24h",
        }
      );
      //send user email with new generated password
      await sendUserEmail(userInfo.email, newPassword, sendSocialPassword);
      return res.status(200).json({
        success: true,
        user,
        token,
      });
    } catch (err) {
      //error
      console.error(err);
      return res.status(400).json({
        success: false,
        message: "Failed to login or signup user",
      });
    }
  },
/**
 * Sign user in using facebook or google login for mobile application by user information.
 * @async
 * @function signIn
 * @param {Object} existingUser - User information from database
 * @param {Object} res - Express response body
 * @returns  - Response object with success and token
 * @throws {Error} - If user is not found
 */
  signIn: async (existingUser, res) => {
    try {
      //generate token for the signed in user
      const token = jwt.sign(
        { _id: existingUser._id.toString() },
        process.env.SECRETJWT,
        {
          expiresIn: "24h",
        }
      );
      return res.status(200).json({
        success: true,
        token,
      });
    } catch (err) {
      //error
      console.error(err);
      return res.status(400).json({
        success: false,
        message: "Failed to login or signup user",
      });
    }
  },
};

module.exports = mobileSocials;
