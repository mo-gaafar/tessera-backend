require("dotenv").config();
const User = require("../../models/userModel");
const generator = require("generate-password");
const {
  sendUserEmail,
  verficationOption,
  sendSocialPassword,
} = require("../../utils/sendEmail");
const { GenerateToken, verifyToken } = require("../../utils/Tokens");

/**
 * Sign user up using facebook or google login for mobile application by user information.
 * @async
 * @function mobileSignUp
 * @param {Object} userInfo - User information object
 * @param {String} socialMediaType - Facebook or Google
 * @param {Object} res - Express response object
 * @returns - Response object with success, user info and token
 * @throws {Error} - If user information is not complete
 * @throws {Error} - If could not create new user inside database
 */
async function mobileSignUp(userInfo, socialMediaType, res) {
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
    const token = await GenerateToken(user._id);
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
}

/**
 * Sign user in using facebook or google login for mobile application by user information.
 * @async
 * @function mobileSignIn
 * @param {Object} existingUser - User information from database
 * @param {Object} res - Express response body
 * @returns  - Response object with success and token
 * @throws {Error} - If user is not found
 */
async function mobileSignIn(existingUser, res) {
  try {
    //generate token for the signed in user
    const token = await GenerateToken(existingUser._id);
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
}

module.exports = { mobileSignUp, mobileSignIn };
