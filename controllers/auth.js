require("dotenv").config();
const express = require("express");
const router = express.Router();
const Sequelize = require('sequelize');
var db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

// Signup
router.post("/signup", (req, res) => {
  // Check for email - If none, CREATE
  db.user.findOrCreate({
    where: {
      email: req.body.email
    }, defaults: {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }
  }).spread(((user, created) => {
    // If no email was found
    if (created) {
      var token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24
      });
      // Return user and new token
      res.json({user, token})
    // That user already exists
    } else {
      res.json({
        error: true,
        status: 401,
        message: "An account with that email already exists"
      })
    }
  }))
})

// Login
router.post("/login", (req, res) => {
  db.user.find({
    where: {
      username: req.body.username
    }
  }).then((user, error) => {
    if (user) {
      let hash = user.password;
      if (bcrypt.compareSync(req.body.password, hash)) {
        var token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24
        });
        res.json({ user, token });
      } else {
        console.log("No User Found - Login Failed");
        res.json({
          error: true,
          status: 401,
          message: "Username or Password is incorrect"
        });
      } 
    } else {
      res.json({
        error: true,
        status: 401,
        message: "Username or Password is incorrect"
      })
    }
  });
})

module.exports = router;