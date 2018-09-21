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
    this.card.getLoggedInWishlist().subscribe(wishlist => {
      console.log(wishlist);
    })
  }

  logCardArrayAtIndex(index) {
    console.log(this.cardArray[index]);
  }

  removeFromCardArray(index) {
    this.cardArray.splice(index, 1);
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
        cardResult["preferredPrinting"] = "none";
        cardResult["desiredCopies"] = 1;
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
<<<<<<< HEAD
=======

  submitCardsToCollection() {
    let addCards = this.cardArray;
    let editCards = this.editArray;
    this.cardArray = [];
    this.card.editCardsInCollection(editCards).subscribe();
    let obs = this.card.addCardsToCollection(addCards);
    obs.subscribe();
  }

  removeFromCardArray(index) {
    this.cardArray.splice(index, 1);
  }
>>>>>>> finished unvalidated crud for edit-list and began moving edit-list to edit-collection
}
