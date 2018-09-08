require("dotenv").config();
const express = require("express");
const router = express.Router();
const Sequelize = require('sequelize');
var db = require("../models");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Signup
router.post("/signup", (req, res) => {
  // Check if the email is already in the DB
  db.user.findOne({
    where: {email: req.body.email}
  }).then((error, user) => {
    // If user is already in DB
    if (user) {
      console.log("Found Existing User during Signup");
      res.status(401).json({
        error: true,
        message: "Email already exists"
      });
    // If NO existing user
    } else {
      
    }
  })
})

module.exports = router;