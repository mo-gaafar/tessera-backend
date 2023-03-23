require("dotenv").config();
const express = require("express");
const User = require("../models/userModel");
const Token = require("../models/Token");
const passport = require("passport");
const session = require("express-session");
const bcrypt = require("bcryptjs"); //generating unique strings
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const { urlencoded } = require("express");
const { identity } = require("lodash");
const res = require("express/lib/response");
// require('env-cmd')
require("../passport/passport")(passport);
const router = require("express").Router();
const {
  google_signin_and_signup,
  facebook_signin_and_signup,
} = require("../controller/userController"); //importing methods from conroller

//creating router
//post request facebook sign in using mobile app
router.post("/auth/facebook/app", facebook_signin_and_signup);
//post google sign in using mobile app
router.post("/auth/google/app", google_signin_and_signup);
///////////redirect links
router.get("/googlelogin/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});
//incase of success login , return user and return to homepage
router.get("/googlelogin/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user, //get my user
    });
    console.log("Here is my userrrrrrrr");
    console.log(user);
  }
});
//facebook redirect links
router.get("/facebooklogin/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});
//incase of success login , return user and return to landing page
router.get("/facebooklogin/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successful",
      user: req.user, //get my user
    });
    console.log("Here is my userrrrrrrr");
    console.log(user);
  }
});
//end of facebook redirect links
//////////////////////////////////////////////////
/////////////////////Login with FB/GOOGLE/////////
//start of facebook routes
//get request for facebook login for web
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["profile", "email"] }),
  () => {
    //this gives us profile info such as id and username  
    res.send({ hy: "hy" });
  }
);
////redirect to landing page
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureMessage: "Sorryyyy faileddddd", //failureRedirect:'/facebooklogin/failed',
    successRedirect: "http://localhost:3000", //successRedirect:"facebooklogin/success"
  })
);  
//end of facebook routes
//get request for google login for web
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  () => {
    //gonna give us profile info such as id and username  //{scope:['profile','email']}
    res.send({ hy: "hy" });
  }
);
//redirect to landing page
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureMessage: "Sorryyyy faileddddd",
    successRedirect: "http://localhost:3000",
  })
); 

module.exports = router;
