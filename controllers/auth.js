require("dotenv").config();
const express = require("express");
const router = express.Router();
const Sequelize = require('sequelize');
var db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Signup
router.post("/signup", (req, res) => {
  // Check for email - If none, CREATE
  db.user.findOrCreate({
    where: {
      email: req.body.email
    }, defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).spread(((user, created) => {
    // If no email was found
    if (created) {
      var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24
      })
      // Return user and new token
      res.json({user, token})
    } else {
      
    }
  }))
})

module.exports = router;