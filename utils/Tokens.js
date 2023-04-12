const jwt = require("jsonwebtoken");
//const userModel = require("../../models/userModel");

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
@returns {Promise<string|null>} - A Promise that resolves to a token string if found in the header,
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

module.exports = { GenerateToken, verifyToken, retrieveToken };
