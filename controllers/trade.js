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
        // db.card.find({
        //   where: {
        //     id: user.dataValues.cards[card].dataValues.wishlist.dataValues.cardId
        //   },
        //   include: [db.set]
        // }).then(cards => {
        //   console.log(cards.sets);

        // })
        db.cardsSets.findAll({
          where: {
            cardId: user.dataValues.cards[card].dataValues.wishlist.dataValues.cardId
          },
          include: [db.user]
        }).then(printings => {
          for (printing in printings) {
            console.log(printings[printing].dataValues)
          }
        })
      // If the card has a preferred printing
      } else {
        console.log("what");
      }
    }
  })

/*
  // });
  db.user.findOne({
    where: {
      id: req.user.id
    }, include: [db.card]
  }).then(user => {
    // console.log(user.cards[0].wishlist.dataValues);
    // for (card in user.cards) {
    //   console.log("NEW CARD");
    //   console.log(user.cards[card].dataValues.wishlist.dataValues);
    // }
    db.card.find({
      where: {
        id: 50999
      },
      include: [db.set]
    }).then(card => {
      // console.log(card.sets[0].cardsSets);
      for (printing in card.sets) {
        // console.log(card.sets[printing].cardsSets.dataValues)
        db.cardsSets.findAll({
          where: {
            id: card.sets[printing].cardsSets.dataValues.id
          },
          include: [db.user]
        }).then(printings => {
          for (printing in printings) {
            // console.log(printings[printing].dataValues);
            if (printings[printing].dataValues.users.length > 0) {
              console.log(printings[printing].dataValues.users[0].dataValues)
            }
          }
        })
      }
    })
  })
  */
});

// Find trade partners based on user tradelist
router.get("/gathering/provide", verifyToken, (req, res) => {
  res.status(200).send("Trading!");
});

module.exports = router;