require("dotenv").config();
var express = require("express");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var db = require("./models");
const axios = require("axios");
const bp = require("body-parser");

var app = express();
app.use(bp.json());

app.get("/", (req, res) => {
  res.send("Hello!");
})

app.use('/card', require('./controllers/cards'));

var port = process.env.PORT || 3000;
var server = app.listen(port, () => console.log(`Server now running on ${port}`));

module.exports = server;