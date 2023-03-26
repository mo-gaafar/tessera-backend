const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const {
  sendUserEmail,
  verficationOption,
  sendSocialPassword,
} = require("../utils/sendEmail");
const { GenerateToken, verifyToken } = require("../utils/Tokens");
/**
 * Resends the email verification to the user with the given email address.
 *
 * @async
 * @function resendEmailVerification
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 * @returns {object} - A response object with information about whether the email verification has sent again or no
 * @throws {Error} If there is an internal server error.
 * @throws {Error} If the user is not found.
 */
async function resendEmailVerification(req, res) {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // If user is not found, return error message
    if (!user) {
      return res
        .status(400)
        .json({ success: "false", message: "User not found" });
    }
    // If the user has already been verified, return a 400 error
    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: "false", message: "User has already been verified" });
    }
    // Generate verification token
    const token = jwt.sign({ userId: user._id }, process.env.SECRETJWT, {
      expiresIn: "1d",
    });

    // Send verification email
    await sendUserEmail(email, token, verficationOption);

    // Return success message
    res.json({ success: "true", message: "Verification email sent" });
  } catch (err) {
    console.error(err);
    // Return error message
    res
      .status(500)
      .json({ success: "false", message: "Internal server error" });
    throw err;
  }
}

/**
 * Sends a verification email to the user with the given email address.
 *
 * @async
 * @function sendVerification
 * @param {string} email - The email address of the user to send the verification email to.
 * @returns {Object} - Returns a JSON object with a message indicating the verification email status.
 * @throws {Error} If there is an internal server error.
 *
 * @example
 * const verificationResult = await sendVerification('example@example.com');
 */
async function sendVerification(email) {
  try {
    // Find user by email
    const user = await User.findOne({ email });

    // If user is not found, return error message
    if (!user) {
      return { success: "false", message: "User not found" };
    }

    // Generate verification token
    const token = jwt.sign({ userId: user._id }, process.env.SECRETJWT, {
      expiresIn: "1d",
    });

    // Send verification email
    await sendUserEmail(email, token, verficationOption);

    // Return success message
    return { success: "true", message: "Verification email sent" };
  } catch (err) {
    console.error(err);
    // Return error message
    return { success: "false", message: "Internal server error" };
  }
}

/**
 * Verify user email using the verification token
 * @async
 * @function verifyEmail
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object.
 * @param {string} req.params.token - The verification token.
 * @returns {Object} - Returns a  JSON object with a message indicating the verification status.
 *
 * @throws {Error} - Throws an error if there is an internal server error.
 * @throws {Error} 404 error if user is not found
 * @throws {Error} 400 error if user has already been verified
 * @throws {Error} 500 error for internal server error
 *
 *
 */
async function verifyEmail(req, res) {
  try {
    // Get the verification token from the request parameters
    const token = req.params.token;

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRETJWT);

    // Find the user with the decoded user ID
    const user = await User.findById(decoded.userId);

    // If the user is not found, return a 404 error
    if (!user) {
      return res
        .status(404)
        .json({ success: "false", message: "User not found" });
    }

    // If the user has already been verified, return a 400 error
    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: "false", message: "User has already been verified" });
    }

    // Set the user as verified and clear the verification token
    user.isVerified = true;
    user.verificationToken = undefined;

    // Save the user
    await user.save();

    // Return a 200 status code and a success message
    res
      .status(200)
      .json(
        { success: "true", message: "Email address verified" },
        token,
        user
      );
  } catch (err) {
    console.error(err);
    // Return a 500 error if there is an internal server error
    res
      .status(500)
      .json({ success: "false", message: "Internal server error" });
  }
}

module.exports = { sendVerification, verifyEmail, resendEmailVerification };
