require("dotenv").config();
const User = require("../../models/userModel");
const generator = require("generate-password");
const jwt = require("jsonwebtoken");
const {
  sendUserEmail,
  verficationOption,
  sendSocialPassword,
} = require("../../utils/sendEmail");
const { GenerateToken, verifyToken } = require("../../utils/Tokens");
const logger = require("../../utils/logger");

/**
 * Sign user up using facebook or google login for web application by user information.
 * @async
 * @function signUp
 * @param {Object} userInfo
 * @param {String} socialMediaType
 * @throws {Error} - If user information is not complete
 * @throws {Error} - If could not create new user inside database
 */
async function webSignUp(userInfo, socialMediaType) {
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
      firstName: userInfo.name.givenName,
      lastName: userInfo.name.familyName,
      isVerified: true,
      email: userInfo.emails[0].value,
      password: newPassword,
      userType: socialMediaType,
    };

    // Check the social media type and update the user object accordingly
    if (newUser.userType === "google") {
      newUser.googleId = userInfo.id;
    } else if (newUser.userType === "facebook") {
      newUser.facebookId = userInfo.id;
    }

    // Create a new user in the database
    const user = await User.create(newUser);

    // Log the successful user creation
    logger.info("New user created", { user });

    // Send user email with the new generated password
    await sendUserEmail(user.email, newPassword, sendSocialPassword);

    // Log the successful email sending
    logger.info("Verification email sent to the new user", { user });
  } catch (err) {
    // Log the error message if an error occurs
    logger.error("Error in webSignUp", { error: err });
    console.error(err);
  }
}

module.exports = { webSignUp };
