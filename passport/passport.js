require("dotenv").config();
const User = require("../models/userModel");
const mongoose = require("mongoose");
const session = require("express-session");
const generator = require("generate-password");
const nodemailer = require("nodemailer");
// const facebook = require('../controller/facebook')
const webSocials = require("../controller/webSocials");

const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
//Please be noted that no duplicate emails are allowed

//configure passport so that we can authenticate user google login.
module.exports = function (passport) {
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
        callbackURL: process.env.BASE_URL+"/auth/facebook/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        //create new user using information retreived from facebook api

        try {
          const socialMediaType="facebook";
          //checks if user exist first and if so, user shall be directed to sign in
          let user = await User.findOne({ facebookId: profile.id }); //find user by ID
          if (user) {
            //call sign in function 
            facebook.signIn(user)
            console.log("Signing in user using facebook");
            done(null, user); //everything is done & return user information
          } else {
            facebook.signUp(profile,socialMediaType)
      
            console.log("signing up user using facebook ");
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
        callbackURL: process.env.BASE_URL+"/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {       
        try {
          const socialMediaType="google";
          //checks if user exist first and if so, user shall be directed to sign in
          let user = await User.findOne({ googleId: profile.id }); //find user by ID
          if (user) {
            webSocials.signIn(user);
            console.log("signing in user using google");
            done(null, user); //everything is done & return user information
          } else {
            webSocials.signUp(profile,socialMediaType);
            console.log("signing up user using google ");
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
};

