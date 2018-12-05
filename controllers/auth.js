require("dotenv").config();
const express = require("express");
const router = express.Router();
const Sequelize = require('sequelize');
var db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const verifyToken = require("../middleware/verifyToken");

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
  }).spread((user, created) => {
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
      });
    }
  }).catch(err => {
    res.json({
      error: true,
      message: err.errors[0].message
    });
  })
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

// Get user data for front end storage
router.get("/getUser", verifyToken, (req, res) => {
  db.user.findOne({
    where: {
      id: req.user.id
    },
    attributes: {exlude: ["createdAt", "updatedAt", "password", "email"]}
  }).then(user => {
    res.json(user);
  })
})

// Find a given user
router.get("/user/:id", verifyToken, (req, res) => {
  db.user.findOne({
    where: {
      id: req.params.id
    }, attributes: {exlude: ["createdAt", "updatedAt", "password", "email"]}
  }).then(foundUser => {
    res.json(foundUser);
  })
})

module.exports = router;