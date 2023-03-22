require("dotenv").config();
const express = require("express")
const  User = require('../models/userModel')
const Token = require("../models/Token")
const passport = require("passport")
const session=require('express-session')
const bcrypt = require("bcryptjs"); //generating unique strings 
const nodemailer = require("nodemailer")
const {v4: uuidv4 } = require("uuid")
const { urlencoded } = require("express")
const { identity } = require("lodash")
const res = require("express/lib/response")
// require('env-cmd')
require('../passport/passport')(passport)
const router = require('express').Router()
const {google_signin_and_signup,facebook_signin_and_signup}=require('../controller/userController')//importing methods from conroller


// const userCtrl = require('../controller/userController')
// router.post('/facebook_login', userCtrl.facebookLogin)//change endpoint b2a f postman 

//creating router
//facebook sign in using mobile app
router.post('/auth/facebook/app',facebook_signin_and_signup);
//google sign in using mobile app ////http://localhost:3000/user/auth/google/app
router.post('/auth/google/app',google_signin_and_signup);
///////////redirect links
router.get("/googlelogin/failed",(req,res)=>{
  res.status(401).json({
    success: false,
    message: "failure"
  })
})
////incase of success login , return user and return to homepage
router.get("/googlelogin/success",(req,res)=>{//url mazbout??
  if(req.user){
  res.status(200).json({
    success: true,
    message : "successful",
    user:req.user,//get my user 
    //cookies: req.cookies
  })
  console.log("Here is my userrrrrrrr")
  console.log(user)
  
}
})
//facebook redirect links
router.get("/facebooklogin/failed",(req,res)=>{
  res.status(401).json({
    success: false,
    message: "failure"
  })
})
////incase of success login , return user and return to homepage
router.get("/facebooklogin/success",(req,res)=>{//url mazbout??
  if(req.user){
  res.status(200).json({
    success: true,
    message : "successful",
    user:req.user,//get my user 
    //cookies: req.cookies
  })
  console.log("Here is my userrrrrrrr")
  console.log(user)
  
}
})
//end of facebook redirect links
//////////////////////////////////////////////////
/////////////////////Login with FB/GOOGLE/////////
//start of facebook routes
router.get('/auth/facebook', passport.authenticate('facebook', {scope:['profile','email']}),()=>{ //gonna give us profile info such as id and username  //{scope:['profile','email']}
  res.send({hy:"hy"})
})
////redirect to login page                                               
router.get('/auth/facebook/callback',passport.authenticate('facebook', 
{failureMessage:"Sorryyyy faileddddd",//failureRedirect:'/facebooklogin/failed',
successRedirect:"http://localhost:3000"}))//"http://localhost:3000"   ///successRedirect:"facebooklogin/success" ??
//end of facebook routes
router.get('/auth/google', passport.authenticate('google', {scope:['profile','email']}),()=>{ //gonna give us profile info such as id and username  //{scope:['profile','email']}
    res.send({hy:"hy"})
  })
////redirect to login page                                               
router.get('/auth/google/callback',passport.authenticate('google', 
{failureMessage:"Sorryyyy faileddddd",//failureRedirect:'/googlelogin/failed',
successRedirect:"http://localhost:3000"}))//"http://localhost:3000"   ///successRedirect:"googlelogin/success" ??
///////new 
// router.get('auth/google/callback',passport.authenticate('google', 
//     {failureRedirect:'/googlelogin/failed'}),

//     function(req, res) {
//       // Successful authentication, redirect home.
//       console.log("success")
//       res.redirect('/');
//     });
  //redirect pages will be later on implemented by FE


module.exports = router

////old // //Mona Website link Facebook sign in
// //creates a route that will render the signin page.
// var express = require('express');

// var router = express.Router();

// router.get('login/auth/facebook', function(req, res, next) {
//   res.render('index');
// });

// module.exports = router;
// //end Website link Facebook sign in