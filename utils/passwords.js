// const securePassword = require("secure-password");
const jwt = require("jsonwebtoken");

/**
 * Encrypts a user's password using JWT
 *
 * @async
 * @function passwordEncryption
 * @param {string} userPassword - The user's plain-text password
 * @returns {Promise<string>} Returns the encrypted password (JSON Web Token.)
 * @throws {Error} Throws an error if encryption fails
 */
async function passwordEncryption(userPassword) {
	try {
		// Generate verification token
		const encryptedPassword = jwt.sign({ userPassword }, process.env.SECRETJWT);

		// Return encrypted password
		return encryptedPassword;
	} catch (error) {
		// Handle error
		console.log(error);
		throw new Error("Failed to encrypt password");
	}
}

/**
 * Compare the given user password with the encrypted password stored in the database.
 * @async
 * @function comparePassword
 * @param {string} userStoredPassword - The encrypted password stored in the database.
 * @param {string} userPassword - The password entered by the user.
 * @returns {boolean} - Returns true if the passwords match, and false otherwise.
 * @throws {Error} - Throws an error if an error occurs while signing the user password.
 */
async function comparePassword(userStoredPassword, userPassword) {
	try {
		const encryptedPassword = jwt.sign(userPassword, process.env.SECRETJWT);
		console.log("password stored = " + userStoredPassword);

		if (encryptedPassword == userStoredPassword) {
			console.log("password = " + encryptedPassword);
			return true;
		} else {
			console.log("password = " + encryptedPassword);
			return false;
		}
	} catch (error) {
		console.log(error);
	}
}

module.exports = { passwordEncryption, comparePassword };
