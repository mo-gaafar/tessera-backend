const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  validateUserSignup,
  userVlidation,
} = require("../middlewares/validation/user");
const {
  signUp,
  signIn,
  emailExist,
  forgotpassword,
  resetPassword,
} = require("../controller/userController"); // importing methods from controller
//validation

// creating a router
router.post("/auth/signup", validateUserSignup, userVlidation, signUp);
router.post("/auth/login", signIn);
router.post("/auth/emailexist", emailExist);

// password reset
router.post("/auth/forgetPassword", forgotpassword);
//router.get("/auth/reset-password/:token", resetPassword); get request to redirect to a frontend link
router.post("/auth/reset-password/:token", resetPassword);

module.exports = router; //exporting the module in order to use it in other files
