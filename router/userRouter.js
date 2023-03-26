const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  validateUserSignup,
  userVlidation,
} = require("../middlewares/validation/user");
const userController = require("../controller/userController"); // importing methods from controller
//validation

// creating a router
router.post(
  "/auth/signup",
  validateUserSignup,
  userVlidation,
  userController.signUp
);
router.post("/auth/login", userController.signIn);
router.post("/auth/emailexist", userController.emailExist);

// password reset
router.post("/auth/forgetPassword", userController.forgotPassword);
//router.get("/auth/reset-password/:token", resetPassword); get request to redirect to a frontend link
router.post("/auth/reset-password/:token", userController.resetPassword);

module.exports = router; //exporting the module in order to use it in other files
