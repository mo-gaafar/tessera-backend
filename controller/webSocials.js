const User = require("../models/userModel");
const webSocials={
signUp: async(userInfo,socialMediaType) => {
    try{
    var newPassword = generator.generate({
        length: 10,
        numbers: true,
    });
    if(socialMediaType==="facebook"){
      //create new user using information retreived from google api
      const newUser = {
        googleId: userInfo.id,
        firstName: userInfo.name.givenName,
        lastName:userInfo.name.familyName,
        isVerified: true,
        email: userInfo.emails[0].value,
        password: newPassword,
        googleUser: true,
      };
    }
      //New user is created and user shall be redirected to the landing page
      user = await User.create(newUser); //create new user
      SetPassword(user.email, newPassword); //set to user the new password
      return res.status(200).json({
        success: true,
        user,
      });
    }catch (err) {
        //error
        console.error(err);
        res.status(400).json({
            success: false,
            message: err.message,
        });
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
        return res.status(200).json({
            success: true,
            token,
            
        });
    }catch (err) {
        //error
        console.error(err);
        res.status(400).json({
            success: false,
            message: err.message,
        });
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
