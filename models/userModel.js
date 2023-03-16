const mongoose= require('mongoose');
// const usersRoute = require('../router/userRouter');

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
}


});

const User= mongoose.model('User',UserSchema);

module.exports= User;
