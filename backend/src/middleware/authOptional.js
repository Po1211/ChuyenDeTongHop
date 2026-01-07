const jwt = require("jsonwebtoken");

module.exports = function authOptional(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // Invalid token → treat as guest
  }

  next();
};
