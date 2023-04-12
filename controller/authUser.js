const jwt = require("jsonwebtoken");
const { GenerateToken, verifyToken } = require("../utils/Tokens");
/**
 * @async
 * @function redirectingFromSocial
 * @param {Object} req - User information object
 * @param {Object} res - Jwt token
 * @returns -Success and Jwt token
 */
async function redirectingFromSocial(req, res) {
  //req.user._id
  // Generate access token for the user
  const token = await GenerateToken(req.user._id);
  const myuser = req.user;
  return res.status(200).json({
    success: true,
    token,
    myuser,
  });
}

async function authUserInfo(req, res) {
  return res.json(req.user);
}
module.exports = { redirectingFromSocial, authUserInfo };
