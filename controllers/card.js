var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
require('dotenv').config();

// Searches for a card by name
router.post("/name", (req, res) => {
  db.card.find({
    where: {
      name: req.body.name
    }, include: [{
      model: db.cardsSets,
      as: 'printings',
      include: [db.set]
    }, db.set]
  }).then(card => {
    res.json(card);
  })
})

// Find a card printing by ID
router.get("/:id", (req, res) => {
  db.cardsSets.findOne({
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

module.exports = router;