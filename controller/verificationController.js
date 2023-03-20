// controllers/verificationController.js

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { sendUserEmail } = require("../utils/sendEmail");

async function sendVerification(req, res) {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    // console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate verification token
    const token = jwt.sign({ userId: user._id }, process.env.SECRETJWT, {
      expiresIn: "1d",
    });
    // console.log(token);

    // Save verification token to user
    user.verificationToken = token;
    await user.save();
    // console.log(user.verificationToken);
    console.log("user toke = " + user.verificationToken);
    console.log("user id = " + user._id);
    // Send verification email
    await sendUserEmail(email, token, "verifications");

    res.json({ message: "Verification email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function verifyEmail(req, res) {
  try {
    console.log("yaraaaaaaab");
    const token = req.params.token;
    // const { token } = req.param;
    console.log("token = " + token);

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRETJWT);
    console.log("decoded" + decoded);
    console.log("decoded user id= " + decoded.userId);

    // Find user by decoded user ID
    const user = await User.findById(decoded.userId);
    console.log("verfication id= " + user.verificationToken);
    // console.log(user);
    // Responses Status
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has already been verified
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "User has already been verified" });
    }

    // Verify token matches user's verification token
    if (user.verificationToken !== token) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    // Set user as verified and clear verification token
    console.log("hiiiii");
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email address verified" }, token);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { sendVerification, verifyEmail };
