const userModel = require("../models/userModel")


exports.signup = async (req,res,next) =>{
    const {email} =req.body;
    // const { first_name,last_name,email,email_confirmation,password}= req.body

    const userExist=await userModel.findOne({email});

    if (userExist){
       return res.status(400).json({
        sucess:false,
        message:"Email already exists"
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
