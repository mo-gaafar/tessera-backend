const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const { sendUserEmail, forgetPasswordOption } = require("../utils/sendEmail");
const { passwordEncryption, comparePassword } = require("../utils/passwords");
const { GenerateToken, verifyToken } = require("../utils/Tokens");

/* 
This function will create a new user in the database
*/
exports.signUp = async (req, res, next) => {
  //getting user email
  const { email } = req.body;
  const { emailConfirmation } = req.body;

  const userExist = await userModel.findOne({ email }); // checking if email already exists

  //email found
  if (userExist) {
    return res.status(200).json({
      sucess: false,
      message: "Email already exists",
    });
  }
  // email does not match email confirmation entered
  if (email != emailConfirmation) {
    return res.status(200).json({
      sucess: false,
      message: "Email address does not match the above",
    });
  }

  // creating new user
  try {
    const user = await userModel.create(req.body);
    res.status(201).json({
      sucess: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
This function will allow the user to sign in if they
entered their 
and password correctly and will
generate token to the user

*/
exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body; // getting email and password
    //prompting to user  if email or password are left blank
    if (!email || !password) {
      return res.status(200).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email }); // finding user email
    // user email not found
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    // check whether the user is verified or NO
    if (!user.isVerified) {
      return res.status(200).json({
        success: false,
        message: "Please verify your email address",
      });
    }
    // compare the given password with the encrypted password in the database
    const isMatched = await comparePassword(user.password, password);

    // password not mathced
    if (!isMatched) {
      return res.status(200).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = await GenerateToken(user._id); //generate user token
    console.log(token);

    res.status(200).json({
      success: true,
      token,
      //user
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Cannot login, check your credentials",
    });
  }
};

/*
This function will check if the email entered by the user 
already exists 
*/
exports.emailExist = async (req, res, next) => {
  const { email } = req.body;

  const userExist = await userModel.findOne({ email }); // checking if email already exists

  //email found
  if (userExist) {
    return res.status(200).json({
      exist: true,
    });
  } else
    res.status(200).json({
      exist: false,
    });
};

// this function Sends an Reset Email to The user who wants to change Reset Password
exports.forgotpassword = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await userModel.findOne({ email: email });

    if (user) {
      // Generate verification token for user
      const token = jwt.sign({ userId: user._id }, process.env.SECRETJWT, {
        expiresIn: "1d",
      });

      await sendUserEmail(email, token, forgetPasswordOption);

      res.status(200).send({
        success: true,
        msg: "please check your mail inbox and reset password",
      });
    } else {
      res.status(200).send({ success: true, msg: "this email doesnt exist" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

// this function uses the userID to find the user who forgot password
exports.resetPassword = async (req, res) => {
  try {
    //abdullah use_token here instead of email
    // const email = req.body.email;
    const token = req.params.token;

    // Verify token
    const decoded = jwt.verify(token, process.env.SECRETJWT);

    console.log("decoded " + decoded);
    console.log("decoded.userId " + decoded.userId);
    const user = await userModel.findById(decoded.userId);

    // const user = await userModel.findOne({ email: email });

    if (user) {
      const password = req.body.password;
      // password Encryption
      let encryptedPassword = await passwordEncryption(password);
      // Updates the user Password in MongoDB database
      const userSearchById = await userModel.findByIdAndUpdate(
        { _id: user._id },
        { $set: { password: encryptedPassword, token: "" } },
        { new: true }
      );
      res.status(200).send({
        success: true,
        msg: "User password has been reset",
      });
    } else {
      res.status(200).send({ success: true, msg: "this link is expired" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};
