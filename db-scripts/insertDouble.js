var db = require("../models");
const fs = require('fs');

// var container = {};

// var dataSet = [];

// const cardFields = ["layout","name","names","manaCost","cmc","colors","colorIdentity",
// "type","supertypes","types","subtypes","text","power","toughness","loyalty"]

// for (card in dataSet) {
//   let currentCard = dataSet[card]
//   let insertCard = {};
//   for (field in cardFields) {
//     let property = cardFields[field]
//     currentCard.hasOwnProperty(property) ? insertCard[property] = currentCard[property] : insertCard[property] = null;
//   }
//   if ((dataSet[card].layout === "double-faced" || dataSet[card].layout === "flip") && 
//   !container.hasOwnProperty(dataSet[card].names)) {
//     let textField;
//     if (dataSet[dataSet[card].names[1]].hasOwnProperty("power")) {
//       textField = `${dataSet[dataSet[card].names[0]].name}\n${dataSet[dataSet[card].names[0]].text}\n${dataSet[dataSet[card].names[1]].name}\n${dataSet[dataSet[card].names[1]].type}\n${dataSet[dataSet[card].names[1]].text}\n${dataSet[dataSet[card].names[1]].power}/${dataSet[dataSet[card].names[1]].toughness}`;
//     } else if (dataSet[dataSet[card].names[1]].hasOwnProperty("loyalty")) {
//       textField = `${dataSet[dataSet[card].names[0]].name}\n${dataSet[dataSet[card].names[0]].text}\n${dataSet[dataSet[card].names[1]].name}\n${dataSet[dataSet[card].names[1]].type}\n${dataSet[dataSet[card].names[1]].text}\n${dataSet[dataSet[card].names[1]].loyalty}`;
//     } else {
//       textField = `${dataSet[dataSet[card].names[0]].name}\n${dataSet[dataSet[card].names[0]].text}\n${dataSet[dataSet[card].names[1]].name}\n${dataSet[dataSet[card].names[1]].type}\n${dataSet[dataSet[card].names[1]].text}`;
//     }
//     container[dataSet[card].names] = {
//       layout: insertCard.layout,
//       name: insertCard.names[0],
//       names: insertCard.names,
//       mana_cost: insertCard.manaCost,
//       cmc: insertCard.cmc,
//       colors: insertCard.colors,
//       color_identity: insertCard.colorIdentity,
//       type: insertCard.type,
//       supertypes: insertCard.supertypes,
//       types: insertCard.types,
//       subtypes: insertCard.subtypes,
//       text: textField,
//       power: insertCard.power,
//       toughness: insertCard.toughness,
//       loyalty: insertCard.loyalty
//     }
//   } 
// }

// setTimeout(() => {
//   fs.writeFileSync("dbDoubleCards.json", JSON.stringify(container));
// }, 10000);

var splitData = JSON.parse(fs.readFileSync("dbDoubleCards.json", "utf8"));

for (card in splitData) {
  db.card.create({
    layout: splitData[card].layout,
    name: splitData[card].name,
    names: splitData[card].names,
    mana_cost: splitData[card].mana_cost,
    cmc: splitData[card].cmc,
    colors: splitData[card].colors,
    color_identity: splitData[card].color_identity,
    type: splitData[card].type,
    supertypes: splitData[card].supertypes,
    types: splitData[card].types,
    subtypes: splitData[card].subtypes,
    text: splitData[card].text,
    power: splitData[card].power,
    toughness: splitData[card].toughness,
    loyalty: splitData[card].loyalty
  })
}