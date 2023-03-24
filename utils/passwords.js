// const securePassword = require("secure-password");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

async function passwordEncryption(userPassword) {
  try {
    // Generate verification token
    const encryptedPassword = jwt.sign(userPassword, process.env.SECRETJWT);
    console.log("password = " + encryptedPassword);
    // const password = jwt.verify(encryptedPassword, process.env.SECRETJWT);
    // console.log("password = " + password);
    return encryptedPassword;
  } catch (error) {
    console.log(error);
  }
}

async function comparePassword(userStoredPassword, userPassword) {
  try {
    const encryptedPassword = jwt.sign(userPassword, process.env.SECRETJWT);
    console.log("password stored = " + userStoredPassword);
    // const user = await userModel.findOne({ email });

    if (encryptedPassword == userStoredPassword) {
      console.log("password = " + encryptedPassword);
      // console.log("user password = " + user.password);
      return true;
    } else {
      console.log("password = " + encryptedPassword);
      // console.log("user password = " + user.password);
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { passwordEncryption, comparePassword };
