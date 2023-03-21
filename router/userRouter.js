const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {validateUserSignup,userVlidation} = require("../middlewares/validation/user");
const { signUp, signIn, emailExist,	forgotpassword,resetPassword } = require("../controller/userController"); // importing methods from controller
//validation


// creating a router
router.post("/auth/signup/", validateUserSignup, userVlidation, signUp);
router.post("/auth/login", signIn);
router.post("/auth/emailexist", emailExist);


//validation

module.exports = router; //exporting the module in order to use it in other files

