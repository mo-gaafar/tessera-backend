// const securePassword = require("secure-password");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * Encrypts a user's password using JWT
 *
 * @async
 * @function passwordEncryption
 * @param {string} userPassword - The user's plain-text password
 * @returns {encryptedPassword}  Returns the encrypted password (JSON Web Token.)
 * @throws {Error} Throws an error if encryption fails
 */
async function passwordEncryption(userPassword) {
	try {
		if (userPassword == null) {
			console.log("password doesnt exist ");
			return;
		}
		// Generate verification token
		//const encryptedPassword = jwt.sign({ userPassword }, process.env.SECRETJWT);
		if (!userPassword) {
			throw new Error("Both password and salt are required for encryption.");
		}
		const salt = await bcrypt.genSalt(10);

		// Hash the password with the salt
		const encryptedPassword = await bcrypt.hash(userPassword, salt);

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
		//const encryptedPassword = jwt.sign(userPassword, process.env.SECRETJWT);
		const isMatched = await bcrypt.compare(userPassword, userStoredPassword);
		console.log("password stored = " + userStoredPassword);
		console.log("password  = " + userPassword);
		console.log(isMatched);

		if (isMatched) {
			//console.log("password = " + encryptedPassword);
			return true;
		} else {
			//console.log("password = " + encryptedPassword);
			return false;
		}
	} catch (error) {
		console.log(error);
	}
}

module.exports = { passwordEncryption, comparePassword };
