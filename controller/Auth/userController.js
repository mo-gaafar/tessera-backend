const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const userModel = require("../../models/userModel");
const eventModel = require("../../models/eventModel");
const {
	sendUserEmail,
	forgetPasswordOption,
} = require("../../utils/sendEmail");
const {
	passwordEncryption,
	comparePassword,
} = require("../../utils/passwords");
const { GenerateToken, verifyToken } = require("../../utils/Tokens");
const { sendVerification, verifyEmail } = require("./verificationController");

/**
 * Creates a new user with the provided email and sends a verification email to the user's email address.
 *
 * @async
 * @function signUp
 * @param {Object} req - The request object containing the user's info
 * @param {string} req.body.email - The user's email.
 * @param {string} req.body.emailConfirmation - The user's email confirmation.
 * @param {Object} res - The response object that will be sent back to the client.
 * @returns {Object} - A response object with information about whether the sign up was successful and if a verification email was sent.
 *
 * @throws {Error} If there is an internal server error.
 * @throws {Error} If a user with the same email already exists.
 */
async function signUp(req, res) {
	// Get the email and emailConfirmation fields from the request body
	const { email, emailConfirmation } = req.body;

	// Check if a user with the same email already exists
	const userExist = await userModel.findOne({ email });
	if (userExist) {
		return res.status(200).json({
			success: false,
			message: "Email already exists",
		});
	}

	// Check if the email and email confirmation fields match
	if (email != emailConfirmation) {
		return res.status(200).json({
			success: false,
			message: "Email address does not match the above",
		});
	}

	try {
		// Create a new user with the request body data
		const user = await userModel.create(req.body);

		// Send a verification email to the user's email address
		const verificationResult = await sendVerification(email);

		if (verificationResult.success) {
			// Return a success message if the verification email was sent successfully
			return res.status(201).json({
				success: true,
				user,
				message: "User created and verification email sent",
			});
		} else {
			// Return an error message if there was an error sending the verification email
			return res.status(500).json({
				success: false,
				message: verificationResult.message,
			});
		}
	} catch (error) {
		// Return an error message if there was an error creating the user
		console.log(error);
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
}

async function createEvent(req, res) {
	try {
		await eventModel.create(req.body);
		return res.status(200).json({
			success: true,
			message: "Event has been created successfully",
		});
	} catch (error) {
		// Return an error message if there was an error creating the event
		console.log(error);
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
}

/**
 * Sign in a user with the given email and password and it will generate a token to the user
 *
 * @async
 * @function
 * @param {Object} req - The request object containing the user's email and password.
 * @param {string} req.body.email - The user's email.
 * @param {string} req.body.password - The user's password.
 * @param {Object} res - The response object that will be sent back to the client.
 * @returns {Object} - A response object with information about whether the sign in was successful and an access token if it was.
 *
 * @throws {Object} - An error object if there was an error while signing in the user.
 */
async function signIn(req, res) {
	try {
		const { email, password } = req.body; // Getting email and password from request body

		// Prompting to user  if email or password are left blank
		if (!email || !password) {
			return res.status(200).json({
				success: false,
				message: "Email and password are required",
			});
		}

		const user = await userModel.findOne({ email }); // Finding user with the given email

		// User email not found
		if (!user) {
			return res.status(200).json({
				success: false,
				message: "Invalid Email or Password",
			});
		}

		// Check whether the user is verified or not
		if (!user.isVerified) {
			return res.status(200).json({
				success: false,
				message: "Please verify your email address",
			});
		}

		// Compare the given password with the encrypted password in the database
		const isMatched = await comparePassword(user.password, password);

		// Password not matched
		if (!isMatched) {
			return res.status(200).json({
				success: false,
				message: "Incorrect password",
			});
		}

		// Generate access token for the user
		const accessToken = await GenerateToken(user._id);

		// Return success response with access token and user information
		res.status(200).json({
			success: true,
			accessToken,
			message: "User logged in successfully",
			//user
		});
	} catch (error) {
		// Return error response if there was an error during login
		console.log(error);
		return res.status(400).json({
			success: false,
			message: "Cannot login, check your credentials",
		});
	}
}

/**
Send a reset password email to the user's email address.

* @async
* @function
* @param {Object} req - The request object --> contains user email that forgot password 
* @param {String} req.body.email - The user's email.
* @param {Object} res - The response object. --> success if user's email found and email sent
* @returns {void}
*
* @throws {400} Throws an error if the user email doesn't exist or if there's a server error.
*/
async function forgotPassword(req, res) {
	try {
		// Get email from request body
		const email = req.body.email;

		// Find user by email
		const user = await userModel.findOne({ email: email });

		// If user is found
		if (user) {
			// Generate verification token for user
			const token = jwt.sign({ userId: user._id }, process.env.SECRETJWT, {
				expiresIn: "1d",
			});

			// Send email to user with reset password token
			await sendUserEmail(email, token, forgetPasswordOption);

			// Return success message
			res.status(200).send({
				success: true,
				message: "please check your mail inbox and reset password",
			});
		} else {
			// Return error message if email is not found
			res
				.status(200)
				.send({ success: true, message: "this email doesnt exist" });
		}
	} catch (error) {
		// Return error message if an error occurs
		res.status(400).send({ success: false, message: error.message });
	}
}

/**
 
* Resets user password using a token
*
* @async
* @param {Object} req - Express request object --> contains user's new password 
* @param {String} req.params.token - the verification token containing user Id
* @param {Object} res - Express response object -->  contains 'success' if user's password has been reset
* @returns {Object} - Response object with success and message properties
*
* @throws {400} - If there's an error verifying the token or updating the user's password
*/
async function resetPassword(req, res) {
	try {
		// Get token from request params
		const token = req.params.token;

		// Verify token
		const decoded = jwt.verify(token, process.env.SECRETJWT);

		// Find user by ID
		const user = await userModel.findById(decoded.userId);

		// If the user is found by ID
		if (user) {
			const password = req.body.password;

			// Encrypt user password
			let encryptedPassword = await passwordEncryption(password);

			// Update user password in MongoDB database
			await userModel.findByIdAndUpdate(
				{ _id: user._id },
				{ $set: { password: encryptedPassword, token: "" } },
				{ new: true }
			);

			res.status(200).send({
				success: true,
				message: "User password has been reset",
			});
		} else {
			// If the user is not found by ID, the token is expired
			res.status(200).send({ success: true, message: "this link is expired" });
		}
	} catch (error) {
		// If an error occurs, return an error message
		res.status(400).send({ success: false, message: error.message });
	}
}

module.exports = { signUp, signIn, forgotPassword, resetPassword, createEvent };
