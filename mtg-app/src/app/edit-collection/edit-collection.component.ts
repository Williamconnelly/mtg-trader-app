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
  collectionArray = [];
  cardArray = [];
  options = [];


  constructor(private card : CardService, private _auth : AuthService) { }

  ngOnInit() {
    this.card.getLoggedInCollection().subscribe(existingCollection => {
      console.log("existingCollection:");
      console.log(existingCollection);
      for (let i=0; i<existingCollection.length; i++) {
        existingCollection[i] = this.prepareForCollectionArray(existingCollection[i]);
      }
      this.collectionArray = existingCollection;
    });
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
        this.cardArray.push(cardResult);
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
    window.alert(eventObj["message"]);
  }

  deleteCollectionEntry(index) {
    // TODO: Add "are you sure" delay
    this.card.deleteCollectionEntry(this.collectionArray[index].id).subscribe(data => {
      if (data['status'] === "Success") {
        this.collectionArray.splice(index, 1);
      }
    })
  }

  submitPrintingToCollection(index) {
    let collection = {}
    for (let key in this.cardArray[index].collection) {
      collection[key] = this.cardArray[index].collection[key];
    }
    console.log(collection)
    collection["foil"] = collection["foil"] ? collection["printingId"].foil_version : !collection["printingId"].nonFoil_version
    collection["printingId"] = collection["printingId"].id;
    this.card.addCardToCollection(collection).subscribe(data => {
      if (data["status"] === "Success") {
        this.cardArray.splice(index, 1);
        this.collectionArray.push(this.prepareForCollectionArray(data["collection"]));
      } else {
        console.log("Unsuccessful submission");
        window.alert(data["message"]);
      }
    });
  }
}
