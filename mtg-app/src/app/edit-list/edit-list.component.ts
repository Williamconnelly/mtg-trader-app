import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { CardService } from '../card.service';
import { AuthService } from '../auth.service';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css']
})
export class EditListComponent implements OnInit {
  addCardBoolean = false;
  addCard;
  fullWishlist = [];
  wishlistArray = [];
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

  // TODO: Put in "are you sure" step
  deleteWishlistEntry(id) {
    this.card.deleteWishlistEntry(id).subscribe(data => {
      if (data["status"] === "Success") {
        let findIndex = this.wishlistArray.findIndex(element => element.id === id);
        this.wishlistArray.splice(findIndex, findIndex > -1 ? 1 : 0);
        findIndex = this.fullWishlist.findIndex(element => element.id === id);
        this.fullWishlist.splice(findIndex, findIndex > -1 ? 1 : 0);
      }
    });
  }

  submitCardSearch(cardSearch) {
    console.log(cardSearch);
    let obs = this.card.findCardByName(cardSearch);
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

  childUpdateCardBuffer(emitObj) {
    this.wishlistArray[emitObj.index].class = "updateBuffer"
    console.log(this.wishlistArray[emitObj.index].class);
    switch(emitObj.field) {
      case 'foil':
        this.wishlistArray[emitObj.index].pref_foil = emitObj.value;
        break;
      case 'printing':
        this.wishlistArray[emitObj.index].pref_printing = emitObj.value;
        break;
      default:
        this.wishlistArray[emitObj.index][emitObj.field] = emitObj.value;
        break;
    }
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
    let id = this.fullWishlist.findIndex(element => element.id === eventObj.id);
    setTimeout(() => {
      let id = this.fullWishlist.findIndex(element => element.id === eventObj.id);
      if (id > -1) {
        this.fullWishlist[id].class = "updateDone";
      }
    }, 250)
    if (id > -1) {
      if (eventObj.updateKeys.includes("pref_foil")) {this.fullWishlist[id].pref_foil = eventObj.dbVersion.pref_foil}
      if (eventObj.updateKeys.includes("number_wanted")) {this.fullWishlist[id].number_wanted = eventObj.dbVersion.number_wanted}
      if (eventObj.updateKeys.includes("pref_printing")) {
        if (eventObj.dbVersion.pref_printing === null) {
          this.fullWishlist[id].pref_printing = 'none';
          console.log(this.fullWishlist[id].pref_printing);
        } else {
          let printingIndex = this.fullWishlist[id].card.cardPrintings.findIndex(element => element.id === eventObj.dbVersion.pref_printing);
          this.fullWishlist[id].pref_printing = this.fullWishlist[id].card.cardPrintings[printingIndex];
        }
      }
    }
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
