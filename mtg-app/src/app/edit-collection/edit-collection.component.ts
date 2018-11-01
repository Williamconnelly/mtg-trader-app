import { Component, OnInit, Input } from '@angular/core';
import { EditCardComponent } from '../edit-card/edit-card.component';
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
        for (let x=0; x<existingCollection[i].card.cardPrintings.length; x++) {
          if (existingCollection[i].card.cardPrintings[x].id === existingCollection[i].id) {
            existingCollection[i]["printingInput"] = existingCollection[i].card.cardPrintings[x];
            break;
          }
        }
        existingCollection[i].foilInput = existingCollection[i].collection.foil;
        existingCollection[i]["class"] = "";
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
        cardResult["printingInput"] = cardResult["cardPrintings"][0];
        cardResult["copies"] = 1;
        cardResult["tradeCopies"] = 0;
        cardResult["foilInput"] = false;
        this.cardArray.push(cardResult);
      }
    });
  }

  childUpdatePrintingBuffer(index) {
    this.editArray[index].class = "updateBuffer";
    console.log(this.editArray[index].class);
  }

  childUpdatePrinting(index) {
    console.log("API UPDATE CALL");
    console.log(index);
  }

  childSuccessfulUpdate(index) {
    this.editArray[index].class = "updateSuccess";
    setTimeout(() => {
      this.editArray[index].class = "updateDone"
    }, 250);
  }

  deleteCollectionEntry(index) {
    console.log(index);
  }

  submitCardsToCollection() {
    let addCards = this.cardArray;
    this.cardArray = [];
    this.card.addCardsToCollection(addCards).subscribe();
  }

  removeFromCardArray(index) {
    this.cardArray.splice(index, 1);
  }
}
