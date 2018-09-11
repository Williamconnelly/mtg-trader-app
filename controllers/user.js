var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
require('dotenv').config();

// Get User's Collection
// router.get("/collection", (req, res) => {
//   db.collection.get({
//     where: {
//       userId: req.body.userId
//     }
//   }).then(collection => {
    
//   })
// })

// Add to Collection
router.post("/collection", (req, res) => {
  db.user.find({
    where: {
      // TODO: Get at User differently
      id: req.body.userId
    } 
  }).then(user => {
    db.cardsSets.find({
      where: {
        id: req.body.printingId
      }
    }).then(cardPrinting => {
      user.addCardsSets(cardPrinting, {through: {
        owned_copies: req.body.owned_copies,
        trade_copies: req.body.trade_copies
      }});
    })
  })
})

// Add to Wishlist
router.post("/wishlist", (req, res) => {
  db.user.find({
    where: {
      // TODO: Get at User differently
      id: req.body.userId
    }
  }).then(user => {
    db.card.find({
      where: {
        id: req.body.cardId
      }
    }).then(card => {
      user.addCard(card, {through: {
        number_wanted: req.body.number_wanted,
        pref_printing: req.body.pref_printing
      }})
    })
  })
})

module.exports = router;