require("dotenv").config();
const User = require("../models/userModel_google");
const Token = require("../models/Token");
const mongoose = require("mongoose");
const session = require("express-session");
const generator = require("generate-password");

const nodemailer = require("nodemailer");
//create the transporter part so that we can send email
let transporter = nodemailer.createTransport({
  service: "gmail", //service type
  host: process.env.LOCAL_HOST,
  secure: false,
  auth: {
    //sender gmail information
    user: process.env.AUTH_EMAIL,
    pass: process.env.EMAIL_TEST_APP_PSWD,
  },
});
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
//Please be noted that no duplicate emails are allowed

//configure passport so that we can authenticate user google login.
module.exports = function (passport){
//generate password
var newPassword = generator.generate({
  length: 10,
  numbers: true,
});
console.log("Ana gwa passport!!");
//start of facebook function
/**
 * this fucntion configures and registers the FacebookStrategy and a window shall open upon get request 
 * allowing user to login with facebook .After successful login with facebook account, 
 * user shall be redirected to the landing page.Note that once logged in with facebook account,
 * user information is received  and checked  using facebook id and email 
 * and if user exists inside my application database , user shall be given a token that expires after 24 hrs,
 * but in case user information received and checked using facebook id and email  and user not found, 
 * then user shall be created inside database and also given as an option a password that user shall receive using their email
 * using the function we created called setpassword(email,newpassword) 
 * and for that user can sign in directly through the app using email and password(OPTIONAL)
 * 
 * (About the function features):FacebookStrategy constructor must include a clientID and clientSecret,
 *  the values of which are set to the app ID and secret that were obtained
 *  when registering your application. Also a callbackURL will redirect users 
 * to this location after they have authenticated.The verify function accepts an accessToken, refreshToken and profile 
 * as arguments. accessToken and refreshToken are used for API access, and are not needed for authentication.
 *  profile is a normalized profile containing information provided by Facebook about the user who is signing in.
 */
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/user/auth/facebook/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Ana m3aya profile.email");
      console.log(profile.emails[0].value);
      //create new user using information retreived from facebook api
      const newUser = {
        facebookId: profile.id,
        first_name: profile.displayName,//first name as display name 
        verified: true,
        email: profile.emails[0].value,
        password: newPassword,
        social_media_user: true,
      };

      try {
        //checks if user exist first and if so, user shall be directed to sign in
        let user = await User.findOne({ facebookId: profile.id }); //find user by ID
        if (user) {
          //generate token for the signed in user
          const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.SECRET,
            {
              expiresIn: "24h",
            }
          );
          let newtoken = {
            //create new token
            token: token,
            ownerId: user._id,
            expiredAt: Date.now() + 86400000,
          };
          //save this token along with user id 
          newtoken = await Token.create(newtoken);
          console.log("Signing in user using facebook")
          done(null, user); //everything is done & return user information
        } else {
          //New user is created and user shall be redirected to the landing page
          user = await User.create(newUser); //create new user
          console.log("here is your emailllllllll");
          console.log(user.email);
          setPassword(user.email, newPassword); //set to user the new password
            console.log("signing up user using facebook ")
          done(null, user);
        }
      } catch (err) {
        //error
        console.error(err);
      }
    }
  )
);
//end of facebook function
//start of google function
/**
 * this fucntion configures and registers the GoogleStrategy and a window shall open upon get request 
 * allowing user to login with google .After successful login with google account, 
 * user shall be redirected to the landing page.Note that once logged in with google account,
 * user information is received  and checked  using google id and email 
 * and if user exists inside my application database , user shall be given a token that expires after 24 hrs,
 * but in case user information received and checked using google id and email  and user not found, 
 * then user shall be created inside database and also given as an option a password that user shall receive using their email
 * using the function we created called setpassword(email,newpassword) 
 * and for that user can sign in directly through the app using email and password(OPTIONAL)
 * 
 * (About the function features):GoogleStrategy constructor must include a clientID and clientSecret,
 *  the values of which are set to the app ID and secret that were obtained
 *  when registering your application. Also a callbackURL will redirect users 
 * to this location after they have authenticated.The verify function accepts an accessToken, refreshToken and profile 
 * as arguments. accessToken and refreshToken are used for API access, and are not needed for authentication.
 *  profile is a normalized profile containing information provided by Google about the user who is signing in.
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Ana m3aya profile.email");
      console.log(profile.emails[0].value);
      //create new user using information retreived from facebook api
      const newUser = {
        googleId: profile.id,
        first_name: profile.displayName,//first name as display name
        verified: true,
        email: profile.emails[0].value,
        password: newPassword,
        social_media_user: true,
      };

      try {
        //checks if user exist first and if so, user shall be directed to sign in
        let user = await User.findOne({ googleId: profile.id }); //find user by ID
        if (user) {
          // console.log("signing in user using google ")
          //generate token for the signed in user
          const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.SECRET,
            {
              expiresIn: "24h",
            }
          );
          let newtoken = {
            //create new token
            token: token,
            ownerId: user._id,
            expiredAt: Date.now() + 86400000,
          };
          //save this token along with user id 
          newtoken = await Token.create(newtoken);

          done(null, user); //everything is done & return user information
        } else {
          //New user is created and user shall be redirected to the landing page
          user = await User.create(newUser); //create new user
          console.log("here is your emailllllllll");
          console.log(user.email);
          setPassword(user.email, newPassword); //set to user the new password
          console.log("signing up user using google ")
          done(null, user);
        }
      } catch (err) {
        //error
        console.error(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  //
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

}
//Definition of SetPassword function & mail for user to receive password through it
const setPassword = async (email, newPassword) => {
  //delete any existing forgot password requests by the user
  try {
    const mailOptions = {
      //mail information
      from: process.env.AUTH_EMAIL, //sender
      to: email, //receiver
      subject: "Arriving from Google ? ",
      text: `Your generarted password is : ${newPassword}`,
    };

    await transporter.sendMail(mailOptions); //send mail
  } catch (
    e //error
  ) {
    console.log(e);
  }
};