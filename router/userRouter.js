require("dotenv").config();
const express = require("express")
const  User = require('../models/userModel')
const Token = require("../models/Token")
const passport = require("passport")
const session=require('express-session')
const bcrypt = require("bcryptjs"); //generating unique strings 
const nodemailer = require("nodemailer")
const res = require("express/lib/response")
require('../passport/passport')(passport)
const router = require('express').Router()
const {google_signin_and_signup}=require('../controller/userController')//importing methods from conroller

//creating router
//Google sign in using mobile app ////http://localhost:3000/user/auth/google/app
router.post('/auth/google/app',google_signin_and_signup);

///////////redirect links
router.get("/googlelogin/failed",(req,res)=>{
  res.status(401).json({
    success: false,
    message: "failure"
  })
})
////incase of success login , return user and return to homepage
router.get("/googlelogin/success",(req,res)=>{
  if(req.user){
  res.status(200).json({
    success: true,
    message : "successful",
    user:req.user,//get my user 
  })
  console.log("Here is my userrrrrrrr")
  console.log(user)
  
}
})
//////////////////////////////////////////////////
/////////////////////Login with FB/GOOGLE/////////

router.get('/auth/google', passport.authenticate('google', {scope:['profile','email']}),()=>{ //gonna give us profile info such as id and username  //{scope:['profile','email']}
    res.send({hy:"hy"})
  })
////redirect to login page                                               
router.get('/auth/google/callback',passport.authenticate('google', 
{failureMessage:"Sorryyyy faileddddd",//failureRedirect:'/googlelogin/failed',
successRedirect:"http://localhost:3000"}))//"http://localhost:3000"   ///successRedirect:"googlelogin/success" ??



module.exports = router

