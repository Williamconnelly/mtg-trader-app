var express = require('express');
var db = require("./models");
const fs = require('fs');

// dataSet = {};

// Add Set titles and codes to db

// for (set in dataSet) {
//   if !(dataSet[set].name === "Unstable" || dataSet[set] === "Unhinged" || dataSet[set].name === "Unglued") {
//     db.set.create({
//       title: dataSet[set].name,
//       code: dataSet[set].code
//     })
//   }
// }

// Create Relationships

dataSet = {};

for (card in dataSet) {
  let currentCard = dataSet[card];
  db.card.find({
    where: {
      name: currentCard.name
    }
  }).then(card => {
    for (printing in currentCard.printings) {
      db.set.find({
        where: {
          code: currentCard.printings[printing]
        }
      }).then(set => {
        card.addSet(set);
      })
    }
  })
}