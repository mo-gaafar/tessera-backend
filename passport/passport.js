require("dotenv").config();
const  User = require('../models/userModel')
const  Token = require('../models/Token')
const mongoose = require('mongoose')
const session=require('express-session')
// require('env-cmd')
const generator = require('generate-password')

const nodemailer = require("nodemailer")
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
const jwt=require('jsonwebtoken');
const {v4: uuidv4 } = require("uuid")
const GoogleStrategy = require('passport-google-oauth20').Strategy
//Please be noted that no duplicate emails are allowed 

//configure passport so that we can authenticate user google login
module.exports = function (passport){
    //generate password
    var newPassword = generator.generate({
        length: 10,
        numbers: true
    });
    console.log("Ana gwa passport!!")
    passport.use(new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : 'http://localhost:3000/user/auth/google/callback',
}, async(accessToken, refreshToken , profile , done)=>{
    console.log("Ana m3aya profile.email")
    console.log(profile.emails[0].value)
    //create new user using information retreived from google api
    const newUser = {
        googleId : profile.id,
        first_name: profile.displayName,
        // tag: profile.name.givenName + Math.floor(Math.random() *10000),
        // "profileAvater.url": profile.photos[0].value,
       
        verified:true,
        email:profile.emails[0].value,
        password:newPassword,//. toString() added , remove if cause error
        social_media_user:true
    }

 try {//checks if user exist first and if so, user shall be directed to sign in 
     let user = await User.findOne({ googleId: profile.id })//find user by ID 
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

        done(null,user)//everything is done & return user information
        }
     else{//New user is created and user shall be directed to sign in 
        user = await User.create(newUser)//create new user
        console.log("here is your emailllllllll")
        console.log(user.email)
        SetPassword(user.email,newPassword)//set to user the new password
        
        done(null,user)
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
        
        }
} catch (err) {//error
        console.error(err)
}
}
)
)

passport.serializeUser((user,done)=>{//
    done(null,user.id);
})
//old
// passport.deserializeUser((id,done)=>{//
//      User.findById(id, (err,user)=> done(err,user))
// })
//new methode
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
      done(null, user);
  });
});


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