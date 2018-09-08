require("dotenv").config();
var express = require("express");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var db = require("./models");
const axios = require("axios");

var app = express();



app.use('/card', require('./controllers/cards'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;