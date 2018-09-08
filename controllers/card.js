var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
require('dotenv').config();

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