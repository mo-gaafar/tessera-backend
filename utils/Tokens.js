const jwt = require("jsonwebtoken");

async function GenerateToken(user_id) {
  console.log("user id = " + user_id);
  return jwt.sign(JSON.stringify(user_id), process.env.SECRETJWT);
}

async function verifyToken(token) {
  return jwt.verify(token, process.env.SECRETJWT);
}

module.exports = { GenerateToken, verifyToken };
