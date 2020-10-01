const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  console.log(config.get("vividly_jwtkey"));
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied. No token provided");
  try {
    req.user = jwt.verify(token, config.get("vividly_jwtkey"));
    next();
  } catch (ex) {
    return res.status(400).send("Invalid Token");
  }
}
module.exports = auth;
