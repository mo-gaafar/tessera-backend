
const jwt = require("jsonwebtoken");
/**
 * @async
 * @function redirectingFromSocial
 * @param {Object} req - User information object
 * @param {Object} res - Jwt token 
 * @returns -Success and Jwt token
 */
async function redirectingFromSocial(req, res) {
    const token = jwt.sign(
      { _id: req.user._id.toString() },
      process.env.SECRETJWT,
      {
        expiresIn: "24h",
      } 
    );
    const myuser=req.user
    return res.status(200).json({
      success: true,
      token,
      myuser
  });
}

async function authUserInfo(req, res) {
  return res.json(req.user);
}
module.exports = { redirectingFromSocial,authUserInfo}