const User = require("../models/userModel");
const facebook={
signUp: async(userInfo) => {
    try{
    //generate password
    var newPassword = generator.generate({
        length: 10,
        numbers: true,
    });
    const newUser = {
        googleId: userInfo.id,
        firstName: userInfo.displayName, //first name as display name
        isVerified: true,
        email: userInfo.emails[0].value,
        password: newPassword,
        socialMedia: true,
        };
    user = await User.create(newUser); //create new user
    SetPassword(user.email, newPassword); //set to user the new password
    
    }catch (err) {
        //error
        console.error(err);
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
}
,signIn: async(existingUser) =>{
    try{
        const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.SECRETJWT,
            {
              expiresIn: "24h",
            }
        );
        return res.status(200).json({
            success: true,
            token,
            //existingUser
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




module.exports = facebook