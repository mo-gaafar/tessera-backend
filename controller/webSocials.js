require("dotenv").config();
const User = require("../models/userModel");
const generator = require("generate-password");
const jwt = require("jsonwebtoken");
const {
  sendUserEmail,
  verficationOption,
  sendSocialPassword,
} = require("../utils/sendEmail");
const webSocials = {
  signUp: async (userInfo, socialMediaType) => {
    try {
      var newPassword = generator.generate({
        length: 10,
        numbers: true,
      });
      // create user
      const newUser = {
        firstName: userInfo.name.givenName,
        lastName: userInfo.name.familyName,
        isVerified: true,
        email: userInfo.emails[0].value,
        password: newPassword,
        userType: socialMediaType,
      };
      if (newUser.userType === "google") {
        //create new user using information retreived from google api
        newUser.googleId = userInfo.id;
      } else if (newUser.userType === "facebook") {
        //create new user using information retreived from google api
        // await sendUserEmail(user.email, newPassword, sendSocialPassword);
        newUser.facebookId = userInfo.id;
      }
      //New user is created and user shall be redirected to the landing page
      const user = await User.create(newUser); //create new user
      await sendUserEmail(user.email, newPassword, sendSocialPassword);
    } catch (err) {
      //error
      console.error(err);
    }
  },
  signIn: async (existingUser) => {
    try {
      const token = jwt.sign(
        { _id: existingUser._id.toString() },
        process.env.SECRETJWT,
        {
          expiresIn: "24h",
        }
      );
    } catch (err) {
      //error
      console.error(err);
    }
  },
};

module.exports = webSocials;
