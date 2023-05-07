require("dotenv").config();
const User = require("../models/userModel");
const mongoose = require("mongoose");
const session = require("express-session");
const generator = require("generate-password");
const nodemailer = require("nodemailer");
const { webSignUp } = require("../controller/Auth/webSocialsController");

const jwt = require("jsonwebtoken");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
//Please be noted that no duplicate emails are allowed
//configure passport so that we can authenticate user google login.
module.exports = function (passport) {
  /**
   * Allows mobile app user to sign in or sign up to my app using facebook login using user information.
   */
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: process.env.BASE_URL + "/auth/facebook/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        //create new user using information retreived from facebook api

        try {
          if (!profile) {
            throw new Error(
              "User profile information was not provided from passport"
            );
          }
          const socialMediaType = "facebook";
          //checks if user exist first and if so, user shall be directed to sign in
          let user = await User.findOne({ email: profile.emails[0].value }); //find user by ID
          if (user) {
            console.log("Signing in user using facebook");
            done(null, user); //everything is done & return user information
          } else {
            webSignUp(profile, socialMediaType);

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
  /**
   * Allows mobile app user to sign in or sign up to my app using google login using user information.
   */
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.BASE_URL + "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          if (!profile) {
            throw new Error(
              "User profile information was not provided from passport"
            );
          }
          const socialMediaType = "google";
          //checks if user exist first and if so, user shall be directed to sign in
          let user = await User.findOne({ email: profile.emails[0].value }); //find user by ID
          if (user) {
            console.log("signing in user using google");
            done(null, user); //everything is done & return user information
          } else {
            webSignUp(profile, socialMediaType);
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
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });
};
