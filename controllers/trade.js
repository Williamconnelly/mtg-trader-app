var express = require('express');
var db = require("../models");
var router = express.Router();
const axios = require("axios");
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const verifyToken = require("../middleware/verifyToken");
const bcrypt = require("bcrypt");
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

router.put("/progress", verifyToken, (req, res) => {
  switch(req.body.action) {
    // User wants to lock trade
    case("lock"):
      // Hash string of combined card offers for future LOCK vs SUBMIT comparison
      const hashLock = bcrypt.hashSync(req.body.cardSet, 12);
      // Update trade state to new user lock
      db.trade.update({
        [`${req.body.role[req.body.role.length - 1]}_lock`]: hashLock},
        {where: {
          id: req.body.tradeId
        }}).then(result => {
          res.send({msg: `${req.body.role} has locked their trade`});
        }).catch(err => {
          res.json({
            error: true,
            status: 401,
            message: `${req.body.role} was unable to lock their trade`
          });
        });
      break;
    // User wants to unlock trade
    case("unlock"):
      // Update trade to unlock user (Set their lock state to NULL)
      db.trade.update({
        [`${req.body.role[req.body.role.length - 1]}_lock`]: null},
        {where: {
          id: req.body.tradeId
        }}).then(result => {
          res.send({msg: `${req.body.role} has unlocked their trade`});
        }).catch(err => {
          res.json({
            error: true,
            status: 401,
            message: `${req.body.role} was unable to unlock their trade`
          });
        });
      break;
    // User wants to submit their final trade
    case("submit"):
      db.trade.findOne({
        where: {
          id: req.body.tradeId
        },
        attributes: {exclude: ['createdAt','updatedAt','b_accept']}
      }).then(currentTrade => {
        // Check if passed ID amalgam matches encrypted lock hash
        if (bcrypt.compareSync(req.body.cardSet, currentTrade[`${req.body.role[req.body.role.length - 1]}_lock`])) {
          // Update appropriate submit column
          db.trade.update({
            [`${req.body.role[req.body.role.length - 1]}_submit`]: true},
            {where: {
              id: req.body.tradeId
            }}).then(result => {
              if (currentTrade.b_submit !== null) {
                res.send({msg: `${req.body.role} has successfully submitted their trade and it can be COMPLETED`, ready: true});
              } else {
                res.send({msg: `${req.body.role} has successfully submitted their trade and it CANNOT be COMPLETED`});
              }
            }).catch(err => {
              res.json({
                error: true,
                status: 401,
                message: `${req.body.role} was unable to submit their trade because they failed to update the trade`
              });
            })
        } else {
          res.json({
            error: true,
            status: 401,
            message: `${req.body.role} was unable to submit their trade because their card strings did not match`
          });
        }
      })
      break;
    default:
      break;
  }
});

router.put("/complete", verifyToken, (req, res) => {
  // Find both user collections for cross-referencing offers
  db.collection.findAll({
    where: {
      [op.or]: [{userId: req.body.trade.a_user}, {userId: req.body.trade.b_user}]
    }, attributes: ['id','printingId','userId','owned_copies','foil']
  }).then(userCollections => {
    // Find both user wishlists for cross-referencing the cards they receive
    db.wishlist.findAll({
      where: {
        [op.or]: [{userId: req.body.trade.a_user}, {userId: req.body.trade.b_user}]
      }, attributes: ['id','userId','cardId','pref_printing','pref_foil','number_wanted']
    }).then(userWishlists => {
      // Recursive function to iterate over each card offered in the trade (Handle both collections and partner's wishlist)
      const handleOffers = cardNum => {
        if (cardNum < req.body.trade.collections.length) {
          let offer = req.body.trade.collections[cardNum];
          let partnerId = offer.userId === req.body.trade.a_user ? req.body.trade.b_user : req.body.trade.a_user;

          // Function checks if the offered card is already in the partner's collection (YES? UPDATE || NO? CREATE)
          const updatePartnerCollection = () => {
            for (let i = 0; i < userCollections.length; i++) {
              if (userCollections[i].userId === partnerId && 
              (offer.printingId === userCollections[i].printingId && offer.foil === userCollections[i].foil)) {
                // UPDATE
                return db.collection.update({
                  owned_copies: (userCollections[i].owned_copies + offer.tradescollections.copies_offered)
                }, {where: {
                  id: userCollections[i].id
                }})
              }
            }
            // CREATE
            return db.user.findOne({
              where: {
                id: partnerId
              }
            }).then(foundUser => {
              db.printings.findOne({
                where: {
                  id: offer.printingId
                }
              }).then(foundPrinting => {
                foundUser.addPrinting(foundPrinting, {through: {
                  owned_copies: offer.tradescollections.copies_offered, 
                  trade_copies: 0, 
                  foil: offer.foil
                }})
              });
            })
          }

          // Function to remove copies of the offered card from the owner's collection
          // Implicitly returns either an update or destroy depending on whether the owner has any copies remaining
          const updateOwnerCollection = (owned, offered) => offered === owned ? 
            db.collection.destroy({where: {id: offer.id}}) : 
            db.collection.update({owned_copies: (owned - offered)}, {where: {id: offer.id}});
          
          // Function to update the partner's wishlist (DESTROY if they recieve all the copies they want, UPDATE if they want more)
          const updatePartnerWishlist = () => {
            for (let o = 0; o < userWishlists.length; o++) {
              // If the partner's Id matches and the foil booleans line up
              if (userWishlists[o].userId === partnerId && userWishlists[o].pref_foil === offer.foil) {
                // If the user wanted a specific printing and they recieved one OR if they did not and recieved a copy of the card
                if (userWishlists[o].pref_printing === null && offer.printing.card.id === userWishlists[o].cardId || 
                userWishlists[o].pref_printing !== null && offer.printingId === userWishlists[o].pref_printing) {
                  return userWishlists[o].number_wanted <= offer.tradescollections.copies_offered ?
                  db.wishlist.destroy({where: {id: userWishlists[o].id}}) :
                  db.wishlist.update({number_wanted: (userWishlists[o].number_wanted - offer.tradescollections.copies_offered)}, {where: {id: userWishlists[o].id}})
                }
              }
            }
          }

          // Update the partner's collection to include the new card or copies
          updatePartnerCollection().then(() => {
            console.log("UPDATED PARTNER'S COLLECTION");
            // Remove copies from the owner's collection after they are 'traded'
            updateOwnerCollection(offer.owned_copies, offer.tradescollections.copies_offered).then(() => {
              console.log("UPDATED OWNER'S COLLECTION");
              // Lower the number of desired copies on the partner's wishlist or delete the row if they got all that they wanted
              updatePartnerWishlist().then(() => {
                console.log("UPDATED PARTNER'S WISHLIST");
                handleOffers(++cardNum);
              })
            })
          });
        } else {
          res.send({msg: "All Offers Handled!", userCollections, userWishlists});
        }
      }
      handleOffers(0);
    })
  })
});

module.exports = router;