var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
const verifyToken = require("../middleware/verifyToken");
require('dotenv').config();

// Find trade partners based on user wishlist
router.get("/gathering/want", verifyToken ,(req, res) => {
  // Find current User and include their associated cards (Wishlist)
  db.user.findOne({
    where: {
      id: req.user.id
    }, include: [db.card]
  }).then(user => {
    // For each card in the user's wishlist, get the card's printings
    for (card in user.dataValues.cards) {
      // If the card does not have a preferred printing
      if (user.dataValues.cards[card].dataValues.wishlist.dataValues.pref_printing === null) {
        db.cardsSets.findAll({
          where: {
            cardId: user.dataValues.cards[card].dataValues.wishlist.dataValues.cardId
          },
          include: [db.user]
        }).then(printings => {
          // For each printing of the card, check for related owners
          for (printing in printings) {
            // If a printing has more than 0 owners
            if (printings[printing].dataValues.users.length > 0) {
              for (user in printings[printing].dataValues.users) {
                db.collection.findOne({
                  raw: true,
                  where: {
                    userId: printings[printing].dataValues.users[user].id,
                    cardsSetId: printings[printing].dataValues.id
                  }
                }).then(ownedPrinting => {
                  if (ownedPrinting.trade_copies > 0) {
                    console.log("FOUND A USER WILLING TO TRADE!");
                  }
                })
              }
            }
          }
        })
      // If the card has a preferred printing
      } else {
        console.log("what");
      }
    }
  })
});

// Find trade partners based on user tradelist
router.get("/gathering/provide", verifyToken, (req, res) => {
  res.status(200).send("Trading!");
});

module.exports = router;