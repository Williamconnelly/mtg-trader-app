import { Component, OnInit, Input } from '@angular/core';
import { CardService } from '../card.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css']
})
export class EditCollectionComponent implements OnInit {
  cardSearch = "";
  fullCollection = [];
  collectionArray = [];
  addCard;
  addCardBoolean = false;
  filterBoolean = false;
  filterOptions = {
    name: "",
    colors: {
      White: false,
      Blue: false,
      Black: false,
      Red: false,
      Green: false
    },
    colorless: false,
    superTypes: {
      Legendary: false,
      Snow: false,
      World: false
    },
    types: {
      Artifact: false,
      Creature: false,
      Land: false,
      Enchantment: false,
      Planeswalker: false,
      Instant: false,
      Sorcery: false,
      Tribal: false
    }
  }
  filterColors = Object.keys(this.filterOptions.colors);
  filterSuperTypes = Object.keys(this.filterOptions.superTypes);
  filterTypes = Object.keys(this.filterOptions.types);
  autocomplete = [];

  constructor(private card : CardService, private _auth : AuthService) { }

  ngOnInit() {
    this.card.getLoggedInCollection().subscribe(existingCollection => {
      console.log("existingCollection:");
      console.log(existingCollection);
      for (let i=0; i<existingCollection.length; i++) {
        existingCollection[i] = this.prepareForCollectionArray(existingCollection[i]);
      }
      this.fullCollection = existingCollection;
      this.collectionArray = existingCollection;
    });
  }

  colorChanges(changes) {
    if (changes) {
      this.filterOptions.colorless = false;
    }
    this.filterCollection();
  }

  colorlessChanges(changes) {
    if (changes) {
      this.filterOptions.colors = {
        White: false,
        Blue: false,
        Black: false,
        Red: false,
        Green: false
      }
    }
    this.filterCollection();
  }

  filterCollection() {
    let colorArray = [];
    let superTypeArray =[];
    let typeArray = [];
    let name = this.filterOptions.name;
    this.filterColors.forEach(key => {
      if (this.filterOptions.colors[key]) {
        colorArray.push(key);
      }
    });
    this.filterSuperTypes.forEach(key => {
      if (this.filterOptions.superTypes[key]) {
        superTypeArray.push(key);
      }
    });
    this.filterTypes.forEach(key => {
      if (this.filterOptions.types[key]) {
        typeArray.push(key);
      }
    });
    
    this.collectionArray = this.fullCollection.filter(function(item) {
      if (!item.printing.card.name.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }
      if (this.filterOptions.colorless) {
        if (item.printing.card.colors !== null) {
          return false;
        }
      } else {
        for (let i=0; i<colorArray.length; i++) {
          if (item.printing.card.colors === null || !item.printing.card.colors.includes(colorArray[i])) {
            return false;
          }
        }
      }
      for (let i=0; i<superTypeArray.length; i++) {
        if (item.printing.card.supertypes === null || !item.printing.card.supertypes.includes(superTypeArray[i])) {
          return false;
        }
      }
      for (let i=0; i<typeArray.length; i++) {
        if (!item.printing.card.types.includes(typeArray[i])) {
          return false;
        }
      }

      return true;
    }.bind(this));
  }

  prepareForCollectionArray(collectionItem) {
    for (let i=0; i<collectionItem.printing.card.cardPrintings.length; i++) {
      if (collectionItem.printing.card.cardPrintings[i].id === collectionItem.printing.id) {
        collectionItem["printingInput"] = collectionItem.printing.card.cardPrintings[i];
      }
    }
    collectionItem.foilInput = collectionItem.foil;
    collectionItem["class"] = "";
    return collectionItem
  }

  submitCardSearch() {
    console.log("Searching for " + this.cardSearch);
    let obs = this.card.findCardByName(this.cardSearch);
    let scryObs = this.card.scryfallFindCardByName(this.cardSearch);
    this.cardSearch = "";
    obs.subscribe(cardResult => {
      console.log("Database Card Result")
      console.log(cardResult);
      if (cardResult != null) {
        cardResult["collection"] = {
          printingId: cardResult["cardPrintings"][0],
          owned_copies: 1,
          trade_copies: 0,
          foil: false
        }
        console.log(cardResult);
        this.addCard = cardResult;
      }
    });
  }

  childUpdatePrintingBuffer(index) {
    this.collectionArray[index].class = "updateBuffer";
    console.log(this.collectionArray[index].class);
  }

  childUpdatePrinting(index) {
    console.log("API UPDATE CALL");
    console.log(index);
  }

  childSuccessfulUpdate(index) {
    this.collectionArray[index].class = "updateSuccess";
    setTimeout(() => {
      this.collectionArray[index].class = "updateDone"
    }, 250);
  }

  childUnsuccessfulUpdate(eventObj) {
    console.log("Unsuccessful update");
    console.log(eventObj);
    this.collectionArray[eventObj["index"]].class = "updateUnsuccessful"
    if (eventObj.hasOwnProperty("message")) {
      window.alert(eventObj["message"]);
    }
  }

  deleteCollectionEntry(index, force) {
    // TODO: Add "are you sure" delay
    this.card.deleteCollectionEntry(this.collectionArray[index].id, force).subscribe(data => {
      switch(data["status"]) {
        case "Success":
          let removedItem = this.collectionArray.splice(index, 1);
          this.fullCollection.splice(this.fullCollection.findIndex(element => element === removedItem), 1);
          break;
        case "Pending":
          if (window.confirm(data["message"])) {
            this.deleteCollectionEntry(index, {force:true});
          }
          break;
        case "Fail":
          break;
      }
    })
  }

  submitPrintingToCollection() {
    if (this.addCard !== undefined) {
      let collection = {}
      for (let key in this.addCard["collection"]) {
        collection[key] = this.addCard["collection"][key];
      }
      console.log(collection)
      collection["foil"] = collection["foil"] ? collection["printingId"].foil_version : !collection["printingId"].nonFoil_version
      collection["printingId"] = collection["printingId"].id;
      this.card.addCardToCollection(collection).subscribe(data => {
        if (data["status"] === "Success") {
          this.addCard = undefined;
          let preparedCollection = this.prepareForCollectionArray(data["collection"]);
          this.fullCollection.push(preparedCollection);
          this.filterCollection();
        } else {
          console.log("Unsuccessful submission");
          window.alert(data["message"]);
        }
      });
    }
  }
}