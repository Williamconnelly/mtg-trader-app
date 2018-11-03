import { Component, OnInit } from '@angular/core';
import { GatheringService } from '../gathering.service';
import { Observable, Observer} from 'rxjs';
import { AuthService} from '../auth.service';

@Component({
  selector: 'app-gathering',
  templateUrl: './gathering.component.html',
  styleUrls: ['./gathering.component.css']
})
export class GatheringComponent implements OnInit {
  cardSearch = '';
  userSearch = '';
  searchState = {
    card: false,
    user: false,
    searchName: ''
  };
  acquire = [];
  provide = [];
  refineAcquire = {
    preservedCardSearch: [],
    setOptions: ['all'],
    foilOptions: ['all'],
    cardNumberOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  };
  refineProvide = {
    preservedCardSearch: [],
    setOptions: ['all'],
    foilOptions: ['all'],
    cardNumberOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  };
  // asyncTabs: Observable<any>;
  constructor(private _gatheringService: GatheringService, private _authService: AuthService) {
//     this.asyncTabs = Observable.create((observer: Observer<any>) => {
//       setTimeout(() => {
//         observer.next([
// ]);
//       }, 1000);
//     });
  }

  ngOnInit() {
    this.gather();
  }
  submitCardSearch(cardString) {
    console.log(`Searching for ${cardString}`);
    this._gatheringService.searchAcquireCard(cardString).subscribe(result => {
      console.log(result);
      // Update gathering to use the new data and duplicate the data into a separate component variable
      this.refineAcquire.preservedCardSearch = this.acquire = result;
      this.refineAcquire.setOptions = [];
      this.refineAcquire.foilOptions = [];
      this.refineAcquire.cardNumberOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const largestOffer = 10;
      for (let user in result) {
        for (let set in result[user].cards) {
          if (!this.refineAcquire.setOptions.includes(result[user].cards[set]['card.cardPrintings.set.title'])) {
            this.refineAcquire.setOptions.push(result[user].cards[set]['card.cardPrintings.set.title']);
          }
          if (!this.refineAcquire.foilOptions.includes(result[user].cards[set]['card.cardPrintings.users.collection.foil'])) {
            this.refineAcquire.foilOptions.push(result[user].cards[set]['card.cardPrintings.users.collection.foil']);
          }
          if (result[user].cards[set]['card.cardPrintings.users.collection.trade_copies'] > largestOffer) {
            largestOffer = result[user].cards[set]['card.cardPrintings.users.collection.trade_copies'];
          }
        }
      }
      if (largestOffer > this.refineAcquire.cardNumberOptions[this.refineAcquire.cardNumberOptions.length - 1]) {
        this.refineAcquire.cardNumberOptions.push(largestOffer);
      }
      console.log(this.refineAcquire.setOptions);
      console.log(this.refineAcquire.foilOptions);
      console.log(this.refineAcquire.cardNumberOptions);
    });
    this._gatheringService.searchProvideCard(this.cardSearch).subscribe(result => {
      console.log(result);
      this.refineProvide.preservedCardSearch = this.provide = result;
      this.refineProvide.setOptions = [];
      this.refineProvide.foilOptions = [];
      this.refineProvide.cardNumberOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const largestOffer = 10;
      for (let i = 0; i < result.length; i++) {
        for (const card in result[i].cards) {
          if (!this.refineProvide.setOptions.includes(result[i].cards[card]['printing.set.title'])) {
            this.refineProvide.setOptions.push(result[i].cards[card]['printing.set.title']);
          }
          if (!this.refineProvide.foilOptions.includes(result[i].cards[card]['printing.card.users.wishlist.pref_foil'])) {
            this.refineProvide.foilOptions.push(result[i].cards[card]['printing.card.users.wishlist.pref_foil']);
          }
          if (result[i].cards[card]['printing.card.users.wishlist.number_wanted: 1'] > largestOffer) {
            largestOffer = result[i].cards[card]['printing.card.users.wishlist.number_wanted: 1'];
          }
        }
        if (largestOffer > this.refineProvide.cardNumberOptions[this.refineProvide.cardNumberOptions.length - 1]) {
          this.refineProvide.cardNumberOptions.push(largestOffer);
        }
      }
      if (largestOffer > this.refineProvide.cardNumberOptions[this.refineProvide.cardNumberOptions.length - 1]) {
        this.refineProvide.cardNumberOptions.push(largestOffer);
      }
      console.log(this.refineProvide);
    });
    this.searchState.searchName = cardString;
    this.searchState.card = true;
  }
  submitUserSearch(userString) {
    console.log(`Searching for ${this.userSearch}`);
    this._gatheringService.searchAcquireUser(userString).subscribe(result => {
      console.log(result);
      this.acquire = result;
    });
    this._gatheringService.searchProvideUser(userString).subscribe(result => {
      console.log(result);
      this.provide = result;
    });
    this.searchState.searchName = userString;
    this.searchState.user = true;
  }
  gather() {
    this._gatheringService.getGatheringAcquire().subscribe(
      res => {
        if (res.hasOwnProperty('error')) {
          this._authService.logoutUser();
        } else {
          this.acquire = res;
          console.log(this.acquire);
        }
      },
      err => console.log(err)
    );
    this._gatheringService.getGatheringProvide().subscribe(
      res => {
        this.provide = res;
        console.log(this.provide);
      },
      err => console.log(err)
    );
  }
  reset() {
    this.searchState.card = this.searchState.user = false;
    this.cardSearch = this.userSearch = '';
    this.gather();
  }
  // refineCardSearch() {
  //   const refinedData = new Array(this.preservedCardSearch.length);
  //   for (let i = this.preservedCardSearch.length - 1; i >= 0; i --) {
  //     refinedData[i] = {username: this.preservedCardSearch[i].username, userId: this.preservedCardSearch[i].userId};
  //     const refinedCards = this.preservedCardSearch[i].cards.filter(
  //       card => (card['card.cardPrintings.set.title'] === this.setSelection ||
  //               this.setSelection === 'all') &&
  //               (card['card.cardPrintings.users.collection.foil'] === this.foilSelection ||
  //               this.foilSelection === 'all') &&
  //               (card['card.cardPrintings.users.collection.trade_copies'] >= this.cardNumberSelection ||
  //               this.cardNumberSelection === 'all')
  //     );
  //     refinedData[i].cards = refinedCards;
  //     if (refinedData[i].cards.length < 1) {
  //       refinedData.splice(refinedData[i], 1);
  //     }
  //     this.acquire = refinedData;
  //   }
  // }
}
