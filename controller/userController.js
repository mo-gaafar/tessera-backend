require("dotenv").config();
const  User = require('../models/userModel')
const Token = require("../models/Token")
const generator = require('generate-password')
const nodemailer = require("nodemailer")
const jwt=require('jsonwebtoken');
//create the transporter part so that we can send email
let transporter = nodemailer.createTransport({
    service:"gmail",//service type
    host:process.env.LOCAL_HOST,
    secure:false,
    auth:{//sender gmail information
      user: process.env.AUTH_EMAIL,
      pass: process.env.EMAIL_TEST_APP_PSWD,
    }
})
//for mobile app view
exports.google_signin_and_signup=async (req,res,next)=>{
//    const {userFirstname, userEmail, userGoogle_Id } = req.body;
   const userFirstname=req.body.name
   const userEmail=req.body.email
   const userGoogle_Id=req.body.id
   console.log(userFirstname)
   console.log(userEmail)
   console.log(userGoogle_Id)
   var newPassword = generator.generate({
    length: 10,
    numbers: true
   });
   const newUser = {
    googleId : userGoogle_Id,
    first_name: userFirstname,
    // tag: profile.name.givenName + Math.floor(Math.random() *10000),
    // "profileAvater.url": profile.photos[0].value,
   
    verified:true,
    email:userEmail,
    password:newPassword,//. toString() added , remove if cause error
    social_media_user:true
   }
   try {//checks if user exist first and if so, user shall be directed to sign in 
    let user = await User.findOne({googleId:userGoogle_Id,email:userEmail})//({email:userEmail})//find user by ID // email: userEmail
    if (user){
       //user info. saved inside of this
       const token=jwt.sign({_id:user._id.toString()},process.env.SECRET,{

           expiresIn: '24h' // expires in 365 days
     
        })
        let newtoken = {//create new token
            token : token,
            ownerId: user._id,
            expiredAt: Date.now() + 86400000
        }
        newtoken = await Token.create(newtoken) 
        return res.status(200).json({
            success: true,
            token,
            //user
          });
       
    }
    if(!user){//New user is created and user shall be directed to sign in 
       user = await User.create(newUser)//create new user
       console.log("here is your emailllllllll")
       console.log(userEmail)
       SetPassword(userEmail,newPassword)//set to user the new password
       
      
   //     const token=jwt.sign({_id:user._id.toString()},process.env.SECRET,{

   //         expiresIn: '24h' // expires in 365 days
     
   //    })
   //      // creates a new user if not found and gives him a unique password
   //     let newtoken = {
   //         token : token,
   //         ownerId: user._id,
   //         expiredAt: Date.now() + 86400000
   //     }
   //     newtoken = await Token.create(newtoken)
       
       //user.generateAuthToken();
    return res.status(200).json({
        success: true,
        // userFirstname,
        // userEmail, 
        // userGoogle_Id ,
        user
      });

    }
    } catch (err) {//error
       console.error(err);
       return res.status(400).json({
        success:false,
        message:"Failed to login or signup user"
       })
    }


}


//Definition of SetPassword function & mail for user to receive password through it
const SetPassword = async (email,newPassword)=>{
   
    //delete any existing forgot password requests by the user 
    try{

  const mailOptions = { //mail information
    from : process.env.AUTH_EMAIL,//sender 
    to: email,//receiver
    subject : "Arriving from Google ? ",
    text: `Your generarted password is : ${newPassword}`
    }
    
      await transporter.sendMail(mailOptions)//send mail
    }
     catch(e) //error
    {
      console.log(e);
    }
}