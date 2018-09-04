require("dotenv").config();
var express = require("express");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var db = require("./models");

var app = express();



var server = app.listen(process.env.PORT || 3000);