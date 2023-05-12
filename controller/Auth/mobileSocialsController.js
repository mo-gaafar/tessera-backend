require("dotenv").config();
const User = require("../../models/userModel");
const generator = require("generate-password");
const {
  sendUserEmail,
  verficationOption,
  sendSocialPassword,
} = require("../../utils/sendEmail");
const { GenerateToken, verifyToken } = require("../../utils/Tokens");
const logger = require("../../utils/logger");

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
      uppercase: true,
      symbols: true,
      excludeSimilarCharacters: true,
    });

    // Log the generated password
    logger.info("Generated password for new user", { password: newPassword });

    // Create user object with the provided information
    const newUser = {
      firstName: userInfo.firstname,
      lastName: userInfo.lastname,
      isVerified: true,
      email: userInfo.email,
      password: newPassword,
      userType: socialMediaType,
    };

    // Check the social media type and update the user object accordingly
    if (newUser.userType === "facebook") {
      newUser.facebookId = userInfo.id;
    } else if (newUser.userType === "google") {
      newUser.googleId = userInfo.id;
    }

    // Create a new user in the database
    const user = await User.create(newUser);

    // Log the successful user creation
    logger.info("New user created", { user });

    // Generate token for the signed-in user
    const token = await GenerateToken(user._id);

    // Log the successful token generation
    logger.info("Token generated for the user", { user, token });

    // Send user email with the new generated password
    await sendUserEmail(userInfo.email, newPassword, sendSocialPassword);

    // Log the successful email sending
    logger.info("Verification email sent to the new user", { user });

    return res.status(200).json({
      success: true,
      user,
      token,
    });
  } catch (err) {
    // Log the error message if an error occurs
    logger.error("Error in mobileSignUp", { error: err });
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
    // Generate token for the signed-in user
    const token = await GenerateToken(existingUser._id);

    // Log the successful token generation
    logger.info("Token generated for the user", { user: existingUser, token });

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    // Log the error message if an error occurs
    logger.error("Error in mobileSignIn", { error: err });
    console.error(err);
    return res.status(400).json({
      success: false,
      message: "Failed to login or signup user",
    });
  }
}

module.exports = { mobileSignUp, mobileSignIn };
