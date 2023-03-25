require("dotenv").config();
const User = require("../models/userModel");
const generator = require("generate-password");
const jwt = require("jsonwebtoken");
const {
  sendUserEmail,
  verficationOption,
  sendSocialPassword,
} = require("../utils/sendEmail");
const webSocials={
signUp: async(userInfo,socialMediaType) => {
    try{
    var newPassword = generator.generate({
        length: 10,
        numbers: true,
    });
    const newUser = {
        firstName: userInfo.name.givenName,
        lastName:userInfo.name.familyName,
        isVerified: true,
        email: userInfo.emails[0].value,
        password: newPassword,
        userType:socialMediaType,
      };
    if(newUser.userType==="google"){
      //create new user using information retreived from google api
      newUser.googleId=userInfo.id
    }
    else if(newUser.userType==="facebook"){
      //create new user using information retreived from google api
     
        newUser.facebookId=userInfo.id
    }
      //New user is created and user shall be redirected to the landing page
      const user = await User.create(newUser); //create new user
      SetPassword(user.email, newPassword); //set to user the new password
    }catch (err) {
        //error
        console.error(err);
        
    }
}
,signIn: async(existingUser)=>{
    try{
        const token = jwt.sign(
            { _id: existingUser._id.toString() },
            process.env.SECRETJWT,
            {
              expiresIn: "24h",
            }
        );
    }catch (err) {
        //error
        console.error(err);
    }
}
}
//Definition of SetPassword function & mail for user to receive password through it
const SetPassword = async (email, newPassword) => {
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
module.exports=webSocials