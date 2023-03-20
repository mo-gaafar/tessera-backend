const { validationResult } = require("express-validator");
const userModel = require("../models/userModel")
// const validationResult=

/* 
This function will create a new user in the database
*/
exports.signUp = async (req,res,next) =>{
    

    //getting user email
    const {email} =req.body;
    const {emailConfirmation}=req.body
    

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
    if (email!=emailConfirmation){
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

/*
This function will allow the user to sign in if they
entered their email and password correctly and will
generate token to the user

*/
exports.signIn = async (req,res,next) =>{

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
        token
        //user

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

/*
This function will check if the email entered by the user 
already exists 
*/

exports.emailExist= async(req,res,next)  =>{

    const {email} =req.body;

    const userExist=await userModel.findOne({email}); // checking if email already exists 

    //email found
    if (userExist){
       return res.status(400).json({
        sucess:false,
        message:"Email already exists"
       }
       )

}
else(
    res.status(200).json(
        {
         success:true,
         
 
        }
     )
)



}