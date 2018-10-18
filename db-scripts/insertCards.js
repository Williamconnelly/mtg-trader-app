var express = require('express');
var db = require("../models");
const fs = require('fs');

// dataSet = {"Plains": {
//   "layout": "normal",
//   "name": "Plains",
//   "cmc": 0,
//   "type": "Basic Land — Plains",
//   "supertypes": [
//     "Basic"
//   ],
//   "types": [
//     "Land"
//   ],
//   "subtypes": [
//     "Plains"
//   ],
//   "imageName": "plains",
//   "printings": [
//     "LEA",
//     "LEB",
//     "2ED",
//     "CED",
//     "CEI",
//     "3ED",
//     "4ED",
//     "ICE",
//     "RQS",
//     "pARL",
//     "MIR",
//     "ITP",
//     "5ED",
//     "POR",
//     "pPRE",
//     "TMP",
//     "pJGP",
//     "PO2",
//     "UGL",
//     "pALP",
//     "USG",
//     "ATH",
//     "6ED",
//     "PTK",
//     "pGRU",
//     "S99",
//     "MMQ",
//     "BRB",
//     "pELP",
//     "S00",
//     "INV",
//     "7ED",
//     "ODY",
//     "ONS",
//     "8ED",
//     "MRD",
//     "CHK",
//     "UNH",
//     "9ED",
//     "RAV",
//     "CST",
//     "TSP",
//     "10E",
//     "MED",
//     "LRW",
//     "SHM",
//     "ALA",
//     "DDC",
//     "M10",
//     "HOP",
//     "ME3",
//     "ZEN",
//     "H09",
//     "DDE",
//     "ROE",
//     "ARC",
//     "M11",
//     "DDF",
//     "SOM",
//     "MBS",
//     "DDG",
//     "NPH",
//     "CMD",
//     "M12",
//     "DDH",
//     "ISD",
//     "DDI",
//     "AVR",
//     "PC2",
//     "M13",
//     "RTR",
//     "DDK",
//     "M14",
//     "DDL",
//     "THS",
//     "C13",
//     "MD1",
//     "M15",
//     "DDN",
//     "KTK",
//     "C14",
//     "DD3_DVD",
//     "FRF",
//     "DDO",
//     "DTK",
//     "TPR",
//     "ORI",
//     "DDP",
//     "BFZ",
//     "C15",
//     "DDQ",
//     "SOI",
//     "KLD",
//     "C16",
//     "PCA",
//     "AKH",
//     "CMA",
//     "E01",
//     "HOU",
//     "C17",
//     "XLN",
//     "UST",
//     "RIX",
//     "DOM",
//     "BBD",
//     "CM2",
//     "GS1",
//     "M19",
//     "C18"
//   ],
//   "legalities": [
//     {
//       "format": "Brawl",
//       "legality": "Legal"
//     },
//     {
//       "format": "Commander",
//       "legality": "Legal"
//     },
//     {
//       "format": "Legacy",
//       "legality": "Legal"
//     },
//     {
//       "format": "Modern",
//       "legality": "Legal"
//     },
//     {
//       "format": "Standard",
//       "legality": "Legal"
//     },
//     {
//       "format": "Vintage",
//       "legality": "Legal"
//     }
//   ],
//   "colorIdentity": [
//     "W"
//   ]
// },
// "Island": {
//   "layout": "normal",
//   "name": "Island",
//   "cmc": 0,
//   "type": "Basic Land — Island",
//   "supertypes": [
//     "Basic"
//   ],
//   "types": [
//     "Land"
//   ],
//   "subtypes": [
//     "Island"
//   ],
//   "imageName": "island",
//   "printings": [
//     "LEA",
//     "LEB",
//     "2ED",
//     "CED",
//     "CEI",
//     "3ED",
//     "4ED",
//     "ICE",
//     "RQS",
//     "pARL",
//     "MIR",
//     "ITP",
//     "5ED",
//     "POR",
//     "TMP",
//     "pJGP",
//     "PO2",
//     "UGL",
//     "pALP",
//     "USG",
//     "6ED",
//     "PTK",
//     "pGRU",
//     "S99",
//     "MMQ",
//     "BRB",
//     "pELP",
//     "S00",
//     "BTD",
//     "INV",
//     "7ED",
//     "ODY",
//     "ONS",
//     "8ED",
//     "MRD",
//     "CHK",
//     "UNH",
//     "9ED",
//     "RAV",
//     "CST",
//     "TSP",
//     "10E",
//     "MED",
//     "LRW",
//     "SHM",
//     "ALA",
//     "DD2",
//     "M10",
//     "HOP",
//     "ME3",
//     "ZEN",
//     "H09",
//     "DDE",
//     "ROE",
//     "DPA",
//     "ARC",
//     "M11",
//     "DDF",
//     "SOM",
//     "MBS",
//     "NPH",
//     "CMD",
//     "M12",
//     "DDH",
//     "ISD",
//     "DDI",
//     "AVR",
//     "PC2",
//     "M13",
//     "DDJ",
//     "RTR",
//     "M14",
//     "THS",
//     "C13",
//     "DDM",
//     "M15",
//     "DDN",
//     "KTK",
//     "C14",
//     "DD3_JVC",
//     "FRF",
//     "DDO",
//     "DTK",
//     "TPR",
//     "ORI",
//     "BFZ",
//     "C15",
//     "DDQ",
//     "SOI",
//     "KLD",
//     "C16",
//     "PCA",
//     "DDS",
//     "AKH",
//     "CMA",
//     "E01",
//     "HOU",
//     "C17",
//     "XLN",
//     "DDT",
//     "UST",
//     "RIX",
//     "DDU",
//     "DOM",
//     "BBD",
//     "CM2",
//     "GS1",
//     "M19",
//     "C18"
//   ],
//   "legalities": [
//     {
//       "format": "Brawl",
//       "legality": "Legal"
//     },
//     {
//       "format": "Commander",
//       "legality": "Legal"
//     },
//     {
//       "format": "Legacy",
//       "legality": "Legal"
//     },
//     {
//       "format": "Modern",
//       "legality": "Legal"
//     },
//     {
//       "format": "Standard",
//       "legality": "Legal"
//     },
//     {
//       "format": "Vintage",
//       "legality": "Legal"
//     }
//   ],
//   "colorIdentity": [
//     "U"
//   ]
// },
// "Swamp": {
//   "layout": "normal",
//   "name": "Swamp",
//   "cmc": 0,
//   "type": "Basic Land — Swamp",
//   "supertypes": [
//     "Basic"
//   ],
//   "types": [
//     "Land"
//   ],
//   "subtypes": [
//     "Swamp"
//   ],
//   "imageName": "swamp",
//   "printings": [
//     "LEA",
//     "LEB",
//     "2ED",
//     "CED",
//     "CEI",
//     "3ED",
//     "4ED",
//     "ICE",
//     "RQS",
//     "pARL",
//     "MIR",
//     "ITP",
//     "5ED",
//     "POR",
//     "TMP",
//     "pJGP",
//     "PO2",
//     "UGL",
//     "pALP",
//     "USG",
//     "ATH",
//     "6ED",
//     "PTK",
//     "pGRU",
//     "S99",
//     "MMQ",
//     "BRB",
//     "pELP",
//     "S00",
//     "BTD",
//     "INV",
//     "7ED",
//     "ODY",
//     "DKM",
//     "ONS",
//     "8ED",
//     "MRD",
//     "CHK",
//     "UNH",
//     "9ED",
//     "RAV",
//     "CST",
//     "TSP",
//     "10E",
//     "MED",
//     "LRW",
//     "SHM",
//     "ALA",
//     "DDC",
//     "M10",
//     "HOP",
//     "ME3",
//     "ZEN",
//     "DDD",
//     "H09",
//     "DDE",
//     "ROE",
//     "DPA",
//     "ARC",
//     "M11",
//     "SOM",
//     "MBS",
//     "NPH",
//     "CMD",
//     "M12",
//     "DDH",
//     "ISD",
//     "PD3",
//     "AVR",
//     "PC2",
//     "M13",
//     "DDJ",
//     "RTR",
//     "DDK",
//     "M14",
//     "THS",
//     "C13",
//     "DDM",
//     "MD1",
//     "M15",
//     "DDN",
//     "KTK",
//     "C14",
//     "DD3_DVD",
//     "DD3_GVL",
//     "FRF",
//     "DTK",
//     "TPR",
//     "ORI",
//     "DDP",
//     "BFZ",
//     "C15",
//     "DDQ",
//     "SOI",
//     "DDR",
//     "KLD",
//     "C16",
//     "PCA",
//     "AKH",
//     "CMA",
//     "E01",
//     "HOU",
//     "C17",
//     "XLN",
//     "UST",
//     "RIX",
//     "DOM",
//     "BBD",
//     "CM2",
//     "M19",
//     "C18"
//   ],
//   "legalities": [
//     {
//       "format": "Brawl",
//       "legality": "Legal"
//     },
//     {
//       "format": "Commander",
//       "legality": "Legal"
//     },
//     {
//       "format": "Legacy",
//       "legality": "Legal"
//     },
//     {
//       "format": "Modern",
//       "legality": "Legal"
//     },
//     {
//       "format": "Standard",
//       "legality": "Legal"
//     },
//     {
//       "format": "Vintage",
//       "legality": "Legal"
//     }
//   ],
//   "colorIdentity": [
//     "B"
//   ]
// },
// "Mountain": {
//   "layout": "normal",
//   "name": "Mountain",
//   "cmc": 0,
//   "type": "Basic Land — Mountain",
//   "supertypes": [
//     "Basic"
//   ],
//   "types": [
//     "Land"
//   ],
//   "subtypes": [
//     "Mountain"
//   ],
//   "imageName": "mountain",
//   "printings": [
//     "LEA",
//     "LEB",
//     "2ED",
//     "CED",
//     "CEI",
//     "ARN",
//     "3ED",
//     "4ED",
//     "ICE",
//     "RQS",
//     "pARL",
//     "MIR",
//     "ITP",
//     "5ED",
//     "POR",
//     "TMP",
//     "pJGP",
//     "PO2",
//     "UGL",
//     "pALP",
//     "USG",
//     "ATH",
//     "6ED",
//     "PTK",
//     "pGRU",
//     "S99",
//     "MMQ",
//     "BRB",
//     "pELP",
//     "S00",
//     "BTD",
//     "INV",
//     "7ED",
//     "ODY",
//     "DKM",
//     "ONS",
//     "8ED",
//     "MRD",
//     "CHK",
//     "UNH",
//     "9ED",
//     "RAV",
//     "CST",
//     "TSP",
//     "10E",
//     "MED",
//     "LRW",
//     "EVG",
//     "SHM",
//     "ALA",
//     "DD2",
//     "M10",
//     "HOP",
//     "ME3",
//     "ZEN",
//     "H09",
//     "DDE",
//     "ROE",
//     "DPA",
//     "ARC",
//     "M11",
//     "SOM",
//     "PD2",
//     "MBS",
//     "DDG",
//     "NPH",
//     "CMD",
//     "M12",
//     "DDH",
//     "ISD",
//     "DDI",
//     "AVR",
//     "PC2",
//     "M13",
//     "DDJ",
//     "RTR",
//     "DDK",
//     "M14",
//     "DDL",
//     "THS",
//     "C13",
//     "M15",
//     "DDN",
//     "KTK",
//     "C14",
//     "DD3_EVG",
//     "DD3_JVC",
//     "FRF",
//     "DTK",
//     "TPR",
//     "ORI",
//     "DDP",
//     "BFZ",
//     "C15",
//     "SOI",
//     "KLD",
//     "C16",
//     "PCA",
//     "DDS",
//     "AKH",
//     "CMA",
//     "E01",
//     "HOU",
//     "C17",
//     "XLN",
//     "DDT",
//     "UST",
//     "RIX",
//     "DDU",
//     "DOM",
//     "BBD",
//     "CM2",
//     "GS1",
//     "M19",
//     "C18"
//   ],
//   "legalities": [
//     {
//       "format": "Brawl",
//       "legality": "Legal"
//     },
//     {
//       "format": "Commander",
//       "legality": "Legal"
//     },
//     {
//       "format": "Legacy",
//       "legality": "Legal"
//     },
//     {
//       "format": "Modern",
//       "legality": "Legal"
//     },
//     {
//       "format": "Standard",
//       "legality": "Legal"
//     },
//     {
//       "format": "Vintage",
//       "legality": "Legal"
//     }
//   ],
//   "colorIdentity": [
//     "R"
//   ]
// },
// "Forest": {
//   "layout": "normal",
//   "name": "Forest",
//   "cmc": 0,
//   "type": "Basic Land — Forest",
//   "supertypes": [
//     "Basic"
//   ],
//   "types": [
//     "Land"
//   ],
//   "subtypes": [
//     "Forest"
//   ],
//   "imageName": "forest",
//   "printings": [
//     "LEA",
//     "LEB",
//     "2ED",
//     "CED",
//     "CEI",
//     "3ED",
//     "4ED",
//     "ICE",
//     "RQS",
//     "pARL",
//     "MIR",
//     "ITP",
//     "5ED",
//     "POR",
//     "TMP",
//     "pJGP",
//     "PO2",
//     "UGL",
//     "pALP",
//     "USG",
//     "ATH",
//     "6ED",
//     "PTK",
//     "pGRU",
//     "S99",
//     "MMQ",
//     "BRB",
//     "pELP",
//     "S00",
//     "BTD",
//     "INV",
//     "7ED",
//     "ODY",
//     "DKM",
//     "ONS",
//     "8ED",
//     "MRD",
//     "CHK",
//     "UNH",
//     "9ED",
//     "RAV",
//     "CST",
//     "TSP",
//     "10E",
//     "MED",
//     "LRW",
//     "EVG",
//     "SHM",
//     "ALA",
//     "M10",
//     "HOP",
//     "ME3",
//     "ZEN",
//     "DDD",
//     "H09",
//     "DDE",
//     "ROE",
//     "DPA",
//     "ARC",
//     "M11",
//     "SOM",
//     "MBS",
//     "DDG",
//     "NPH",
//     "CMD",
//     "M12",
//     "DDH",
//     "ISD",
//     "AVR",
//     "PC2",
//     "M13",
//     "DDJ",
//     "RTR",
//     "M14",
//     "DDL",
//     "THS",
//     "C13",
//     "DDM",
//     "M15",
//     "KTK",
//     "C14",
//     "DD3_EVG",
//     "DD3_GVL",
//     "FRF",
//     "DDO",
//     "DTK",
//     "TPR",
//     "ORI",
//     "DDP",
//     "BFZ",
//     "C15",
//     "SOI",
//     "DDR",
//     "KLD",
//     "C16",
//     "PCA",
//     "DDS",
//     "AKH",
//     "CMA",
//     "E01",
//     "HOU",
//     "C17",
//     "XLN",
//     "UST",
//     "RIX",
//     "DDU",
//     "DOM",
//     "BBD",
//     "CM2",
//     "GS1",
//     "M19",
//     "C18"
//   ],
//   "legalities": [
//     {
//       "format": "Brawl",
//       "legality": "Legal"
//     },
//     {
//       "format": "Commander",
//       "legality": "Legal"
//     },
//     {
//       "format": "Legacy",
//       "legality": "Legal"
//     },
//     {
//       "format": "Modern",
//       "legality": "Legal"
//     },
//     {
//       "format": "Standard",
//       "legality": "Legal"
//     },
//     {
//       "format": "Vintage",
//       "legality": "Legal"
//     }
//   ],
//   "colorIdentity": [
//     "G"
//   ]
// },
// "Steamflogger Boss": {
//   "layout": "normal",
//   "name": "Steamflogger Boss",
//   "manaCost": "{3}{R}",
//   "cmc": 4,
//   "colors": [
//     "Red"
//   ],
//   "type": "Creature — Goblin Rigger",
//   "types": [
//     "Creature"
//   ],
//   "subtypes": [
//     "Goblin",
//     "Rigger"
//   ],
//   "text": "Other Riggers you control get +1/+0 and have haste.\nIf a Rigger you control would assemble a Contraption, it assembles two Contraptions instead.",
//   "power": "3",
//   "toughness": "3",
//   "imageName": "steamflogger boss",
//   "printings": [
//     "FUT",
//     "UST"
//   ],
//   "legalities": [
//     {
//       "format": "Commander",
//       "legality": "Legal"
//     },
//     {
//       "format": "Legacy",
//       "legality": "Legal"
//     },
//     {
//       "format": "Modern",
//       "legality": "Legal"
//     },
//     {
//       "format": "Vintage",
//       "legality": "Legal"
//     }
//   ],
//   "colorIdentity": [
//     "R"
//   ]
// }};

