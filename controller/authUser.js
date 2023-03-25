
const jwt = require("jsonwebtoken");
async function redirectingFromSocial(req, res) {
    const token = jwt.sign(
      { _id: req.user._id.toString() },
      process.env.SECRETJWT,
      {
        expiresIn: "24h",
      }
    );
    return res.status(200).json({
      success: true,
      token,
  });
}
module.exports = { redirectingFromSocial}