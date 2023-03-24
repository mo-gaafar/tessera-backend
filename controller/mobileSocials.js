const User = require("../models/userModel");
const mobileSocials = require('../controller/mobileSocials')
const {
  sendUserEmail,
  verficationOption,
  sendSocialPassword,
} = require("../utils/sendEmail");
const mobileSocials={
signUp: async(userInfo,socialMediaType) => {

    try{

        const userFirstName = userInfo.firstname;
        const userLastName = userInfo.lastname;
        const userEmail = userInfo.email;
        if(socialMediaType==="facebook"){
            const userFacebook_Id = userInfo.id;
            const newUser = {
                facebookId: userFacebook_Id,
                firstName: userFirstName,
                lastName:userLastName,
                isVerified: true,
                email: userEmail,
                password: newPassword,
                SocialMediaType:socialMediaType
            };
        }
        else if(socialMediaType==="google"){
            const userGoogle_Id = userInfo.id;
            const newUser = {
                googleId: userGoogle_Id,
                firstName: userFirstName,
                lastName:userLastName,
                isVerified: true,
                email: userEmail,
                password: newPassword,
                SocialMediaType:socialMediaType
              };             
        }       
        var newPassword = generator.generate({
            length: 10,
            numbers: true,
        });
        //New user is created and user shall be directed to sign in
        user = await User.create(newUser); //create new user
        // setPassword(userEmail, newPassword); //set to user the new password
        await sendUserEmail(userEmail, newPassword, sendSocialPassword);

        return res.status(200).json({
            success: true,
            user,
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
,signIn: async(existingUser) => {
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
          //user
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