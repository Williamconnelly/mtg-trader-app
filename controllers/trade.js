var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const verifyToken = require("../middleware/verifyToken");
require('dotenv').config();

router.get("/gathering/acquire", verifyToken, (req, res) => {
  // Find the wishlist of the logged user
  db.wishlist.findAll({
    raw: true,
    attributes: {exclude: ['id','createdAt','updatedAt']},
    where: {
      userId: req.user.id
    }, include: [
      {model: db.card, required: true, attributes: {exclude: ['createdAt','updatedAt']}, include: [
        {model: db.printings, as: 'cardPrintings', required: true, attributes: {exclude: ['cardId',
        'createdAt','updatedAt']}, include: [
          {model: db.set, attributes: {exclude: ['createdAt','updatedAt']}},
          {model: db.user, required: true, attributes: {exclude: ['password','createdAt','updatedAt']}, 
            through: {where: {trade_copies: {[op.gt]: 0}}}, where: {[op.not]: {id: req.user.id}}}
        ]}
      ]}
    ]
  }).then(result => {
    // Parter Container
    let tradePartners = {};
    // For each card in the wishlist, format the data into different user objects
    for (wishCard in result) {
      let currentUserId = result[wishCard]['card.cardPrintings.users.id'];
      let currentUsername = result[wishCard]['card.cardPrintings.users.username'];
      // If the user already exists AND the printing matches OR has no pref
      if (tradePartners.hasOwnProperty(currentUserId) && 
      (result[wishCard].pref_printing === result[wishCard]['card.cardPrintings.id'] || 
      result[wishCard].pref_printing === null) && 
      (result[wishCard]['card.cardPrintings.users.collection.foil'] === true && result[wishCard]['pref_foil'] === true || 
      result[wishCard]['card.cardPrintings.users.collection.foil'] === false && result[wishCard]['pref_foil'] === false)) {
        tradePartners[currentUserId].cards.push(result[wishCard])
      // If the user does not exist AND the printing matches OR has no pref
      } else if ((result[wishCard].pref_printing === result[wishCard]['card.cardPrintings.id'] || 
      result[wishCard].pref_printing === null) && 
      (result[wishCard]['card.cardPrintings.users.collection.foil'] === true && result[wishCard]['pref_foil'] === true || 
      result[wishCard]['card.cardPrintings.users.collection.foil'] === false && result[wishCard]['pref_foil'] === false)) {
        tradePartners[currentUserId] = {
          username: currentUsername,
          userId: currentUserId,
          cards: [result[wishCard]]
        }
      }
    }
    const newArray = Object.values(tradePartners).sort((a,b) => {
      return b.cards.length - a.cards.length}
    );
    res.send(newArray);
  }).catch(err => {
    res.json({
      error: true,
      message: "Could not complete Gathering: Acquire"
    });
  })
})

