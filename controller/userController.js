const { validationResult } = require("express-validator");
const userModel = require("../models/userModel")
// const validationResult=

// signup method to register a new user by taking his information
exports.signup = async (req,res,next) =>{
    

    //getting user email
    const {email} =req.body;
    const {email_confirmation}=req.body
    

    const userExist=await userModel.findOne({email}); // checking if email already exists 

    //email found
    if (userExist){
       return res.status(400).json({
        sucess:false,
        message:"Email already exists"
       }
       )
    } 
     // email does not match email confirmation entered
    if (email!=email_confirmation){
        return res.status(400).json({
            sucess:false,
            message:"Email address does not match the above"
           }
           )
    }

    // creating new user 
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

// sign in function
exports.signin = async (req,res,next) =>{

try {
    const {email,password}= req.body; // getting email and password
    //prompting to user  if email or password are left blank 
    if (!email || !password){
        return res.status(400).json(
            {
                success:false,
                message:"Email and password are required"
            }
        )
        }
        
        const user= await   userModel.findOne({email}); // finding user email
        // user email not found
        if (!user){
            return res.status(400).json({
             success:false,
             message:"Invalid Email or Password"


            })
          
        }

    const isMatch= await user.comparePassword(password); // verifying password
    // password not mathced 
    if (!isMatch){
        return res.status(400).json({
            success:false,
            message:"Invalid Email or Password"
           })
    }
    const token= await user.GenerateToken(); //generate user token
    
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