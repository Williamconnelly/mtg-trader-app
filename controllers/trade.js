var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const verifyToken = require("../middleware/verifyToken");
require('dotenv').config();

router.get("/gathering/want", verifyToken, (req, res) => {
  // Find the wishlist of the logged user
  db.wishlist.findAll({
    raw: true,
    attributes: {exclude: ['id','createdAt','updatedAt']},
    where: {
      userId: req.user.id
    }, include: [
      {model: db.card, required: true, attributes: {exclude: ['createdAt','updatedAt']}, include: [
        {model: db.cardsSets, as: 'printings', required: true, attributes: {exclude: ['cardId',
        'createdAt','updatedAt']}, include: [
          {model: db.set, attributes: {exclude: ['createdAt','updatedAt']}},
          {model: db.user, required: true, attributes: {exclude: ['password','createdAt','updatedAt']}, 
            through: {where: {trade_copies: {[op.gt]: 0}}}, where: {[op.not]: {id: req.user.id}}}
        ]}
      ]}
    ]
  }).then(result => {
    // Parter Container
    tradePartners = {};
    // For each card in the wishlist, format the data into different user objects
    for (wishCard in result) {
      let currentUserId = result[wishCard]['card.printings.users.id'];
      let currentUsername = result[wishCard]['card.printings.users.username'];
      // If the user already exists AND the printing matches OR has no pref
      if (tradePartners.hasOwnProperty(currentUserId) && 
      (result[wishCard].pref_printing === result[wishCard]['card.printings.id'] || 
      result[wishCard].pref_printing === null)) {
        tradePartners[currentUserId].cards.push(result[wishCard])
      // If the user does not exist AND the printing matches OR has no pref
      } else if (result[wishCard].pref_printing === result[wishCard]['card.printings.id'] || 
      result[wishCard].pref_printing === null) {
        tradePartners[currentUserId] = {
          username: currentUsername,
          userId: currentUserId,
          cards: [result[wishCard]]
        }
      }
    }
    // for (wishCard in result) {
    //   let currentUserId = result[wishCard]['card.printings.users.id'];
    //   let currentUsername = result[wishCard]['card.printings.users.username'];
    //   tradePartners.hasOwnProperty(currentUserId) ?
    //   tradePartners[currentUserId].cards.push(result[wishCard]) :
    //   tradePartners[currentUserId] = {
    //     username: currentUsername,
    //     userId: currentUserId,
    //     cards: [result[wishCard]]
    //   }
    // }
    const newArray = Object.values(tradePartners).sort((a,b) => {
      return b.cards.length - a.cards.length}
    );
    res.send(newArray);
  })
})

  // let tradePartners = {};
  // // Find the user's wishlist
  // db.wishlist.findAll({
  //   where: {
  //     userId: req.user.id
  //   }, include: [db.card]
  // }).then(userWishlist => {
  //   // For each of the CARDS on their wishlist, find matching partners
  //   for (card in userWishlist) {
  //     let currentCard = userWishlist[card].dataValues;
  //     let partnerSearch;
  //     if (currentCard.pref_printing !== null) {
  //       partnerSearch = db.cardsSets.findAll({
  //         where: {
  //           id: currentCard.pref_printing
  //         }, include: [{model: db.user, where: {
  //           id: {[op.not]: req.user.id}},
  //           required: true},
  //           {model: db.set}]
  //       })
  //     } else {
  //       partnerSearch = db.cardsSets.findAll({
  //         where: {
  //           cardId: currentCard.card.id
  //         }, include: [{model: db.user, where: {
  //           id: {[op.not]: req.user.id}}, 
  //           required: true}, 
  //           {model:db.set}]
  //       });
  //     }
  //     Sequelize.Promise.props(partnerSearch).then(printings => {
  //       for (printing in printings) {
  //         let currentPrinting = printings[printing].dataValues;
  //         for (user in printings[printing].dataValues.users) {
  //           let currentUser = currentPrinting.users[user].dataValues;
  //           db.collection.findOne({
  //             raw: true,
  //             where: {
  //               userId: currentUser.id,
  //               cardsSetId: currentPrinting.id,
  //               trade_copies: {
  //                 [op.gt]: 0
  //               }
  //             }
  //           }).then(ownedPrinting => {
  //             // Check if the user already exists as a trade partner
  //             tradePartners.hasOwnProperty(currentUser.id) ? 
  //             // If they do, add the card to their cards list
  //             tradePartners[currentUser.id].cards.push({
  //               cardId: currentCard.id,
  //               cardName: currentCard.card.name,
  //               setId: currentPrinting.set.id,
  //               setTitle: currentPrinting.set.title,
  //               trade_copies: ownedPrinting.trade_copies
  //             }) : 
  //             // If they don't, add the user and their new card
  //             tradePartners[currentUser.id] = {
  //               userId: currentUser.id,
  //               userName: currentUser.username,
  //               cards: [{
  //                 cardId: currentCard.id,
  //                 cardName: currentCard.card.name,
  //                 setId: currentPrinting.set.id,
  //                 setTitle: currentPrinting.set.title,
  //                 trade_copies: ownedPrinting.trade_copies
  //               }]
  //             }
  //           })
  //         }
  //       }
  //     })
  //   }
  //   setTimeout(() => {
  //     const newArray = Object.values(tradePartners).sort((a,b) => {
  //       return a.cards.length - b.cards.length}
  //     ).reverse();
  //     res.send(newArray);
  //   }, 1000)
  // })
// })

