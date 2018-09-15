var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
const verifyToken = require("../middleware/verifyToken");
require('dotenv').config();

// Find trade partners based on user wishlist
router.get("/partners/want", (req, res) => {
  res.status(200).send("Trading!");
});

// Find trade partners based on user tradelist
router.get("/partners/provide", (req, res) => {
  res.status(200).send("Trading!");
});

module.exports = router;