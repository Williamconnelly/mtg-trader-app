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
      for (let i=0; i<wishlist.length; i++) {
        wishlist[i]["url"] = "";
        if (wishlist[i]["preferredPrinting"] === null) {
          wishlist[i]["preferredPrinting"] = "none";
        }
        wishlist[i]["markedForDeletion"] = false;
        this.card.scryfallFindCardByName(wishlist[i]["name"]).subscribe(scryfallData =>{
          // console.log(scryfallData);
          wishlist[i]["url"] = scryfallData["image_uris"]["small"];
        });
      }
      this.editArray = wishlist;
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

  submitCardsToWishlist() {
    this.card.addCardsToWishlist(this.cardArray).subscribe();
    this.card.editCardsInWishlist(this.editArray).subscribe();
  }
}
