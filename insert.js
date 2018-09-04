const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var dataSet = {
  
}

const cardFields = ["layout","name","names","manaCost","cmc","colors","colorIdentity",
"type","supertypes","rarity","text","power","toughness","loyalty"]

for (card in dataSet) {
  let currentCard = dataSet[card]
  let insertCard = {};
  for (field in cardFields) {
    let property = cardFields[field]
    currentCard.hasOwnProperty(property) ? insertCard[property] = currentCard[property] : insertCard[property] = null;
  }
  console.log(insertCard);
}