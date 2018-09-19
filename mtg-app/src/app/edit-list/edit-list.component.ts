import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css']
})
export class EditListComponent implements OnInit {
  cardSearch = "";
  cardArray = [];


  constructor(private card : CardService) { }

  ngOnInit() {
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
}
