const { validationResult } = require("express-validator");
const userModel = require("../models/userModel")
// const validationResult=

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
    
    res.status(200).json(
       {
        success:true,
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