router.get("/gathering/provide", verifyToken, (req, res) => {
  db.collection.findAll({
    raw: true,
    attributes: ['userId','owned_copies','trade_copies'],
    where: {
      userId: req.user.id,
      trade_copies: {
        [op.gt]: 0
      }
    },
    include: [
      {model: db.cardsSets, attributes: {exclude: ['createdAt','updatedAt','setId']}, include: [
        {model: db.card, attributes: {exclude: ['createdAt','updatedAt']}, include: [
          {model: db.user, required: true, where: {id: {[op.not]: req.user.id}}, 
          attributes: ['email','username']}
        ]},
        {model: db.set, attributes: ['code','title']}
      ]}
    ]
  }).then(result => {
    tradePartners = {};
    for (userCard in result) {
      let currentUserId = result[userCard]['cardsSet.card.users.id'];
      let currentUsername = result[userCard]['cardsSet.card.users.username'];
      if (tradePartners.hasOwnProperty(currentUserId) &&
      (result[userCard]['cardsSet.id'] === result[userCard]['cardsSet.card.users.wishlist.pref_printing'] ||
      result[userCard]['cardsSet.card.users.wishlist.pref_printing'] === null)) {
        console.log("ALREADY A USER")
        tradePartners[currentUserId].cards.push(result[userCard]);
      } else if (result[userCard]['cardsSet.id'] === result[userCard]['cardsSet.card.users.wishlist.pref_printing'] ||
      result[userCard]['cardsSet.card.users.wishlist.pref_printing'] === null) {
        console.log("MAKING NEW USER")
        tradePartners[currentUserId] = {
          username: currentUsername,
          userId: currentUserId,
          cards: [result[userCard]]
        }
      }
    }
    const newArray = Object.values(tradePartners).sort((a,b) => {
      return b.cards.length - a.cards.length}
    );
    res.send(newArray);
  })
})


// // Find trade partners based on user tradelist
// router.get("/gathering/provide", verifyToken, (req, res) => {
//   let tradePartners = {};
//   // Find the cards in the user's collection that they are wanting to trade
//   db.collection.findAll({
//     where: {
//       userId: req.user.id,
//       trade_copies: {
//         [op.gt]: 0
//       }
//     }, include: [{model: db.cardsSets, include: [db.set]}]
//   }).then(userCollection => {
//     // For each of the printings they want to trade, compare it to all of the wishlists
//     for (printing in userCollection) {
//       let currentPrinting = userCollection[printing].dataValues;
//       let currentSet = currentPrinting.cardsSet.dataValues.set.dataValues;
//       db.wishlist.findAll({
//         where: {
//           userId: {
//             [op.not]: req.user.id
//           }
//         }, include: [db.card, db.user]
//       }).then(wishlists => {
//         for (userWishlist in wishlists) {
//           let currentWishCard = wishlists[userWishlist].dataValues;
//           // For each wishlist item, check if it has a preferred printing
//           if (currentWishCard.pref_printing !== null) {
//             // If the user wants a specific printing, does it match the user's?
//             if (currentPrinting.cardsSetId === currentWishCard.pref_printing) {
//               // If it matches, add the user a tradepartner
//               // Check if the user already exists as a trade partner
//               tradePartners.hasOwnProperty(currentWishCard.userId) ?
//               // If they do, add the card to their cards list
//               tradePartners[currentWishCard.userId].cards.push({
//                 cardId: currentWishCard.cardId,
//                 cardName: currentWishCard.card.dataValues.name,
//                 setId: currentSet.id,
//                 setTitle: currentSet.title,
//                 number_wanted: currentWishCard.number_wanted,
//                 cardPrinting: currentWishCard.pref_printing
//               }) : 
//               // If they don't, add the user and their new card
//               tradePartners[currentWishCard.userId] = {
//                 userId: currentWishCard.userId,
//                 userName: currentWishCard.user.dataValues.username,
//                 cards: [{
//                   cardId: currentWishCard.cardId,
//                   cardName: currentWishCard.card.dataValues.name,
//                   setId: currentSet.id,
//                   setTitle: currentSet.title,
//                   number_wanted: currentWishCard.number_wanted,
//                   cardPrinting: currentWishCard.pref_printing
//                 }]
//               }
//             }
//             // If no preferred printing, find the other versions of the user's printing to match the card
//           } else {
//             if (currentPrinting.cardsSet.cardId === currentWishCard.cardId) {
//               // If it matches, add the user a tradepartner
//               // Check if the user already exists as a trade partner
//               tradePartners.hasOwnProperty(currentWishCard.userId) ?
//               // If they do, add the card to their cards list
//               tradePartners[currentWishCard.userId].cards.push({
//                 cardId: currentWishCard.cardId,
//                 cardName: currentWishCard.card.dataValues.name,
//                 setId: currentSet.id,
//                 setTitle: currentSet.title,
//                 number_wanted: currentWishCard.number_wanted,
//                 cardPrinting: currentWishCard.pref_printing
//               }) : 
//               // If they don't, add the user and their new card
//               tradePartners[currentWishCard.userId] = {
//                 userId: currentWishCard.userId,
//                 userName: currentWishCard.user.dataValues.username,
//                 cards: [{
//                   cardId: currentWishCard.cardId,
//                   cardName: currentWishCard.card.dataValues.name,
//                   setId: currentSet.id,
//                   setTitle: currentSet.title,
//                   number_wanted: currentWishCard.number_wanted,
//                   cardPrinting: currentWishCard.pref_printing
//                 }]
//               }
//             }
//           }
//         }
//       })
//     }
//     setTimeout(() => {
//       const newArray = Object.values(tradePartners).sort((a,b) => {
//         return a.cards.length - b.cards.length}
//       ).reverse();
//       res.send(newArray);
//     }, 1000)
//   })
// });

module.exports = router;