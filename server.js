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

const trie = require('./trie').trie;

app.use(bp.json());
// app.use(express.json());
app.use(cors());

app.use('/auth', require('./controllers/auth'));
app.use('/card', require('./controllers/card')(trie));
app.use('/user', require('./controllers/user')(io));
app.use('/trade', require('./controllers/trade'));
app.use('/gathering', require('./controllers/gathering'));
app.use('/autocomplete', require('./controllers/autocomplete')(trie));

app.use(express.static(path.join(__dirname, 'mtg-app/dist/mtg-app')));

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve(__dirname + "/mtg-app/dist/mtg-app/index.html"));
});

io.on('connection', (socket) => {
    console.log('Connected');

    socket.on("message", (data)=>{console.log(data)});

    socket.on("joinRoom", function(data) {
        socket.join(data["roomName"]);
    });
    socket.on("addCard", (data) => {
        console.log("addCard")
        socket.to(data["roomName"]).emit("addCard", data['addCard']);
    });
    socket.on("updateCard", (data) => {
        console.log("updateCard")
        socket.to(data["roomName"]).emit("updateCard", data["updateCard"]);
    });
    socket.on("removeCard", (data) => {
        console.log("removeCard")
        socket.to(data["roomName"]).emit("removeCard", {
            collectionId: data["collectionId"]
        });
    });
    socket.on("lock", (data) => {
        console.log("lock");
        socket.to(data["roomName"]).emit("lock", {
            lockKey: data['lockKey'],
            lock: data['lock']
        });
    })
    socket.on("unlock", (data) => {
        console.log("unlock");
        socket.to(data["roomName"]).emit("unlock", data['lockKey']);
    })
    socket.on("submit", (data) => {
        console.log("submit");
        console.log(data);
        socket.to(data["roomName"]).emit("submit", data["submitKey"]);
    })
    socket.on("finalSubmit", (data) => {
        console.log("finalSubmit");
        socket.to(data["roomName"]).emit("finalSubmit");
    })

    socket.on("tradeMessage", (data) => {
        socket.to(data["roomName"]).emit("tradeMessage", data["messageObject"]);
    })
})

var port = process.env.PORT || 3000;
var server = http.listen(port, () => console.log(`Server now running on ${port}`));

module.exports = server;