var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
const verifyToken = require("../middleware/verifyToken");
require('dotenv').config();

// Find trade partners based on user wishlist
router.get("/gathering/want", verifyToken ,(req, res) => {
  // res.status(200).send("Trading!");
  console.log(req);
});

// Find trade partners based on user tradelist
router.get("/gathering/provide", veryifyToken, (req, res) => {
  res.status(200).send("Trading!");
});

module.exports = router;