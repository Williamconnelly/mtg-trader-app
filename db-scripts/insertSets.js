var db = require("../models");
const fs = require('fs');

// ---------------------- FOR WRITING SET DATA INTO DB

var sets = JSON.parse(fs.readFileSync("sets-file", "utf8"));
for (set in sets) {
  db.set.create({
    code: sets[set].code,
    title: sets[set].title
  })
}

// ---------------------- FOR CREATING SET OBJECT

// dataSet = {};

// var sets = JSON.parse(fs.readFileSync("sets-file", "utf8"));

// for (card in dataSet) {
//   if (dataSet[card].legalities.vintage !== "not_legal" && 
//       dataSet[card].digital === false && 
//       !sets.hasOwnProperty(dataSet[card].set)) {
//         sets[dataSet[card].set] = {
//           code: dataSet[card].set,
//           title: dataSet[card].set_name
//         }
//   }
// }
// let data = JSON.stringify(sets);
// fs.writeFileSync(`sets-file`, data);