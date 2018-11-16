var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const verifyToken = require("../middleware/verifyToken");
require('dotenv').config();

// Finds trade
router.post("/current", verifyToken, (req, res) => {
  db.trade.findOne({
    where: {
      id: req.body.id
    }, include: [
      {model: db.collection, include: [
        {model: db.printings, include: [
          {model: db.card}
        ]}
      ]},
      {model: db.user, as:"user_a", attributes: {exclude: ["password", "createdAt", "updatedAt", "email"]}},
      {model: db.user, as:"user_b", attributes: {exclude: ["password", "createdAt", "updatedAt", "email"]}},
      {model: db.message, order: ["createdAt", "ASC"]}
    ]
  }).then(currentTrade => {
    res.json({
      trade:currentTrade,
      myUser: req.user.id
    });
  });
})

// Finds all trades where the user is either a_user or b_user
router.get("/list", verifyToken, (req, res) => {
  db.trade.findAll({
    where: {
      [op.or]: [{a_user: req.user.id}, {b_user: req.user.id}]
    }
  }).then(result => {
    res.json(result);
  })
})

// Finds all trades where the user has been sent a request but has not accepted
router.get("/pending", verifyToken, (req, res) => {
  db.trade.findAll({
    where: {
      b_user: req.user.id,
      b_accept: false
    }
  }).then(result => {
    res.json(result);
  })
})

// Initiates a trade between logged user as a_user and targeted user as b_user. Errors if already existing.
router.get("/initiate/:id", verifyToken, (req, res) => {
  db.trade.findOrCreate({
    where: {
      [op.or]: [{a_user: req.user.id, b_user: req.params.id}, {a_user: req.params.id, b_user: req.user.id}]
    },
    defaults: {
      a_user: req.user.id,
      b_user: req.params.id,
      phase: 0,
      b_accept: false,
      a_lock: null,
      b_lock: null,
      a_submit: null,
      b_submit: null
    }
  }).spread((trade, created) => {
    if (created) {
      res.json({msg: `TRADE CREATED BETWEEN USER ${req.user.id} AND USER ${req.params.id}`})
    } else {
      res.json({
        error: true,
        status: 401,
        message: "A Trade Between Those Two Users Already Exists"
      });
    }
  })  
})

router.get("/collection", verifyToken, (req, res) => {
  db.collection.findAll({
    where: {
      userId: req.user.id,
      trade_copies: {[op.gt]: 0}
    }, include: [
      {model: db.printings, include: [
        {model: db.card}, {model: db.set}
      ]}
    ]
  }).then(result => {
    res.send(result);
  })
})

router.post("/compare", verifyToken, (req, res) => {
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
          {model: db.user, required: true, where: {id: req.body.partnerId}, 
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

router.post("/add", verifyToken, (req, res) => {
  db.tradescollections.findOrCreate({
    where: {
      collectionId: req.body.card.id,
      tradeId: req.body.tradeId
    }, defaults: {
      collectionId: req.body.card.id,
      tradeId: req.body.tradeId,
      copies_offered: req.body.offered
    }
  }).spread((newTrade, created) => {
    if (created) {
      db.collection.findOne({
        where: {
          id: newTrade.collectionId
        }, include: [
          {model: db.printings, include: [
            {model: db.card}
          ]}, 
          {model: db.tradescollections, as: "tradeEntry", where: {
            tradeId: newTrade.tradeId
          }}
        ]
      }).then(collection => {
        res.json({
          status: "Success",
          msg: "Added Card to Trade!",
          trade: collection
        });
      });
      // res.send({
      //   msg: "Added Card to Trade!",
      //   trade: newTrade
      // });
    } else {
      res.json({
        error: true,
        status: 401,
        message: "You have already added that card to this trade!"
      });
    }
  }) 
})

router.put("/update", verifyToken, (req, res) => {
  if (req.body.offered > 0) {
    db.tradescollections.update({
      copies_offered: req.body.offered
    }, {where: {
      collectionId: req.body.card.id,
      tradeId: req.body.tradeId
    }}).then(result => {
      // console.log(result);
      // res.send({msg: `Updated!`});
      db.collection.findOne({
        where: {
          id: req.body.card.id
        }, include: [
          {model: db.printings, include: [
            {model: db.card}
          ]}, 
          {model: db.tradescollections, as: "tradeEntry", where: {
            tradeId: req.body.tradeId
          }}
        ]
      }).then(collection => {
        res.json({
          status: "Success",
          msg: "Updated Card in Trade!",
          trade: collection
        });
      })
    }).catch(err => {
      res.json({
        status: "Failure",
        msg: "Failed to Update Card in Trade",
        err
      });
    }); 
  } else {
    db.tradescollections.findOne({
      where: {
        collectionId: req.body.card.id,
        tradeId: req.body.tradeId
      }
    }).then(currentOffer => {
      currentOffer.destroy();
      res.json({msg: "CARD DELETED BECAUSE OF 0 ENTRIES"});
    });
  }
});

router.post("/remove", verifyToken, (req, res) => {
  db.tradescollections.destroy({
    where: {
      collectionId: req.body.card.id,
      tradeId: req.body.tradeId
    }
  }).then(result => {
    res.json({
      status: "Success",
      msg: "Removed Card from Trade",
      cardRemoved: req.body.card.id
    });
  }).catch(err => {
    res.json({
      status: "Failure",
      msg: "Failed to Remove Card from Trade",
      err
    });
  })
})

router.post("/message", verifyToken, (req, res) => {
  db.message.create(req.body).then(message => {
    if (message != null) {
      res.json({status:"Success", messageObject: message});
    } else {
      res.json({status:"Fail"});
    }
  })
})

module.exports = router;