module.exports = function(io) {
  var express = require('express');
  var db = require("../models");
  var router = express.Router();
  const axios = require("axios");
  const Sequelize = require('sequelize');
  const op = Sequelize.Op;
  const verifyToken = require('../middleware/verifyToken.js')
  require('dotenv').config();
  
  // Add multiple printings to collection
  router.post("/collection/batch", verifyToken, (req, res) => {
    console.log("ADDING MULTIPLE PRINTINGS TO COLLECTION");
    if (req.body.printings.length > 0) {
      db.user.find({
        where: {
          id: req.user.id
        }
      }).then(user => {
        for (let i=0; i<req.body.printings.length; i++) {
          db.printings.find({
            where: {
              id: req.body.printings[i]["printingInput"]["id"]
            }
          }).then(cardPrinting => {
            if (req.body.printings[i].foilInput) {
              req.body.printings[i].foilInput = req.body.printings[i].printingInput.foil_version
            } else {
              req.body.printings[i].foilInput = !req.body.printings[i].printingInput.nonFoil_version
            }
            user.addPrintings(cardPrinting, {through: {
              owned_copies: req.body.printings[i]["copies"],
              trade_copies: req.body.printings[i]["tradeCopies"],
              foil: req.body.printings[i].foilInput
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
    console.log("UPDATING MULTIPLE PRINTINGS IN COLLECTION");
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
            if (req.body.printings[i].foilInput) {
              req.body.printings[i].foilInput = req.body.printings[i].printingInput.foil_version;
            } else {
              req.body.printings[i].foilInput = !req.body.printings[i].printingInput.nonFoil_version;
            }
            collection.update({
              printingId: req.body.printings[i].printingInput.id,
              owned_copies: req.body.printings[i]['collection']['owned_copies'],
              trade_copies: req.body.printings[i]['collection']['trade_copies'],
              foil: req.body.printings[i].foilInput
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
        model: db.collection,
        include: [{
          model:db.printings,
          include: [{
          model:db.card,
          include: [{
              model: db.printings,
              as: 'cardPrintings',
              include: [db.set]
            }]
          },
          db.set]
        }]
      }]
    }).then(user => {
      res.json(user['collections']);
    })
  })
  
  // Get User's Collection
  router.get("/collection/:id", (req, res) => {
    db.user.find({
      where: {
        // TODO: Get at User differently
        id: req.params.id
      }, include:  [{
        model: db.collection,
        include: [{
          model:db.printings,
          include: [{
              model:db.card
            },
            db.set]
        }]
      }]
    }).then(user => {
      if (user != null && user.hasOwnProperty('collections')) {
        res.json(user['collections']);
      } else {
        res.json({message:'error'});
      }
    })
  })
  
  // Add to Collection
  router.post("/collection", verifyToken, (req, res) => {
    db.collection.find({
      // See if there is already a collection entry that matches printing/foil
      where: {
        userId: req.user.id,
        printingId: req.body.printingId,
        foil: req.body.foil
      }
    }).then(badCollection => {
      if (badCollection === null) {
        req.body.userId = req.user.id;
        db.collection.create(req.body).then(collection =>{
          db.collection.find({
            where: {
              id: collection.id
            }, include:  [{
                model:db.printings,
                include: [{
                model:db.card,
                include: [{
                    model: db.printings,
                    as: 'cardPrintings',
                    include: [db.set]
                  }]
                },
                db.set]
              }]
          }).then(newCollection => {
            res.json({status:"Success", collection:newCollection});
          })
        })
      } else {
        res.json({status:"Fail", message:"You already have that in your collection."})
      }
    })
  })
  
  // Update a collection entry
  router.put("/collection/:id", verifyToken, (req, res) => {
    // Find the collection by id and use header data from token to ensure that they have authority to edit this collection
    db.collection.find({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    }).then(collection => {
      if (collection !== null) {
        // Search for a collection that matches what the update will change the current collection to
        db.collection.find({
          where: {
            id: {[op.not]:collection.id},
            userId: req.user.id,
            printingId: req.body.hasOwnProperty("printingId") ? req.body.printingId : collection.printingId,
            foil: req.body.hasOwnProperty("foil") ? req.body.foil : collection.foil
          }
        }).then(badCollection => {
          if (badCollection === null) {
            // If there is no collection that will have the same printing/foil status as the updated collection item,
            // check to see if any trades will be impacted.
            if (
              req.body.hasOwnProperty("printingId") || 
              req.body.hasOwnProperty("foil") ||
              (req.body.hasOwnProperty("trade_copies") && req.body.trade_copies < collection.trade_copies)
            ) {
              db.tradescollections.findAll({
                where: {
                  collectionId: collection.id
                }
              }).then(tradescollections => {
                if (tradescollections.length > 0) {
                  // Check to see if they have agreed to make the changes, and if so, delete existing tradescollections
                  // that use this collection
                  if (req.body.hasOwnProperty("force")) {
                    for (let i=0; i<tradescollections.length; i++) {
                      // Try and put socket emit here that tells trade room to remove it.
                      io.in("trade" + tradescollections[i].tradeId).emit("removeCard", {collectionId: tradescollections[i].collectionId});
                      tradescollections[i].destroy();
                    }
                    delete req.body.force;
                    collection.update(req.body).then(update => {
                      res.json({status:"Success", update:update});
                    })
                  } else {
                    res.json({
                      status:"Pending",
                      message: `This card will be removed from ${tradescollections.length} trades, are you sure you want to go through with this update?`,
                      collection:collection}
                    );
                  }
                } else {
                  // No trades found for this collection
                  collection.update(req.body).then(update => {
                    res.json({status:"Success", update:update});
                  });
                }
              })
            } else {
              // The update does not have any changes which will alter possible trades
              collection.update(req.body).then(update => {
                res.json({status:"Success", update:update});
              });
            }
          } else {
            res.json({status:"Fail", message:"You already have that in your collection"})
          }
        })
      } else {
        res.json({status:"Fail", message:"Could not find collection with that id"})
      }
    })
  })
  
  router.put("/collection/delete/:id", verifyToken, (req, res) => {
    db.collection.find({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    }).then(collection => {
      if (collection !== null) {
        db.tradescollections.findAll({
          where: {
            collectionId: collection.id
          }
        }).then(tradescollections => {
          if (tradescollections.length > 0) {
            if (req.body.hasOwnProperty("force")) {
              for (let i=0; i<tradescollections.length; i++) {
                io.in("trade" + tradescollections[i].tradeId).emit("removeCard", {collectionId: tradescollections[i].collectionId});
                tradescollections[i].destroy();
              }
              collection.destroy().then(data => {
                res.json({status:"Success", data:data});
              });
            } else {
              res.json({
                status:"Pending",
                message:`Deleting this from your collection will remove it from ${tradescollections.length} trades, are you sure you'd like to delete it?`
              })
            }
          } else {
            collection.destroy().then(data => {
              res.json({status:"Success", data:data});
            });
          }
        })
      } else {
        res.json({status:"Fail", message:"Could not find collection with that id"});
      }
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
            } else {
              if (req.body.cards[i].foil) {
                req.body.cards[i].foil = req.body.cards[i].preferredPrinting.foil_version; 
              } else {
                req.body.cards[i].foil = req.body.cards[i].preferredPrinting.nonFoil_version; 
              }
              req.body.cards[i].preferredPrinting = req.body.cards[i].preferredPrinting.id
              console.log("preferredPrinting: " + req.body.cards[i].preferredPrinting);
            }
            user.addCard(card, {through: {
              pref_foil: req.body.cards[i].foil,
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
            if (req.body.cards[i].wishlist.pref_printing === "none") {
              req.body.cards[i].wishlist.pref_printing = null
            } else {
              if (req.body.cards[i].wishlist.pref_foil) {
                req.body.cards[i].wishlist.pref_foil = req.body.cards[i].wishlist.pref_printing.foil_version;
              } else {
                req.body.cards[i].wishlist.pref_foil = !req.body.cards[i].wishlist.pref_printing.nonFoil_version;
              }
              req.body.cards[i].wishlist.pref_printing = req.body.cards[i].wishlist.pref_printing.id
            }
            wishlist.update({
              pref_printing: req.body.cards[i]["wishlist"]["pref_printing"],
              number_wanted: req.body.cards[i]['wishlist']['number_wanted'],
              pref_foil: req.body.cards[i].wishlist.pref_foil
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
      }, include: [{
        model: db.wishlist,
        include: [{
          model: db.card,
          include: [{
            model: db.printings,
            as: 'cardPrintings',
            include: [db.set]
          }]
        }]
      }]
    }).then(user => {
      res.json(user["wishlists"]);
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
        model: db.wishlist,
        include: [{
          model: db.card,
          include: [{
            model: db.printings,
            as: 'cardPrintings',
            include: [db.set]
          }]
        }]
      }]
    }).then(user => {
      if (user != null && user.hasOwnProperty('wishlists')) {
        res.json(user['wishlists']);
      } else {
        res.json({message:'error'});
      }
    }).catch(err => {
      res.json({
        error: true,
        message: "Could not find wishlist"
      });
    })
  })
  
  // Add to Wishlist
  router.post("/wishlist", verifyToken, (req, res) => {
    db.wishlist.find({
      // See if there is already a wishlist for this card/printing/foil setting.
      where: {
        userId: req.user.id,
        cardId: req.body.cardId,
        pref_foil: req.body.pref_foil,
        pref_printing: req.body.pref_printing
      }
    }).then(badWishlist => {
      console.log(badWishlist);
      console.log("----------------------")
      if (badWishlist === null) {
        console.log("badWishlist is null");
        req.body.userId = req.user.id;
        db.wishlist.create(req.body).then(wishlist => {
          db.wishlist.find({
            where: wishlist.id,
            include: [{
              model: db.card,
              include: [{
                model: db.printings,
                as: 'cardPrintings',
                include: [db.set]
              }]
            }]
          }).then(newWishlist => {
            res.json({status:"Success", wishlist:newWishlist});
          })
        })
      } else {
        res.json({status:"Fail", message:"You already have this on your wishlist"})
      }
    })
  })
  
  // Update a wishlist entry
  router.put("/wishlist/:id", verifyToken, (req, res) => {
    db.wishlist.find({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    }).then(wishlist => {
      if (wishlist !== null) {
        if (req.body.hasOwnProperty("pref_printing") || req.body.hasOwnProperty("pref_foil")) {
          db.wishlist.find({
            where: {
              id: {[op.not]:req.params.id},
              userId: req.user.id,
              cardId: wishlist.cardId,
              pref_printing: req.body.hasOwnProperty("pref_printing") ? req.body.pref_printing : wishlist.pref_printing,
              pref_foil: req.body.hasOwnProperty("pref_foil") ? req.body.pref_foil : wishlist.pref_foil
            }
          }).then(badWishlist => {
            if (badWishlist === null) {
              wishlist.update(req.body).then(update => {
                res.json({
                  status: "Success",
                  update: update
                })
              })
            } else {
              res.json({status:"Fail", message:"You already have that on your wishlist"});
            }
          });
        } else {
          wishlist.update(req.body).then(update => {
            res.json({
              status: "Success",
              update: update
            })
          });
        }
      } else {
        res.json({status: "Fail", message:"Could not find wishlist with that id"});
      }
    })
  });
  
  // Delete a wishlist entry
  router.delete("/wishlist/:id", verifyToken, (req, res) => {
    db.wishlist.find({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    }).then(wishlist => {
      if (wishlist !== null) {
        wishlist.destroy()
        res.json({status:"Success"});
      } else {
        res.json({status:"Fail", message:"Could not find wishlist with that id"});
      }
    })
  })

  return router;
}