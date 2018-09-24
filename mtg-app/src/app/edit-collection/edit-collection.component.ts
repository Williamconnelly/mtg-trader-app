import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-edit-collection',
  templateUrl: './edit-collection.component.html',
  styleUrls: ['./edit-collection.component.css']
})
export class EditCollectionComponent implements OnInit {
  cardSearch = "";
  editArray = [];
  cardArray = [];

  constructor(private card : CardService, private _auth : AuthService) { }

  ngOnInit() {
    this.card.getLoggedInCollection().subscribe(existingCollection => {
      console.log("existingCollection:");
      console.log(existingCollection);
      for (let i=0; i<existingCollection.length; i++) {
        existingCollection[i]["url"] = ""
        existingCollection[i]["newPrintingId"] = existingCollection[i]['collection']["cardsSetId"];
        existingCollection[i]["markedForDeletion"] = false;
        this.card.scryfallFindCardByName(existingCollection[i]['card']['name']).subscribe(scryfallResult => {
          if (scryfallResult.hasOwnProperty("image_uris")) {
            existingCollection[i]["url"] = scryfallResult["image_uris"]["small"];
          }
        })
      }
      this.editArray = existingCollection;
    });
  }

  buttonTest(value) {
    console.log("Value: " + value);
    console.log(this.editArray[value]);
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
        cardResult["url"] = "";
        cardResult["printingInput"] = cardResult["sets"][0];
        cardResult["copies"] = 1;
        cardResult["tradeCopies"] = 0;
        scryObs.subscribe(scryfallResult => {
          console.log("Scryfall Result:")
          console.log(scryfallResult);
          if (scryfallResult.hasOwnProperty("image_uris")) {
            cardResult["url"] = scryfallResult["image_uris"]["small"];
          }
          this.cardArray.push(cardResult);
        })
      }
    });
  }

  submitCardsToCollection() {
    let addCards = this.cardArray;
    let editCards = this.editArray;
    this.cardArray = [];
    this.card.editCardsInCollection(editCards).subscribe();
    this.card.addCardsToCollection(addCards).subscribe();
  }

  removeFromCardArray(index) {
    this.cardArray.splice(index, 1);
  }
}
