var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const verifyToken = require("../middleware/verifyToken");
require('dotenv').config();

router.get("/gathering/want", verifyToken, (req, res) => {
  let tradePartners = {};
  // Find the user and their wishlist
  db.user.findOne({
    where: {
      id: req.user.id
    }, include: [db.card]
  }).then(user => {
    // For each of the CARDS on their wishlist, find matching partners
    let testprinting;
    for (card in user.dataValues.cards) {
      let currentCard = user.dataValues.cards[card].dataValues;
      if (currentCard.wishlist.dataValues.pref_printing === null) {
          testprinting = db.cardsSets.findAll({
          where: {
            cardId: currentCard.id
          }, include: [db.user], required: true
        });
      } else {
        testprinting = db.cardsSets.findAll({
          where: {
            id: currentCard.wishlist.dataValues.pref_printing
          }, include: [db.user], required: true
        });
      }
      Promise.all([testprinting]).then(printings => {
        for (printing in printings) {
          for (thing in printings[printing]) {
            if (printings[printing][thing].dataValues.users.length > 0) {
              for (partner in printings[printing][thing].users) {
                let currentUser = printings[printing][thing].dataValues.users[partner].dataValues;
                let currentPrinting = printings[printing][thing].dataValues
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
                  // Check if the user already exists as a trade partner
                  tradePartners.hasOwnProperty(currentUser.id) ? 
                  // If they do, add the card to their cards list
                  tradePartners[currentUser.id].cards.push({
                    cardId: currentCard.id,
                    cardName: currentCard.name,
                    trade_copies: ownedPrinting.trade_copies
                  }) : 
                  // If they don't, add the user and their new card
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
        }
      })
    }
    setTimeout(() => {
      const newArray = Object.values(tradePartners).sort((a,b) => {
        return a.cards.length - b.cards.length}
      ).reverse();
      res.send(newArray);
    }, 1000)
  })
})

// Find trade partners based on user tradelist
router.get("/gathering/provide", verifyToken, (req, res) => {
  let tradePartners = {};
  // Find the cards in the user's collection that they are wanting to trade
  db.collection.findAll({
    where: {
      userId: req.user.id,
      trade_copies: {
        [op.gt]: 0
      }
    }, include: [db.cardsSets]
  }).then(userCollection => {
    // For each of the printings they want to trade, compare it to all of the wishlists
    for (printing in userCollection) {
      let currentPrinting = userCollection[printing].dataValues;
      db.wishlist.findAll({
        where: {
          userId: {
            [op.not]: req.user.id
          }
        }, include: [db.card, db.user]
      }).then(wishlists => {
        for (userWishlist in wishlists) {
          let currentWishCard = wishlists[userWishlist].dataValues;
          // For each wishlist item, check if it has a preferred printing
          if (currentWishCard.pref_printing !== null) {
            // If the user wants a specific printing, does it match the user's?
            if (currentPrinting.cardsSetId === currentWishCard.pref_printing) {
              // If it matches, add the user a tradepartner
              // Check if the user already exists as a trade partner
              tradePartners.hasOwnProperty(currentWishCard.userId) ?
              // If they do, add the card to their cards list
              tradePartners[currentWishCard.userId].cards.push({
                cardId: currentWishCard.cardId,
                cardName: currentWishCard.card.dataValues.name,
                number_wanted: currentWishCard.number_wanted,
                cardPrinting: currentWishCard.pref_printing
              }) : 
              // If they don't, add the user and their new card
              tradePartners[currentWishCard.userId] = {
                userId: currentWishCard.userId,
                userName: currentWishCard.user.dataValues.username,
                cards: [{
                  cardId: currentWishCard.cardId,
                  cardName: currentWishCard.card.dataValues.name,
                  number_wanted: currentWishCard.number_wanted,
                  cardPrinting: currentWishCard.pref_printing
                }]
              }
            }
            // If no preferred printing, find the other versions of the user's printing to match the card
          } else {
            if (currentPrinting.cardsSet.cardId === currentWishCard.cardId) {
              // If it matches, add the user a tradepartner
              // Check if the user already exists as a trade partner
              tradePartners.hasOwnProperty(currentWishCard.userId) ?
              // If they do, add the card to their cards list
              tradePartners[currentWishCard.userId].cards.push({
                cardId: currentWishCard.cardId,
                cardName: currentWishCard.card.dataValues.name,
                number_wanted: currentWishCard.number_wanted,
                cardPrinting: currentWishCard.pref_printing
              }) : 
              // If they don't, add the user and their new card
              tradePartners[currentWishCard.userId] = {
                userId: currentWishCard.userId,
                userName: currentWishCard.user.dataValues.username,
                cards: [{
                  cardId: currentWishCard.cardId,
                  cardName: currentWishCard.card.dataValues.name,
                  number_wanted: currentWishCard.number_wanted,
                  cardPrinting: currentWishCard.pref_printing
                }]
              }
            }
          }
        }
      })
    }
    setTimeout(() => {
      const newArray = Object.values(tradePartners).sort((a,b) => {
        return a.cards.length - b.cards.length}
      ).reverse();
      res.send(newArray);
    }, 1000)
  })
});

module.exports = router;

// Route w/ if statement break

// router.get("/gathering/want", verifyToken, (req, res) => {
//   let tradePartners = {};
//   // Find the user and their wishlist
//   db.user.findOne({
//     where: {
//       id: req.user.id
//     }, include: [db.card]
//   }).then(user => {
//     // For each of the CARDS on their wishlist
//     for (card in user.dataValues.cards) {
//       let currentCard = user.dataValues.cards[card].dataValues;
//       if (currentCard.wishlist.dataValues.pref_printing === null) {
//         db.cardsSets.findAll({
//           where: {
//             cardId: currentCard.id
//           }, include: [db.user], required: true
//         }).then(printings => {
//           for (printing in printings) {
//             for (partner in printings[printing].dataValues.users) {
//               let currentUser = printings[printing].dataValues.users[partner].dataValues;
//               let currentPrinting = printings[printing].dataValues
//               db.collection.findOne({
//                 raw: true,
//                 where: {
//                   userId: currentUser.id,
//                   cardsSetId: currentPrinting.id,
//                   trade_copies: {
//                     [op.gt]: 0
//                   }
//                 }
//               }).then(ownedPrinting => {
//                 tradePartners.hasOwnProperty(currentUser.id) ? 
//                 tradePartners[currentUser.id].cards.push({
//                   cardId: currentCard.id,
//                   cardName: currentCard.name,
//                   trade_copies: ownedPrinting.trade_copies
//                 }) : 
//                 tradePartners[currentUser.id] = {
//                   userId: currentUser.id,
//                   userName: currentUser.username,
//                   cards: [{
//                     cardId: currentCard.id,
//                     cardName: currentCard.name,
//                     trade_copies: ownedPrinting.trade_copies
//                   }]
//                 }
//               })
//             }
//           }
//         })
//       } else {
//         db.cardsSets.findAll({
//           where: {
//             id: currentCard.wishlist.dataValues.pref_printing
//           },
//           include: [db.user]
//         }).then(printings => {
//           for (printing in printings) {
//             if (printings[printing].dataValues.users.length > 0) {
//               for (partner in printings[printing].dataValues.users) {
//                 let currentUser = printings[printing].dataValues.users[partner].dataValues;
//                 let currentPrinting = printings[printing].dataValues
//                 db.collection.findOne({
//                   raw: true,
//                   where: {
//                     userId: currentUser.id,
//                     cardsSetId: currentPrinting.id,
//                     trade_copies: {
//                       [op.gt]: 0
//                     }
//                   }
//                 }).then(ownedPrinting => {
//                   tradePartners.hasOwnProperty(currentUser.id) ? 
//                   tradePartners[currentUser.id].cards.push({
//                     cardId: currentCard.id,
//                     cardName: currentCard.name,
//                     trade_copies: ownedPrinting.trade_copies
//                   }) : 
//                   tradePartners[currentUser.id] = {
//                     userId: currentUser.id,
//                     userName: currentUser.username,
//                     cards: [{
//                       cardId: currentCard.id,
//                       cardName: currentCard.name,
//                       trade_copies: ownedPrinting.trade_copies
//                     }]
//                   }
//                 })
//               }
//             }
//           }
//         }) 
//       }
//     }
//     setTimeout(() => {
//       const newArray = Object.values(tradePartners).sort((a,b) => {
//         return a.cards.length - b.cards.length}
//       ).reverse();
//       res.send(newArray);
//     }, 100)
//   })
// })