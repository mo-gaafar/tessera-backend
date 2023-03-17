const {check,validationResult}= require('express-validator');


exports.validateUserSignup=[
  check('first_name').trim().not().isEmpty().withMessage('First Name is Required').isLength({min:3,max:20}).withMessage('First Name must be within 3 to 20 char').isAlpha().withMessage('First Name should contain letters only'),
  check('last_name').trim().not().isEmpty().withMessage('Last Name is Required').isLength({min:3,max:20}).withMessage('Last Name must be within 3 to 20 char').isAlpha().withMessage('Last Name should contain letters only'),
  check('email').isEmail().withMessage('Please enter a valid email address'),
  check('password').trim().not().isEmpty().withMessage('Password is Required').isStrongPassword().withMessage('Password should be a mixture of Upper case letters,Lower case letters,Numbers,and Symbols '),


]

exports.userVlidation = (req, res, next) => {
    const result = validationResult(req).array();
    console.log(result);
    if (!result.length) return next();
  
    const error = result[0].msg;
    res.json({ success: false, message: error });
  };