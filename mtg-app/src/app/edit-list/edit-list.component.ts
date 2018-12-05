import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CardService } from '../card.service';
import { AuthService } from '../auth.service';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css']
})
export class EditListComponent implements OnInit {
  cardSearch = "";
  addCardBoolean = false;
  addCard;
  fullWishlist = [];
  wishlistArray = [];
  cardArray = [];
  autocomplete = [];
  autocompleteTimer;
  @ViewChild("filter") filter : FilterComponent;

  constructor(private card : CardService, private _auth : AuthService) { }

  ngOnInit() {
    this.card.getLoggedInWishlist().subscribe(wishlist => {
      console.log(wishlist);
      for (let i=0; i<wishlist.length; i++) {
        wishlist[i] = this.prepareForWishlistArray(wishlist[i]);
      }
      this.fullWishlist = wishlist;
      this.wishlistArray = wishlist;
    })
  }

  autocompleteBuffer() {
    let cardSearch = this.cardSearch;
    if (this.autocompleteTimer !== undefined) {
      clearTimeout(this.autocompleteTimer);
    }
    if (cardSearch.length >= 3) {
      this.autocompleteTimer = setTimeout(function() {
        this.card.autocomplete(cardSearch).subscribe(data => {
          this.autocomplete = data;
        })
      }.bind(this), 750);
    } else {
      this.autocomplete = [];
    }
  }

  prepareForWishlistArray(wishlistItem) {
    wishlistItem["url"] = wishlistItem.card.cardPrintings[0].img_url;
    wishlistItem["revertIndicator"] = false;
    wishlistItem["class"] = "";
    if (wishlistItem["pref_printing"] === null) {
      wishlistItem["pref_printing"] = "none";
    } else {
      for (let i=0; i<wishlistItem.card.cardPrintings.length; i++) {
        if (wishlistItem["pref_printing"] === wishlistItem.card.cardPrintings[i].id) {
          wishlistItem["pref_printing"] = wishlistItem.card.cardPrintings[i];
          break;
        }
      }
    }
    return wishlistItem
  }

  logCardArrayAtIndex(index) {
    console.log(this.cardArray[index]);
  }

  // TODO: Put in "are you sure" step
  deleteWishlistEntry(index) {
    console.log(index);
    this.card.deleteWishlistEntry(this.wishlistArray[index].id).subscribe(data => {
      if (data["status"] === "Success") {
        let removedItem = this.wishlistArray.splice(index, 1)[0];
        this.fullWishlist.splice(this.fullWishlist.findIndex(element => element.id === removedItem.id),1);
      }
    });
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
        cardResult["wishlist"] = {
          cardId: cardResult.id,
          pref_foil: false,
          pref_printing: "none",
          number_wanted: 1
        }
        console.log(cardResult);
        this.addCard = cardResult;
      }
    });
  }

  childUpdateCardBuffer(index) {
    this.wishlistArray[index].class = "updateBuffer"
    console.log(this.wishlistArray[index].class);
  }

  childUpdateCard(index) {
    
  }

  childSuccessfulUpdate(index) {
    this.wishlistArray[index].class = "updateSuccess";
    setTimeout(() => {
      this.wishlistArray[index].class = "updateDone"
    }, 250);
  }

  childUnsuccessfulUpdate(eventObj) {
    this.wishlistArray[eventObj["index"]].class = "updateUnsuccessful"
    window.alert(eventObj["message"]);
  }

  submitCardToWishlist() {
    let wishlist = {};
    for (let key in this.addCard.wishlist) {
      wishlist[key] = this.addCard.wishlist[key]
    }
    wishlist["pref_foil"] = wishlist["pref_printing"] === "none" ? wishlist["pref_foil"] : wishlist["pref_foil"] ? wishlist["pref_printing"].foil_version : !wishlist["pref_printing"].nonFoil_version;
    wishlist["pref_printing"] = wishlist["pref_printing"] === "none" ? null : wishlist["pref_printing"].id
    this.card.addCardToWishlist(wishlist).subscribe(data => {
      console.log(data);
      if (data["status"] === "Success") {
        console.log(data["wishlist"]);
        this.addCard = undefined;
        this.fullWishlist.push(this.prepareForWishlistArray(data["wishlist"]));
        this.filter.filterCards();
      }
    });
  }
}
