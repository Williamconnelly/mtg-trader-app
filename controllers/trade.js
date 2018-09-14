var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
require('dotenv').config();

router.get("/partners", (req, res) => {
  console.log("HIT");
  res.sendStatus(200).send("Hello");
})

module.exports = router;