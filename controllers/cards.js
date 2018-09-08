var express = require('express');
var db = require("../models");
var router = express.Router();
require('dotenv').config();
const axios = require("axios");

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