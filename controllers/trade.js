var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const verifyToken = require("../middleware/verifyToken");
require('dotenv').config();
/*
// Find trade partners based on user wishlist
router.get("/gathering/want", verifyToken ,(req, res) => {
  let tradePartners = [];
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
        console.log("+++ STARTING QUERY FOR NO-PREF +++");
        var cardId = user.dataValues.cards[card].dataValues.wishlist.dataValues.cardId;
        db.cardsSets.findAll({
          where: {
            cardId
          },
          include: [db.user]
        }).then(printings => {
          // For each printing of the card, check for related owners
          for (printing in printings) {
            // If a printing has more than 0 owners
            var currentCardId = printings[printing].dataValues.cardId
            if (printings[printing].dataValues.users.length > 0) {
              // For each associated owner, find the card in their collection and check for trade
              for (user in printings[printing].dataValues.users) {
                db.collection.findOne({
                  raw: true,
                  where: {
                    userId: printings[printing].dataValues.users[user].id,
                    cardsSetId: printings[printing].dataValues.id
                  }
                }).then(ownedPrinting => {
                  // If they have listed a copy of the card for trade
                  if (ownedPrinting.trade_copies > 0) {
                    console.log("********** FOUND A USER WILLING TO TRADE! **********");
                    console.log(ownedPrinting);
                    tradePartners.push({
                      user: ownedPrinting.userId,
                      printing: ownedPrinting.cardsSetId,
                      trade_copies: ownedPrinting.trade_copies,
                      card: currentCardId
                    })
                  }
                })
              }
            }
          }
        })
      // If the card has a preferred printing
      } else {
        console.log("+++ STARTING QUERY FOR PREF-PRINTING +++");
        var printingId = user.dataValues.cards[card].dataValues.wishlist.dataValues.pref_printing
        db.cardsSets.findAll({
          where: {
            id: printingId
          },
          include: [db.user]
        }).then(printings => {
          // For each printing of the card
          for (printing in printings) {
            // If a printing has more than 0 owners
            var currentPrintingId = printings[printing].dataValues.id
            var currentCardId = printings[printing].dataValues.cardId
            if (printings[printing].dataValues.users.length > 0) {
              for (user in printings[printing].dataValues.users) {
                db.collection.findOne({
                  raw: true,
                  where: {
                    userId: printings[printing].dataValues.users[user].id,
                    cardsSetId: currentPrintingId
                  }
                }).then(ownedPrinting => {
                  if (ownedPrinting.trade_copies > 0) {
                    console.log("FOUND A USER WILLING TO TRADE!");
                    tradePartners.push({
                      user: ownedPrinting.userId,
                      printing: ownedPrinting.cardsSetId,
                      trade_copies: ownedPrinting.trade_copies,
                      card: currentCardId
                    })
                  }
                })
              }
            }
          }
        })
      }
    }
    // HANDLING ASYNC LOOP. TODO: Find scalable solution
    setTimeout(() => {
      // const tradePartners = [
      //   {user: [{},{},{},{}]},
      //   {user: [{},{},{},{}]}
      // ]
      res.send(tradePartners);
    }, 100)
  })
});
*/

router.get("/gathering/want", verifyToken, (req, res) => {
  let tradePartners = {};
  // Find the user and their wishlist
  db.user.findOne({
    where: {
      id: req.user.id
    }, include: [db.card]
  }).then(user => {
    // For each of the CARDS on their wishlist
    for (card in user.dataValues.cards) {
      let currentCard = user.dataValues.cards[card].dataValues;
      if (currentCard.wishlist.dataValues.pref_printing === null) {
        db.cardsSets.findAll({
          where: {
            cardId: currentCard.id
          }, include: [db.user]
        }).then(printings => {
          for (printing in printings) {
            if (printings[printing].dataValues.users.length > 0) {
              for (partner in printings[printing].dataValues.users) {
                let currentUser = printings[printing].dataValues.users[partner].dataValues;
                let currentPrinting = printings[printing].dataValues
                db.collection.findOne({
                  raw: true,
                  where: {
                    userId: currentUser.id,
                    cardsSetId: currentPrinting.id,
                    trade_copies: {
                      [op.gt]: 0
                    }
                  }
                }).then(ownedPrinting => {
                  tradePartners.hasOwnProperty(currentUser.id) ? 
                  tradePartners[currentUser.id].cards.push({
                    cardId: currentCard.id,
                    cardName: currentCard.name,
                    trade_copies: ownedPrinting.trade_copies
                  }) : 
                  tradePartners[currentUser.id] = {
                    userId: currentUser.id,
                    userName: currentUser.username,
                    cards: [{
                      cardId: currentCard.id,
                      cardName: currentCard.name,
                      trade_copies: ownedPrinting.trade_copies
                    }]
                  }
                })
              }
            }
          }
        })
      } else {
        db.cardsSets.findAll({
          where: {
            id: currentCard.wishlist.dataValues.pref_printing
          },
          include: [db.user]
        }).then(printings => {
          for (printing in printings) {
            if (printings[printing].dataValues.users.length > 0) {
              for (partner in printings[printing].dataValues.users) {
                let currentUser = printings[printing].dataValues.users[partner].dataValues;
                let currentPrinting = printings[printing].dataValues
                db.collection.findOne({
                  raw: true,
                  where: {
                    userId: currentUser.id,
                    cardsSetId: currentPrinting.id,
                    trade_copies: {
                      [op.gt]: 0
                    }
                  }
                }).then(ownedPrinting => {
                  tradePartners.hasOwnProperty(currentUser.id) ? 
                  tradePartners[currentUser.id].cards.push({
                    cardId: currentCard.id,
                    cardName: currentCard.name,
                    trade_copies: ownedPrinting.trade_copies
                  }) : 
                  tradePartners[currentUser.id] = {
                    userId: currentUser.id,
                    userName: currentUser.username,
                    cards: [{
                      cardId: currentCard.id,
                      cardName: currentCard.name,
                      trade_copies: ownedPrinting.trade_copies
                    }]
                  }
                })
              }
            }
          }
        }) 
      }
    }
    setTimeout(() => {
      const newArray = Object.values(tradePartners).sort((a,b) => {
        return a.cards.length - b.cards.length}
      ).reverse();
      res.send(newArray);
    }, 100)
  })
})

// Find trade partners based on user tradelist
router.get("/gathering/provide", verifyToken, (req, res) => {
  res.status(200).send("Trading!");
});

module.exports = router;