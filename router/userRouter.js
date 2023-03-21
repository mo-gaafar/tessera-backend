const express = require("express");
const router = express.Router();
const {
  validateUserSignup,
  userVlidation,
} = require("../middlewares/validation/user");
const { signUp, signIn, emailExist } = require("../controller/userController"); // importing methods from controller
//validation
// const check= require('express-validator').check
// const {check}= require('express-validator');

// creating a router
router.post("/signUp", validateUserSignup, userVlidation, signUp);
router.post("/signIn", signIn);
router.post("/emailExist", emailExist);

module.exports = router; //exporting the module in order to use it in other files

// // module.exports=userRouter;
