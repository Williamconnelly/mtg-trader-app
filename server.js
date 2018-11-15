require("dotenv").config();
var express = require("express");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var db = require("./models");
const axios = require("axios");
const bp = require("body-parser");
const cors = require("cors");
const path = require("path");

var app = express();
var http = require("http").Server(app);
var io = require('socket.io')(http);

app.use(bp.json());
// app.use(express.json());
app.use(cors());

app.use('/auth', require('./controllers/auth'));
app.use('/card', require('./controllers/card'));
app.use('/user', require('./controllers/user'));
app.use('/trade', require('./controllers/trade'));
app.use('/gathering', require('./controllers/gathering'));

app.use(express.static(path.join(__dirname, 'mtg-app/dist/mtg-app')));

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve(__dirname + "/mtg-app/dist/mtg-app/index.html"));
});

io.on('connection', (socket) => {
    console.log('Connected');
    socket.emit("message", "fired");
    socket.on("message", (data)=>{console.log(data)});
    socket.on("joinRoom", function(data) {
        socket.join(data["roomName"]);
    })
    socket.on("addCard", (data) => {
        socket.to(data["roomName"]).emit("addCard", data["tradescollectionsId"]);
    })
    
})

var port = process.env.PORT || 3000;
var server = http.listen(port, () => console.log(`Server now running on ${port}`));

module.exports = server;