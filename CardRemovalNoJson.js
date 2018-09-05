const fs = require('fs');

var AllCardsJson = fs.readFileSync("AllCards-x.json");
var removedCardsJson = {};
for (var key in AllCardsJson) {
  console.log(key);
    switch(AllCardsJson[key]["layout"]) {
        case "token":
        case "plane":
        case "vanguard":
        case "phenomenon":
        case "scheme":
            removedCardsJson[key] = AllCardsJson[key];
            delete AllCardsJson[key];
            continue;
            break;
        default:
            break;
    }
    let removeBool = false;
    for (let i=0; i<AllCardsJson[key]["printings"].length; i++) {
      let printing = AllCardsJson[key]["printings"][i];
      if (printing == "UST" || printing == "UGL" || printing == "UNH") {
        removeBool = true;
        break;
      }
    }
    if (removeBool) {
        removedCardsJson[key] = AllCardsJson[key];
        delete AllCardsJson[key];
    }
  }

for (var key in removedCardsJson) {
  console.log(key);
}



let data = JSON.stringify(AllCardsJson);  
fs.writeFileSync('NewAllCards.json', data);  