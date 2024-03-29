const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const bcrypt = require("bcryptjs");
const securePassword = require("secure-password");

const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");

// this function contains configurations for sending email function
////////////////////////////////////////////////////////////////////////////////////////
const passwordEncryption = async (password) => {
  const pwd = securePassword();
  const orginalPassword = Buffer.from(password);
  //const encryptedPassword = await pwd.hash(orginalPassword);
  //console.log(encryptedPassword);
  const hash = await pwd.hash(orginalPassword);

  const encryptedMatch = await pwd.verify(orginalPassword, hash);

  //Test cases to make sure encrypted Password matches the original

  switch (encryptedMatch) {
    case securePassword.INVALID_UNRECOGNIZED_HASH:
      return console.error(
        "This hash was not made with secure-password. Attempt legacy algorithm"
      );
    case securePassword.INVALID:
      return console.log("Invalid password");
    case securePassword.VALID:
      return console.log(encryptedMatch); //authenticated
    case securePassword.VALID_NEEDS_REHASH:
      console.log("Yay you made it, wait for us to improve your safety");

      break;

    //return hash.toString("base64");
  }
};
////////////////////////////////////////////////////////////////////////////////////////////

// this function uses the userID to find the user who forgot password
exports.resetPassword = async (req, res) => {
  try {
    //abdullah use_token here instead of email
    const email = req.body.email;
    const user = await userModel.findOne({ email: email });

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
        data: userSearchById,
      });
    } else {
      res.status(400).send({ success: true, msg: "this link is expired" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

// this function Sends an Reset Email to The user who wants to change Reset Password
exports.forgotpassword = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await userModel.findOne({ email: email });
    if (user) {
      //Generate Random Token for User
      const randomString = randomstring.generate();

      // sends the reset email to user
      sendResetPasswordMail(user.first_name, email, randomString);
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
