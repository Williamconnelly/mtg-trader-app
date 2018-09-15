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
  res.json([1,2,3]);
});

// Find trade partners based on user tradelist
router.get("/gathering/provide", (req, res) => {
  res.status(200).send("Trading!");
});

module.exports = router;