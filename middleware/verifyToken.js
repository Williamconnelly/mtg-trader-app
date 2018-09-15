const Sequelize = require('sequelize');
const jwt = require("jsonwebtoken");

// Middleware to check incoming request for auth header and verify token
const verifyToken = (req, res, next) => {
  // If the req has no auth header, return Unauthorized
  if (!req.headers.authorization) {
    res.status(401).send("Unauthorized Request");
  } else {
    // If the req has an auth header, splice out the token
    let token = req.headers.authorization.split(' ')[1];
    // If the token is null, return Unauthorized
    if (token === 'null') {
      res.status(401).send("Unauthorized Request");
    }
    // Verify the token with the jwt secret key
    let payload = jwt.verify(token, process.env.JWT_SECRET)
    // If the verification doesn't return anything, return Unauthorized
    if (!payload) {
      res.status(401).send("Unauthorized Request");
    }
    // If the token verifies correctly, set userId in the req and call NEXT
    req.userId = payload.subject;
    next();
  }
}

module.exports = verifyToken;