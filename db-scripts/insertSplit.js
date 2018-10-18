var db = require("../models");
const fs = require('fs');

// 48 Unique Cards --------- 96 Original Split Cards

// var container = {};

// var dataSet = [];

// var setData = JSON.parse(fs.readFileSync("Split-Keys.json", "utf8"));

// var scryData = JSON.parse(fs.readFileSync("splitCards", "utf8"));

// const cardFields = ["layout","name","names","manaCost","cmc","colors","colorIdentity",
// "type","supertypes","types","subtypes","text","power","toughness","loyalty"]

// for (card in dataSet) {
//   let currentCard = dataSet[card]
//   let insertCard = {};
//   for (field in cardFields) {
//     let property = cardFields[field]
//     currentCard.hasOwnProperty(property) ? insertCard[property] = currentCard[property] : insertCard[property] = null;
//   }
//   if ((dataSet[card].layout === "split" || dataSet[card].layout === "aftermath") && !container.hasOwnProperty(dataSet[card].names)) {
//     let comboColors = dataSet[dataSet[card].names[0]].colors.concat(
//       dataSet[dataSet[card].names[1]].colors.filter((item) => {
//         return dataSet[dataSet[card].names[0]].colors.indexOf(item) < 0;
//     }));
//     let comboIdentity = dataSet[dataSet[card].names[0]].colorIdentity.concat(
//       dataSet[dataSet[card].names[1]].colorIdentity.filter((item) => {
//         return dataSet[dataSet[card].names[0]].colorIdentity.indexOf(item) < 0;
//     }));
//     let comboTypes = dataSet[dataSet[card].names[0]].types.concat(
//       dataSet[dataSet[card].names[1]].types.filter((item) => {
//         return dataSet[dataSet[card].names[0]].types.indexOf(item) < 0;
//     }));
//     container[dataSet[card].names] = {
//       layout: insertCard.layout,
//       name: `${insertCard.names[0]} // ${insertCard.names[1]}`,
//       names: insertCard.names,
//       mana_cost: `${dataSet[dataSet[card].names[0]].manaCost} // ${dataSet[dataSet[card].names[1]].manaCost}`,
//       cmc: dataSet[dataSet[card].names[0]].cmc + dataSet[dataSet[card].names[1]].cmc,
//       colors: comboColors,
//       color_identity: comboIdentity,
//       type: `${dataSet[dataSet[card].names[0]].type} // ${dataSet[dataSet[card].names[1]].type}`,
//       supertypes: insertCard.supertypes,
//       types: comboTypes,
//       subtypes: insertCard.subtypes,
//       text: `${dataSet[dataSet[card].names[0]].name}\n${dataSet[dataSet[card].names[0]].text}\n${dataSet[dataSet[card].names[1]].name}\n${dataSet[dataSet[card].names[1]].text}`,
//       power: insertCard.power,
//       toughness: insertCard.toughness,
//       loyalty: insertCard.loyalty
//     }
//   } 
// }

// setTimeout(() => {
//   fs.writeFileSync("dbSplitCards.json", JSON.stringify(container));
// }, 10000);

var splitData = JSON.parse(fs.readFileSync("dbSplitCards.json", "utf8"));

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