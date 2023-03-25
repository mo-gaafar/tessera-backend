require("dotenv").config();
const User = require("../models/userModel");
const generator = require("generate-password");
const jwt = require("jsonwebtoken");
const {
  sendUserEmail,
  verficationOption,
  sendSocialPassword,
} = require("../utils/sendEmail");
const mobileSocials={
signUp: async(userInfo,socialMediaType,res) => {

    try{
        var newPassword = generator.generate({
            length: 10,
            numbers: true,
        });
        const userFirstName = userInfo.firstname;
        const userLastName = userInfo.lastname;
        const userEmail = userInfo.email;
        const userId=userInfo.id;
        const newUser = {
            firstName: userFirstName,
            lastName:userLastName,
            isVerified: true,
            email: userEmail,
            password: newPassword,
            userType: socialMediaType
        };
        if(newUser.userType==="facebook"){
             // const userFacebook_Id = userInfo.id;            
            newUser.facebookId=userId;
        }
        else if(newUser.userType==="google"){
            // const userGoogle_Id = userInfo.id;
            newUser.googleId=userId;      
        }       
        
        //New user is created and user shall be directed to sign in
        user = await User.create(newUser); //create new user
        //generate token for the signed in user
        const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.SECRETJWT,
            {
              expiresIn: "24h",
            }
        );
        // setPassword(userEmail, newPassword); //set to user the new password
        await sendUserEmail(userEmail, newPassword, sendSocialPassword);
        return res.status(200).json({
            success: true,
            user,
            token
            
        });
        
        

    }catch (err) {
        //error
        console.error(err);
        return res.status(400).json({
            success: false,
            message: "Failed to login or signup user",
        });
    }
}
,signIn: async(existingUser,res) => {
    try{
        //generate token for the signed in user
        const token = jwt.sign(
          { _id: existingUser._id.toString() },
          process.env.SECRETJWT,
          {
            expiresIn: "24h",
          }
        );
        return res.status(200).json({
            success: true,
            token,
        });
    }catch (err) {
        //error
        console.error(err);
        return res.status(400).json({
            success: false,
            message: "Failed to login or signup user",
        });
    }
}
}

module.exports=mobileSocials;