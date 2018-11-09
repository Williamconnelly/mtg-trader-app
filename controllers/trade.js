var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const verifyToken = require("../middleware/verifyToken");
require('dotenv').config();

// Finds all trades where the user is either a_user or b_user
router.get("/list", verifyToken, (req, res) => {
  db.trade.findAll({
    where: {
      [op.or]: [{a_user: req.user.id}, {b_user: req.user.id}]
    }
  }).then(result => {
    res.json(result);
  })
})

// Finds all trades where the user has been sent a request but has not accepted
router.get("/pending", verifyToken, (req, res) => {
  db.trade.findAll({
    where: {
      b_user: req.user.id,
      b_accept: false
    }
  }).then(result => {
    res.json(result);
  })
})

router.get("/test", verifyToken, (req, res) => {
 db.user.findOne({
   where: {
     id: req.user.id
   }, include: [
     {model: db.trade, as: 'initiated_trades'}, {model: db.trade, as: 'received_trades'}
   ]
 }).then(result => {
   res.send(result);
 })
})

// Initiates a trade between logged user as a_user and targeted user as b_user. Errors if already existing.
router.get("/initiate/:id", verifyToken, (req, res) => {
  db.trade.findOrCreate({
    where: {
      [op.or]: [{a_user: req.user.id, b_user: req.params.id}, {a_user: req.params.id, b_user: req.user.id}]
    },
    defaults: {
      a_user: req.user.id,
      b_user: req.params.id,
      phase: 0,
      b_accept: false,
      a_lock: null,
      b_lock: null,
      a_submit: null,
      b_submit: null
    }
  }).spread((trade, created) => {
    if (created) {
      res.json({msg: `TRADE CREATED BETWEEN USER ${req.user.id} AND USER ${req.params.id}`})
    } else {
      res.json({
        error: true,
        status: 401,
        message: "A Trade Between Those Two Users Already Exists"
      });
    }
  })  
})


router.get("/collection", verifyToken, (req, res) => {
  db.collection.findAll({
    where: {
      userId: req.user.id,
      trade_copies: {[op.gt]: 0}
    }
  }).then(result => {
    res.send(result);
  })
})

module.exports = router;