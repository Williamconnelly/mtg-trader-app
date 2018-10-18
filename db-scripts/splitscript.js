const fs = require('fs');

dataSet = [];

var container = {};

for (card in dataSet) {
  container[card] = dataSet[card];
  if (Object.keys(container).length === 3000) {
    let data = JSON.stringify(container);
    fs.writeFileSync(`file${card}`, data);
    container = {};
  }
}
let data = JSON.stringify(container);
fs.writeFileSync(`file${card}`, data);