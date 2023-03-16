const mongoose= require('mongoose');
// // const usersRoute = require('../router/userRouter');
// const router=express.Router()



const UserSchema= new mongoose.Schema({
first_name:{
 type:String,
 required:true,
},
last_name:{
    type:String,
    required:true,
},
email:{
    type:String,
    required:true,
},
email_confirmation:{
    type:String,
    required:true,
},
password:{
    type:String,
    required:true,
},


}, {timestamps:true} );

// const User= mongoose.model('User',UserSchema);

// module.exports= User;
// module.exports=router;
module.exports=mongoose.model("userModel",UserSchema);