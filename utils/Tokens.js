const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

/**
 * Generates a JSON Web Token for the provided user ID using the SECRETJWT environment variable.
 * @async
 * @function GenerateToken
 * @param {string} user_id - The ID of the user for whom the token will be generated.
 * @returns {String} The generated JSON Web Token.
 * @throws {Error} If there is an error generating the token.
 */
async function GenerateToken(user_id) {
	console.log("user id = " + user_id);
	return jwt.sign({ user_id }, process.env.SECRETJWT, {
		expiresIn: "1d",
	});
}

/**
 * Verify a JSON Web Token using the provided secret
 *
 * @async
 * @function verifyToken
 * @param {string} token - the JWT to verify
 * @returns {String} - The decoded JWT payload most cases user_id
 * @throws {Error} - if the token is invalid or cannot be verified
 */
async function verifyToken(token) {
	return jwt.verify(token, process.env.SECRETJWT);
	// const decoded=jwt.verify(token,process.env.SECRETJWT);
	// const myID=decoded.id
	// return myID
}

/**

Asynchronous function to retrieve an authorization token from the request headers.
@async
@function retrieveToken
@param {object} req - The request object containing headers.
@param {string} req.headers.authorization - The authorization header containing a Bearer token.
@returns {Token} - A Promise that resolves to a token string if found in the header,
or null if not found or the auth type is not Bearer.
*/
async function retrieveToken(req) {
	const authHeader = req.headers.authorization;
	//const authHeader = req.headers.authorization.split(' ');
	// const authHeader= req.headers.authorization.split(' ')[1] || '';

	const [authType, token] = authHeader.split(" ");
	if (authType !== "Bearer" || !token) {
		return null;
	}
	return token;
}

/**
 * Check if the request is authorized by verifying the token and checking if the user exists
 * @async
 * @function authorized
 * @param {Object} req - Express request object
 * @returns {boolean} - Returns true if the user is authorized, false otherwise
 */
async function authorized(req) {
	const token = await retrieveToken(req);
	if (!token) {
		console.log("Token not found");
		return false;
	}
	try {
		const decoded = await verifyToken(token);
		console.log("Token verified");
		const user = await userModel.findById(decoded.user_id);
		if (!user) {
			console.log("User not found");
			return false;
		}
		console.log("User authorized");
		return true, user._id;
	} catch (err) {
		console.error(err);
		return false;
	}
}

module.exports = { GenerateToken, verifyToken, retrieveToken, authorized };
