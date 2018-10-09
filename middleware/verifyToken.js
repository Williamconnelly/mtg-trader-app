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
    let errorCatch = jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        console.log("THERE IS A FUCKING ERROR");
        res.send({
          error: "FUCK THIS SHIT"
        })
      }
    });
    let payload = jwt.verify(token, process.env.JWT_SECRET);
    // If the verification doesn't return anything, return Unauthorized
    if (!payload) {
      res.status(401).send("Unauthorized Request");
    } else {
      // If the token verifies correctly, set userId in the req and call NEXT
      req.user = payload;
    }
    next();
  }
}

module.exports = verifyToken;