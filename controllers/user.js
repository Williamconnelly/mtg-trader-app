var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
const verifyToken = require('../middleware/verifyToken.js')
require('dotenv').config();

// Add multiple cards to collection
router.post("/collection/batch", verifyToken, (req, res) => {
  console.log("ADDING MULTIPLE CARDS TO COLLECTION");
  db.user.find({
    where: {
      id: req.user.id
    }
  }).then(user => {
    for (let i=0; i<req.body.cards.length; i++) {
      db.cardsSets.find({
        where: {
          id: req.body.cards[i]["printingInput"]["cardsSets"]["id"]
        }
      }).then(cardPrinting => {
        user.addCardsSets(cardPrinting, {through: {
          owned_copies: req.body.cards[i]["copies"],
          trade_copies: req.body.cards[i]["tradeCopies"]
        }})
      })
    }
    res.json({});
  })
})

// Get a logged in user's collection
router.get("/collection/loggedin", verifyToken, (req, res) => {
  db.user.find({
    where: {
      id: req.user.id
    }, include:  [{
      model: db.cardsSets,
      include: [db.card, db.set]
    }]
  }).then(user => {
    res.json(user['cardsSets']);
  })
})

// Get User's Collection
router.get("/collection/:id", (req, res) => {
  db.user.find({
    where: {
      // TODO: Get at User differently
      id: req.params.id
    }, include: [{
      model: db.cardsSets,
      include: [db.card, db.set]
    }]
  }).then(user => {
    res.json(user['cardsSets']);
  })
})

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

// Get User's Wishlist
router.get("/collection/:id", (req, res) => {
  db.wishlist.findAll({
    where: {
      // TODO: Get at User differently
      userId: req.params.id
    }
  }).then(wishlist => {
    res.json(wishlist);
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