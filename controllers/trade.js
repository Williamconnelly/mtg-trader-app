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
    const newArray = Object.values(tradePartners).sort((a,b) => {
      return b.cards.length - a.cards.length}
    );
    res.send(newArray);
  })
})

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
        tradePartners[currentUserId].cards.push(result[userCard]);
      } else if (result[userCard]['cardsSet.id'] === result[userCard]['cardsSet.card.users.wishlist.pref_printing'] ||
      result[userCard]['cardsSet.card.users.wishlist.pref_printing'] === null) {
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

module.exports = router;