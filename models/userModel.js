const mongoose= require('mongoose');
// // const usersRoute = require('../router/userRouter');
// const router=express.Router()
const bcrypt= require('bcryptjs');


const UserSchema= new mongoose.Schema({
first_name:{
 type:String,
 required:false,
 maxlength: 32,
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
UserSchema.pre('save',async function(next){

if (!this.isModified('password')){
 next()

}
this.password= await bcrypt.hash(this.password, 10)

}

);

//verify passsword

UserSchema.methods.comparePassword= async function(yourPassword){
     return await bcrypt.compare(yourPassword,this.password);
}



module.exports=mongoose.model("userModel",UserSchema);