
const express=require('express');
const router=express.Router();  
const { validateUserSignup, userVlidation } = require('../middlewares/validation/user'); 
const {signup,signin,emailvalid} =require("../controller/userController") // importing methods from controller
//validation
// const check= require('express-validator').check
const {check}= require('express-validator');


// creating a router 
router.post('/signup',validateUserSignup,userVlidation ,signup);
router.post('/signin',signin);
router.post('/emailvalid',emailvalid);







// // const User = require('../models/userModel');

// // // // const User = require('../models/userModel');
// // const userRouter= express.Router();




module.exports=router; //exporting the module in order to use it in other files

// // module.exports=userRouter;