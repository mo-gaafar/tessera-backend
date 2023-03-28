require("dotenv").config();
const User = require("../../models/userModel");
const generator = require("generate-password");
const jwt = require("jsonwebtoken");
const {
  sendUserEmail,
  verficationOption,
  sendSocialPassword,
} = require("../../utils/sendEmail");
const webSocials = {
  /**
   * Sign user up using facebook or google login for web application by user information.
   * @async
   * @function signUp
   * @param {Object} userInfo
   * @param {String} socialMediaType
   * @throws {Error} - If user information is not complete
   * @throws {Error} - If could not create new user inside database
   */
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
      //send user email with new generated password
      await sendUserEmail(user.email, newPassword, sendSocialPassword);
    } catch (err) {
      //error
      console.error(err);
    }
  },
  /**
   * Sign user in using facebook or google login for web application by user information.
   * @async
   * @function signIn
   * @param {Object} existingUser - User information from database
   * @throws {Error} -If user is not found
   */
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
