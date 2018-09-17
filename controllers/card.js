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
      model: db.CardsSets,
      as: 'Printings'
    }]
  }).then(card => {
    res.json(card);
  })
})

// Finds a specific card by ID
router.get("/:id", (req, res) => {
  db.card.find({
    where: {
      id: req.params.id
    }
  }).then(card => {
    res.json(card);
  })
})

module.exports = router;