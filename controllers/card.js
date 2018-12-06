module.exports = function(trie) {
  var express = require('express');
  var db = require("../models");
  var router = express.Router();
  const axios = require("axios");
  const Sequelize = require('sequelize');
  require('dotenv').config();
  
  // Searches for a card by name
  router.post("/name", (req, res) => {
    let name = trie.get(req.body.name);
    db.card.find({
      where: {
        name: name ? name : req.body.name
      }, include: [{
        model: db.printings,
        as: 'cardPrintings',
        include: [db.set]
      }, db.set]
    }).then(card => {
      res.json(card);
    })
  })
  
  // Find a card printing by ID
  router.get("/:id", (req, res) => {
    db.printings.findOne({
      attributes: {exclude: ['createdAt','updatedAt']},
      where: {
        id: req.params.id
      },
      include: [
        {model: db.card, attributes: {exclude: ['createdAt','updatedAt']}},
        {model: db.set, attributes: {exclude: ['createdAt','updatedAt']}}
      ]
    }).then(card => {
      res.json(card);
    })
  })

  return router;
};