router.get("/gathering/provide", verifyToken, (req, res) => {
  db.collection.findAll({
    raw: true,
    attributes: ['userId','owned_copies','trade_copies','foil','card_condition'],
    where: {
      userId: req.user.id,
      trade_copies: {
        [op.gt]: 0
      }
    },
    include: [
      {model: db.printings, attributes: {exclude: ['createdAt','updatedAt','setId','foil_version', 'nonFoil_version']}, include: [
        {model: db.card, attributes: {exclude: ['createdAt','updatedAt']}, include: [
          {model: db.user, required: true, where: {id: {[op.not]: req.user.id}}, 
          attributes: ['email','username']}
        ]},
        {model: db.set, attributes: ['code','title']}
      ]}
    ]
  }).then(result => {
    let tradePartners = {};
    for (userCard in result) {
      let currentUserId = result[userCard]['printing.card.users.id'];
      let currentUsername = result[userCard]['printing.card.users.username'];
      if (tradePartners.hasOwnProperty(currentUserId) &&
      (result[userCard]['printing.id'] === result[userCard]['printing.card.users.wishlist.pref_printing'] ||
      result[userCard]['printing.card.users.wishlist.pref_printing'] === null) && 
      (result[userCard]['printing.card.users.wishlist.pref_foil'] === true && result[userCard]['foil'] === true || 
      result[userCard]['printing.card.users.wishlist.pref_foil'] === false && result[userCard]['foil'] === false)) {
        tradePartners[currentUserId].cards.push(result[userCard]);
      } else if ((result[userCard]['printing.id'] === result[userCard]['printing.card.users.wishlist.pref_printing'] ||
      result[userCard]['printing.card.users.wishlist.pref_printing'] === null) && 
      (result[userCard]['printing.card.users.wishlist.pref_foil'] === true && result[userCard]['foil'] === true || 
      result[userCard]['printing.card.users.wishlist.pref_foil'] === false && result[userCard]['foil'] === false)) {
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
  }).catch(err => {
    res.json({
      error: true,
      message: "Could not complete Gathering: Provide"
    });
  })
})

router.get("/gathering/acquire/card/:name", verifyToken, (req, res) => {
  db.collection.findAll({
    raw: true,
    attributes: ['userId','owned_copies','trade_copies','foil','card_condition'],
    where: {
      userId: {[op.not]: req.user.id},
      trade_copies: {[op.gt]:0}
    }, include: [
      {model: db.printings, required: true, attributes: {exclude: ['createdAt','updatedAt','setId','foil_version', 'nonFoil_version']}, include: [
        {model: db.card, required: true, attributes: {exclude: ['createdAt','updatedAt']}, where: {name: req.params.name}},
        {model: db.set, attributes: ['code','title']}
      ]},
      {model: db.user}
    ]
  }).then(result => {
    let acquirePartners = {};
    for (card in result) {
      let currentUserId = result[card]['user.id'];
      let currentUsername = result[card]['user.username'];
      let userCollection = {
        "card.cardPrintings.set.code": result[card]['printing.set.code'],
        "card.cardPrintings.set.title": result[card]['printing.set.title'],
        "card.cardPrintings.id": result[card]['printing.card.id'],
        "card.name": result[card]['printing.card.name'],
        "card.cardPrintings.users.collection.foil": result[card]['foil'],
        "card.cardPrintings.users.collection.owned_copies": result[card]['owned_copies'],
        "card.cardPrintings.users.collection.trade_copies": result[card]['trade_copies']
      }
      if (acquirePartners.hasOwnProperty(currentUserId)) {
        acquirePartners[currentUserId].cards.push(userCollection);
      } else {
        acquirePartners[currentUserId] = {
          username: currentUsername,
          userId: currentUserId,
          cards: [userCollection]
        }
      }
    }
    const acquireArray = Object.values(acquirePartners).sort((a,b) => {
      return b.cards.length - a.cards.length}
    );
    res.send(acquireArray);
  }).catch(err => {
    res.json({
      error: true,
      message: "Could not find card for ACQUIRE"
    });
  })
})

router.get("/gathering/provide/card/:name", verifyToken, (req, res) => {
  db.wishlist.findAll({
    attributes: {exclude: ['createdAt','updatedAt']},
    where: {
      userId: {[op.not]: req.user.id}
    }, include: [
      {model: db.card, where: {name: req.params.name}, include: [
        {model: db.set}
      ]},
      {model: db.user, required: true, attributes: {exclude: ['password','createdAt','updatedAt']}}
    ]
  }).then(result => {
    let providePartners = {};
    for (card in result) {
      let currentUser = result[card].user;
      let prefInfo = {};
      if (result[card].pref_printing !== null) {
        prefInfo.prefId = result[card].pref_printing;
        for (set in result[card].card.sets) {
          if (result[card].card.sets[set].printings.id === result[card].pref_printing) {
            prefInfo.prefTitle = result[card].card.sets[set].title
          }
        }
      } else {
        prefInfo.prefId = result[card].card.sets[0].printings.id;
        prefInfo.prefTitle = result[card].card.sets[0].title
      }
      let userWishlist = {
        "printing.id": prefInfo.prefId,
        "printing.card.name": result[card].card.name,
        "printing.card.users.wishlist.number_wanted": result[card].number_wanted,
        "printing.card.users.wishlist.pref_printing": result[card].pref_printing,
        "printing.set.title": prefInfo.prefTitle,
        "printing.card.users.wishlist.pref_foil": result[card].pref_foil
      }
      if (providePartners.hasOwnProperty(currentUser.id)) {
        providePartners[currentUser.id].cards.push(userWishlist)
      } else {
        providePartners[currentUser.id] = {
          username: currentUser.username,
          userId: currentUser.id,
          cards: [userWishlist]
        }
      }
    }
    const provideArray = Object.values(providePartners).sort((a,b) => {
      return b.cards.length - a.cards.length}
    );
    res.send(provideArray);
  })
})

// router.get("/gathering/user/:name", verifyToken, (req, res) => {
//   res.json({msg: `YOU FOUND A USER NAMED ${req.params.name}!`});
// })

router.get("/gathering/acquire/user/:name", verifyToken, (req, res) => {
  res.json("HIT ACQUIRE USER");
});

router.get("/gathering/provide/user/:name", verifyToken, (req, res) => {
  res.json("HIT PROVIDE USER");
});

module.exports = router;