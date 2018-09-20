import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css']
})
export class EditListComponent implements OnInit {
  cardSearch = "";
  editArray = [];
  cardArray = [];


  constructor(private card : CardService, private _auth : AuthService) { }

  ngOnInit() {
    this.card.getLoggedInCollection().subscribe(existingCollection => {
      this.editArray = existingCollection;
      console.log("existingCollection:");
      console.log(existingCollection);
    });
  }

  buttonTest(value) {
    console.log("Value: " + value);
    console.log(this.cardArray[value]);
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
    let cards = this.cardArray;
    this.cardArray = [];
    let obs = this.card.addCardsToCollection(cards);
    obs.subscribe();
  }
}
