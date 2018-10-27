import { Component, OnInit, Input } from '@angular/core';
import { EditCardComponent } from '../edit-card/edit-card.component';
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
        wishlist[i]["url"] = wishlist[i].cardPrintings[0].img_url;
        if (wishlist[i]["wishlist"]["pref_printing"] === null) {
          wishlist[i]["wishlist"]["pref_printing"] = "none";
        } else {
          for (let x=0; x<wishlist[i].cardPrintings.length ; x++) {
            if (wishlist[i].cardPrintings[x].id === wishlist[i].wishlist.pref_printing) {
              wishlist[i].wishlist.pref_printing = wishlist[i].cardPrintings[x];
              break;
            }
          }
        }
        wishlist[i]["markedForDeletion"] = false;
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
    this.cardSearch = "";
    obs.subscribe(cardResult => {
      console.log("Database Card Result")
      console.log(cardResult);
      if (cardResult != null) {
        cardResult["url"] = cardResult.cardPrintings[0].img_url;
        cardResult["foil"] = false;
        cardResult["preferredPrinting"] = "none";
        cardResult["desiredCopies"] = 1;
        this.cardArray.push(cardResult);
      }
    });
  }

  submitCardsToWishlist() {
    this.card.addCardsToWishlist(this.cardArray).subscribe();
    // OLD EDIT LIST
    // this.card.editCardsInWishlist(this.editArray).subscribe();
  }
}
