require("dotenv").config();
var express = require("express");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var db = require("./models");
const axios = require("axios");
const bp = require("body-parser");
const cors = require("cors");

var app = express();
app.use(bp.json());
// app.use(express.json());
app.use(cors());

app.use('/auth', require('./controllers/auth'));
app.use('/card', require('./controllers/card'));
app.use('/user', require('./controllers/user'));
app.use('/trade', require('./controllers/trade'));
app.use('/gathering', require('./controllers/gathering'));

var port = process.env.PORT || 3000;
var server = app.listen(port, () => console.log(`Server now running on ${port}`));

module.exports = server;