const jwt = require("jsonwebtoken");

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
}
async function retrieveToken(req) {
	const authHeader = req.headers.authorization;
	const [authType, token] = authHeader.split(" ");
	if (authType !== "Bearer" || !token) {
		return null;
	}
	return token;
}

module.exports = { GenerateToken, verifyToken, retrieveToken };
