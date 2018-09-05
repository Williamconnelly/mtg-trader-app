var express = require('express');
var db = require("./models");
const fs = require('fs');

// var dataSet = fs.readFileSync("NewAllCards.json");

const cardFields = ["layout","name","names","manaCost","cmc","colors","colorIdentity",
"type","supertypes","types","subtypes","rarity","text","power","toughness","loyalty"]

for (card in dataSet) {
  let currentCard = dataSet[card]
  let insertCard = {};
  for (field in cardFields) {
    let property = cardFields[field]
    currentCard.hasOwnProperty(property) ? insertCard[property] = currentCard[property] : insertCard[property] = null;
  }
  db.card.create({
    layout: insertCard.layout,
    name: insertCard.name,
    names: insertCard.names,
    mana_cost: insertCard.manaCost,
    cmc: insertCard.cmc,
    colors: insertCard.colors,
    color_identity: insertCard.colorIdentity,
    type: insertCard.type,
    supertypes: insertCard.supertypes,
    types: insertCard.types,
    subtypes: insertCard.subtypes,
    rarity: insertCard.rarity,
    text: insertCard.text,
    power: insertCard.power,
    toughness: insertCard.toughness,
    loyalty: insertCard.loyalty
  })
}

// Finds cards with a text length of greater than the allowed 400
// const longArray = [];
// for (card in dataSet) {
//   let currentCard = dataSet[card];
//   if (currentCard.hasOwnProperty("text") && currentCard.text.length > 400) {
//     longArray.push([currentCard.name,currentCard.text.length])
//   }
// }
// console.log(longArray);