const express = require("express");
const router = express.Router();
const {
	validateUserSignup,
	userVlidation,
} = require("../middlewares/validation/user");
const {
	signup,
	signin,
	forgotpassword,
	resetPassword,
} = require("../controller/userController");
//validation
// const check= require('express-validator').check
const { check } = require("express-validator");

//

router.post("/auth/signup", validateUserSignup, userVlidation, signup);
router.post("/auth/signin", signin);
//router.put('/auth/forgetPassword',);
//router.post('/auth/forgetPassword',forgettingPassword);
router.post("/auth/forgetPassword", forgotpassword);
router.post("/auth/reset-password", resetPassword);

//validation
// router.post('/signup',check('first_name').not().isEmpty
// , signup);

//validation

// // //5atar
// // const User = require('../models/userModel');
// // //5atar
// // // // const User = require('../models/userModel');
// // const userRouter= express.Router();
// // // // User
// // Define a route handler for the default home page
// router.get('/', (req, res) => {
//     res.send('Hi from  js');
// });

module.exports = router;

// // //5atar:
// // userRouter.post('/signup',async (req,res) => {
// //     try{
// //       const { first_name,last_name,email,email_confirmation,password}= req.body
// //       const user= await User.create({first_name,last_name,email,email_confirmation,password});
// //       console.log(user);
// //       res.send(user);
// //     } catch(error){
// //         console.log(error);
// //     }

// // } );

// // // 5atar
// // // // //5atar
// // // // // usersRoute.post('/login', (req,res) =>{
// // // // //    res.send('login route');

// // // // // });

// // // // ///
// // //5atar
// // module.exports=userRouter;