dataSet = [];

const cardFields = ["layout","name","names","manaCost","cmc","colors","colorIdentity",
"type","supertypes","types","subtypes","text","power","toughness","loyalty"]

var loop = (id) => {
  if (id < Object.keys(dataSet).length) {
    let currentCard = dataSet[Object.keys(dataSet)[id]];
    if (currentCard.layout === "split" || currentCard.layout === "aftermath" || 
        currentCard.layout === "double-faced" || currentCard.layout === "flip") {
      loop(++id)
    } else {
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
        text: insertCard.text,
        power: insertCard.power,
        toughness: insertCard.toughness,
        loyalty: insertCard.loyalty
      }).then(()=>{
        loop(++id);
      })
    }
  } else {
    console.log("DONEZO: " + id);
  }
}

loop(0);

// Probably out of date garbage

// for (card in dataSet) {
//   let currentCard = dataSet[card]
//   let insertCard = {};
//   for (field in cardFields) {
//     let property = cardFields[field]
//     currentCard.hasOwnProperty(property) ? insertCard[property] = currentCard[property] : insertCard[property] = null;
//   }
//   db.card.create({
//     layout: insertCard.layout,
//     name: insertCard.name,
//     names: insertCard.names,
//     mana_cost: insertCard.manaCost,
//     cmc: insertCard.cmc,
//     colors: insertCard.colors,
//     color_identity: insertCard.colorIdentity,
//     type: insertCard.type,
//     supertypes: insertCard.supertypes,
//     types: insertCard.types,
//     subtypes: insertCard.subtypes,
//     text: insertCard.text,
//     power: insertCard.power,
//     toughness: insertCard.toughness,
//     loyalty: insertCard.loyalty
//   })
// }