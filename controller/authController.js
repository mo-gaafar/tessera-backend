const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email already registered",
      });
    }

    // Create user
    const user = new User({ name, email, password });

    // Generate verification token
    const token = crypto.randomBytes(20).toString("hex");
    user.token = token;

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "yourgmail@gmail.com",
        pass: "yourgmailpassword",
      },
    });
    const mailOptions = {
      from: "yourgmail@gmail.com",
      to: email,
      subject: "Email Verification",
      text: `Please click on the following link to verify your email: http://localhost:5000/api/auth/verify/${token}`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "error",
          message: "Failed to send verification email",
        });
      }
      console.log(info);
    });

    // Save user to database
    await user.save();

    res.status(201).json({
      status: "success",
      message: "User created, please verify your email",
    });
  } catch (err) {
    next(err);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const token = req.params.token;

    // Find user by token
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid verification link",
      });
    }

    // Update user's isVerified flag and remove token
    user.isVerified = true;
    user.token = undefined;

    // Save user to database
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Email verified",
    });
  } catch (err) {
    next(err);
  }
};
