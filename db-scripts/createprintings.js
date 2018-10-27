var db = require("../models");
const fs = require('fs');

var dataSet = JSON.parse(fs.readFileSync("file2999", "utf8"));

var splitCards = {};
var missingSet = {};
var missingName = {};
var createdSplits = [];

var findCardByName = (id) => {
  if (dataSet.hasOwnProperty(id.toString())) {
    if (dataSet[id.toString()].layout === "split") {
      if (createdSplits.includes([dataSet[id.toString()].name,dataSet[id.toString()].set])) {
        findCardByName(++id);
        return;
      } else {
        createdSplits.push([dataSet[id.toString()].name,dataSet[id.toString()].set])
      }
    }
    if (dataSet[id.toString()].layout === "transform" || dataSet[id.toString()].layout === "flip") {
      dataSet[id.toString()].name = dataSet[id.toString()].card_faces[0].name
    }
    db.card.findOne({
      where: {
        name: dataSet[id.toString()].name
      }
    }).then(dbCard => {
      if (dbCard === null) {
        missingName[id.toString()] = dataSet[id.toString()];
        findCardByName(++id)
      } else {
        findSetByName(dbCard, id)
      }
    })
  } else {
    console.log(`--------------------DOES NOT HAVE PROPERTY:${id}`);
    console.log(`--------------------DOES NOT HAVE PROPERTY:${id}`);
    console.log(`--------------------DOES NOT HAVE PROPERTY:${id}`);
    console.log(`--------------------DOES NOT HAVE PROPERTY:${id}`);
    console.log(`--------------------DOES NOT HAVE PROPERTY:${id}`);
    console.log(`--------------------DOES NOT HAVE PROPERTY:${id}`);
    console.log("----------------------------WRITING FILES");
    console.log("----------------------------WRITING FILES");
    console.log("----------------------------WRITING FILES");
    console.log("----------------------------WRITING FILES");

    setTimeout(() => {
      fs.writeFileSync("MissingName", JSON.stringify(missingName))
      fs.writeFileSync("MissingSet", JSON.stringify(missingSet))
      fs.writeFileSync("splitCards", JSON.stringify(splitCards))
      if (id < 47000) {
        dataSet = JSON.parse(fs.readFileSync("file" + (id + 2999).toString(), "utf8"))
        findCardByName(id);
      } else {
        console.log("DONEZO");
      }
    }, 1000)
  }
}

var findSetByName = (dbCard, id) => {
  db.set.findOne({
    where: {
      code: dataSet[id.toString()].set
    }
  }).then(dbSet => {
    if (dbSet === null) {
      missingSet[id.toString()] = dataSet[id.toString()];
      findCardByName(++id);
    } else {
      let newPrinting = {
        cardId: dbCard.id,
        setId: dbSet.id,
        rarity: dataSet[id.toString()].rarity,
        foil_version: dataSet[id.toString()].foil,
        nonFoil_version: dataSet[id.toString()].nonfoil,
        scryfall_url: dataSet[id.toString()].uri,
        backside_img_url: null
      }
      if (dataSet[id.toString()].layout === "transform" && dataSet[id.toString()].hasOwnProperty('card_faces')) {
        newPrinting['img_url'] = dataSet[id.toString()].card_faces[0].image_uris.small;
        newPrinting['backside_img_url'] = dataSet[id.toString()].card_faces[1].image_uris.small;
      } else if (dataSet[id.toString()].layout === "meld") {
        function getKeyByValue(object, value) {
          return Object.keys(object).find(key => object[key] === value);
        }
        let findUrl = relation => {
          for (card in Object.keys(dataSet)) {
            if (dataSet[Object.keys(dataSet)[card]].name === relation) {
              return dataSet[Object.keys(dataSet)[card]].image_uris.small;
            }
          }
        }
        newPrinting['backside_img_url'] = findUrl(dataSet[id.toString()].all_parts[1].name)
        newPrinting['img_url'] = dataSet[id.toString()].image_uris.small;
      } else {
        newPrinting['img_url'] = dataSet[id.toString()].image_uris.small
      }
      db.printings.create(newPrinting)
      findCardByName(++id);
    }
  })
}

findCardByName(0);