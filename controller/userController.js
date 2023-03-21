const nodemailer= require('nodemailer');
const randomstring= require("randomstring");
const bcrypt= require('bcryptjs');
const securePassword = require('secure-password')


const jwt=require("jsonwebtoken");
const { validationResult } = require("express-validator");
const userModel = require("../models/userModel")
// const validationResult=

// this function contains configurations for sending email function
const sendResetPasswordMail =async(name,email,token)=>{

   
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:process.env.emailUser,
                pass:process.env.emailPassword
            }
            
        });

        const mailOption = {
            from:process.env.emailUser,
            to:"mercol9858@gmail.com",
            subject:'for reset Password',
            html: '<p> Hey, please copy link <a href= "http://localhost:3000/api/auth/reset-password?token='+token+'"> and reset your password </a>'

        }
        transporter.sendMail(mailOption,function(error,info){

            if(error)
            {
                console.log(error);
            }
            else
            {
                console.log("mail has been sent",info.response);
            }

        });
}


/*const mailgun = require("mailgun-js");
const { config } = require("dotenv");

const DOMAIN = 'sandbox045c852723954a91bec45b6804631714.mailgun.org';
const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});

*/
exports.signup = async (req,res,next) =>{
    //validation

    //validation
    const {email} =req.body;
    const {email_confirmation}=req.body
    // const { first_name,last_name,email,email_confirmation,password}= req.body

    const userExist=await userModel.findOne({email});

    if (userExist){
       return res.status(400).json({
        sucess:false,
        message:"Email already exists"
       }
       )
    } 

    if (email!=email_confirmation){
        return res.status(400).json({
            sucess:false,
            message:"Email address does not match the above"
           }
           )
    }


     try {
        const user= await userModel.create(req.body);
        res.status(201).json(
           {
            sucess:true,
            user
           }

        )

    } catch (error) {
        console.log(error);
        res.status(400).json(
            {
                success:false,
                message:error.message
            }
        )
    }

}

exports.signin = async (req,res,next) =>{

try {
    const {email,password}= req.body;
    if (!email || !password){
        return res.status(400).json(
            {
                success:false,
                message:"Email and password are required"
            }
        )
        }

        const user= await   userModel.findOne({email});
        if (!user){
            return res.status(400).json({
             success:false,
             message:"Invalid Email or Password"


            })
          
        }

    const isMatch= await user.comparePassword(password);
    if (!isMatch){
        return res.status(400).json({
            success:false,
            message:"Invalid Email or Password"
           })
    }
    const token= await user.GenerateToken();
    
    res.status(200).json(
       {
        success:true,
        //token
        user

       }
    )




} catch (error) {
    console.log(error);
    return res.status(400).json({
        success:false,
        message:"Cannot login, check your credentials"


       })


}








}
// this function uses the userID to find the user who forgot password
exports.resetPassword = async(req,res)=>{
    try {
        
      

        //abdullah use_token here instead of email
        const email = req.body.email;
        const usrData = await userModel.findOne({email:email});
      
        if(usrData)
        {
            const password = req.body.password;

            

           // password Encryption
            const pwd = securePassword();
            const userPassword = Buffer.from(password);
            const newPassword= await pwd.hash(userPassword);
            const hash = await pwd.hash(userPassword)

            const result = await pwd.verify(userPassword, hash)

            //Test cases to make sure encrypted Password matches the original
  
            switch (result) {
                case securePassword.INVALID_UNRECOGNIZED_HASH:
                return console.error('This hash was not made with secure-password. Attempt legacy algorithm')
                case securePassword.INVALID:
                return console.log('Invalid password')
                case securePassword.VALID:
                return console.log('Authenticated')
                case securePassword.VALID_NEEDS_REHASH:
                console.log('Yay you made it, wait for us to improve your safety')
            
                break
            }
            console.log(result);

            // Updates the user Password in MongoDB database
            const UserDataa = await userModel.findByIdAndUpdate({_id:usrData._id},{$set:{password:newPassword,token:''}},{new:true});
            res.status(200).send({success:true,msg:"User password has been reset",data:UserDataa});
        }
        else{
            res.status(400).send({success:true,msg:"this link is expired"});

        }
        
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

// this function Sends an Reset Email to The user who wants to change Reset Password
exports.forgotpassword = async(req,res)=> {
    try {
        const email = req.body.email;

        const userData = await userModel.findOne({email:email});
        if(userData)
        {
            //Generate Random Token for User
            const randomString = randomstring.generate();

            // sends the reset email to user
            sendResetPasswordMail(userData.first_name,email,randomString);
            res.status(200).send({success:true,msg:"please check your mail inbox and reset password"});

        }
        else
        {
            res.status(200).send({success:true,msg:"this email doesnt exist"});
        }

    }
    catch(error) {
        res.status(400).send({success:false,msg:error.message});
    }
}



