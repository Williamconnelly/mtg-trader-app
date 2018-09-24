var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
const verifyToken = require('../middleware/verifyToken.js')
require('dotenv').config();

// Add multiple cards to collection
router.post("/collection/batch", verifyToken, (req, res) => {
  console.log("ADDING MULTIPLE CARDS TO COLLECTION");
  if (req.body.cards.length > 0) {
    db.user.find({
      where: {
        id: req.user.id
      }
    }).then(user => {
      for (let i=0; i<req.body.cards.length; i++) {
        db.cardsSets.find({
          where: {
            id: req.body.cards[i]["printingInput"]["cardsSets"]["id"]
          }
        }).then(cardPrinting => {
          user.addCardsSets(cardPrinting, {through: {
            owned_copies: req.body.cards[i]["copies"],
            trade_copies: req.body.cards[i]["tradeCopies"]
          }})
        })
      }
      res.json({});
    })
  } else {
    res.json({});
  }
})

// Update multiple entries in a user's collection
router.put("/collection/batch", verifyToken, (req, res) => {
  console.log("UPDATING MULTIPLE CARDS IN COLLECTION");
  if (req.body.printings.length > 0) {
    for (let i=0; i<req.body.printings.length; i++) {
      db.collection.find({
        where: {
          id: req.body.printings[i].collection.id
        }
      }).then(collection => {
        console.log("------------------------------------------------------")
        console.log("------------------------------------------------------")
        if (req.body.printings[i]['markedForDeletion']) {
          console.log(collection['id']);
          console.log("DESTROYED")
          collection.destroy();
        } else {
          collection.update({
            cardsSetId: req.body.printings[i].newPrintingId,
            owned_copies: req.body.printings[i]['collection']['owned_copies'],
            trade_copies: req.body.printings[i]['collection']['trade_copies']
          });
        }
      })
    }
  }
  res.json({});
})

// Get a logged in user's collection for editing
router.get("/collection/loggedin", verifyToken, (req, res) => {
  db.user.find({
    where: {
      id: req.user.id
    }, include:  [{
      model: db.cardsSets,
      include: [{
        model:db.card,
        include: [{
            model: db.cardsSets,
            as: 'printings',
            include: [db.set]
          }]
        },
        db.set]
    }]
  }).then(user => {
    res.json(user['cardsSets']);
  })
})

// Get User's Collection
router.get("/collection/:id", (req, res) => {
  db.user.find({
    where: {
      // TODO: Get at User differently
      id: req.params.id
    }, include: [{
      model: db.cardsSets,
      include: [db.card, db.set]
    }]
  }).then(user => {
    if (user != null && user.hasOwnProperty('cardsSets')) {
      res.json(user['cardsSets']);
    } else {
      res.json({message:'error'});
    }
  })
})

// Add to Collection
router.post("/collection", (req, res) => {
  db.user.find({
    where: {
      // TODO: Get at User differently
      id: req.body.userId
    } 
  }).then(user => {
    db.cardsSets.find({
      where: {
        id: req.body.printingId
      }
    }).then(cardPrinting => {
      user.addCardsSets(cardPrinting, {through: {
        owned_copies: req.body.owned_copies,
        trade_copies: req.body.trade_copies
      }});
    })
  })
})

// Add multiple cards to wishlist
router.post("/wishlist/batch", verifyToken, (req, res) => {
  console.log("router.post '/wishlist/batch'")
  if (req.body.cards.length > 0) {
    db.user.find({
      where: {
        id: req.user.id
      }
    }).then(user => {
      for (let i=0; i<req.body.cards.length; i++) {
        db.card.find({
          where: {
            id: req.body.cards[i]["id"]
          }
        }).then(card => {
          if (req.body.cards[i]["preferredPrinting"] == "none") {
            req.body.cards[i]["preferredPrinting"] = null;
          }
          user.addCard(card, {through: {
            pref_printing: req.body.cards[i]["preferredPrinting"],
            number_wanted: req.body.cards[i]["desiredCopies"]
          }})
        })
      }
      res.json({});
    })
  } else {
    res.json({});
  }
})

// Update multiple entries in a user's wishlist
router.put("/wishlist/batch", verifyToken, (req, res) => {
  console.log("UPDATING MULTIPLE CARDS IN WISHLIST");
  console.log("req.body.cards.length: " + req.body.cards.length);
  if (req.body.cards.length > 0) {
    for (let i=0; i<req.body.cards.length; i++) {
      db.wishlist.find({
        where: {
          id: req.body.cards[i].wishlist.id
        }
      }).then(wishlist => {
        console.log("------------------------------------------------------")
        console.log(wishlist)
        if (req.body.cards[i]['markedForDeletion']) {
          console.log(wishlist['id']);
          console.log("DESTROYED")
          wishlist.destroy();
        } else {
          if (req.body.cards[i].pref_printing === "none") {
            req.body.cards[i].pref_printing = null
          }
          wishlist.update({
            pref_printing: req.body.cards[i]["wishlist"]["pref_printing"],
            number_wanted: req.body.cards[i]['wishlist']['number_wanted']
          });
        }
      })
    }
  }
  res.json({});
})

// Get a logged in user's wishlist for editing
router.get("/wishlist/loggedin", verifyToken, (req, res) => {
  db.user.find({
    where: {
      id: req.user.id
    }, include:  [{
      model: db.card,
      include: [{
            model: db.cardsSets,
            as: 'printings',
            include: [db.set]
        }]
    }]
  }).then(user => {
    res.json(user['cards']);
  })
})

// Get User's Wishlist
router.get("/wishlist/:id", (req, res) => {
  console.log("router.get '/wishlist/:id'");
  console.log("req.params.id: " + req.params.id);
  db.user.find({
    where: {
      // TODO: Get at User differently
      id: req.params.id
    }, include: [{
      model: db.card,
      include: [{
        model: db.cardsSets,
        as: 'printings',
        include: [db.set]
      }]
    }]
  }).then(user => {
    if (user != null && user.hasOwnProperty('cards')) {
      res.json(user['cards']);
    } else {
      res.json({message:'error'});
    }
  })
})

// Add to Wishlist
router.post("/wishlist", (req, res) => {
  db.user.find({
    where: {
      // TODO: Get at User differently
      id: req.body.userId
    }
  }).then(user => {
    db.card.find({
      where: {
        id: req.body.cardId
      }
    }).then(card => {
      user.addCard(card, {through: {
        number_wanted: req.body.number_wanted,
        pref_printing: req.body.pref_printing
      }})
    })
  })
})

module.exports = router;