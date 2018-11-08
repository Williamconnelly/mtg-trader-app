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
    setOptions: [],
    foilOptions: [],
    cardNumberOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  };
  refineProvide = {
    preservedCardSearch: [],
    setOptions: [],
    foilOptions: [],
    cardNumberOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  };
  // asyncTabs: Observable<any>;
  constructor(
    private _gatheringService: GatheringService,
    private _authService: AuthService
  ) {
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
      this.refineAcquire.preservedCardSearch = this.acquire = result;
      this.refineAcquire.setOptions = [];
      this.refineAcquire.foilOptions = [];
      this.refineAcquire.cardNumberOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      this.buildAcquireOptions(result);
    });
    this._gatheringService.searchProvideCard(this.cardSearch).subscribe(result => {
      console.log(result);
      this.refineProvide.preservedCardSearch = this.provide = result;
      this.refineProvide.setOptions = [];
      this.refineProvide.foilOptions = [];
      this.refineProvide.cardNumberOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      this.buildProvideOptions(result);
    });
    this.searchState.searchName = cardString;
    this.searchState.user = false;
    this.searchState.card = true;
  }
  submitUserSearch(userString) {
    console.log(`Searching for ${this.userSearch}`);
    this._gatheringService.searchAcquireUser(userString).subscribe(result => {
      console.log(result);
      this.refineAcquire.preservedCardSearch = this.acquire = result;
      this.buildAcquireOptions(result);
    });
    this._gatheringService.searchProvideUser(userString).subscribe(result => {
      console.log(result);
      this.refineProvide.preservedCardSearch = this.provide = result;
      this.buildProvideOptions(result);
    });
    this.searchState.searchName = userString;
    this.searchState.card = false;
    this.searchState.user = true;
  }
  gather() {
    this._gatheringService.getGatheringAcquire().subscribe(
      res => {
        console.log(res);
        if (res.hasOwnProperty('error')) {
          this._authService.logoutUser();
        } else {
          this.refineAcquire.preservedCardSearch = this.acquire = res;
          this.buildAcquireOptions(res);
        }
      },
      err => console.log(err)
    );
    this._gatheringService.getGatheringProvide().subscribe(
      res => {
        console.log(res);
        if (res.hasOwnProperty('error')) {
          this._authService.logoutUser();
        } else {
          this.refineProvide.preservedCardSearch = this.provide = res;
          this.buildProvideOptions(res);
        }
      },
      err => console.log(err)
    );
  }
  reset() {
    this.searchState.card = this.searchState.user = false;
    this.cardSearch = this.userSearch = '';
    this.refineAcquire.preservedCardSearch = [];
    this.refineAcquire.setOptions = [];
    this.refineAcquire.foilOptions = [];
    this.refineAcquire.cardNumberOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.refineProvide.preservedCardSearch = [];
    this.refineProvide.setOptions = [];
    this.refineProvide.foilOptions = [];
    this.refineProvide.cardNumberOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.gather();
  }
  buildAcquireOptions(data) {
    let largestOffer = 10;
    for (let i = 0; i < data.length; i++) {
      for (let o = 0; o < data[i].cards.length; o++) {
        if (!this.refineAcquire.setOptions.includes(data[i].cards[o]['card.cardPrintings.set.title'])) {
          this.refineAcquire.setOptions.push(data[i].cards[o]['card.cardPrintings.set.title']);
        }
        if (!this.refineAcquire.foilOptions.includes(data[i].cards[o]['card.cardPrintings.users.collection.foil'])) {
          this.refineAcquire.foilOptions.push(data[i].cards[o]['card.cardPrintings.users.collection.foil']);
        }
        if (data[i].cards[o]['card.cardPrintings.users.collection.trade_copies'] > largestOffer) {
          largestOffer = data[i].cards[o]['card.cardPrintings.users.collection.trade_copies'];
        }
      }
      if (largestOffer > this.refineAcquire.cardNumberOptions[this.refineAcquire.cardNumberOptions.length - 1]) {
        this.refineAcquire.cardNumberOptions.push(largestOffer);
      }
    }
  }
  buildProvideOptions(data) {
    let largestOffer = 10;
    for (let i = 0; i < data.length; i++) {
      for (let o = 0; o < data[i].cards.length; o++) {
        if (!this.refineProvide.setOptions.includes(data[i].cards[o]['printing.set.title'])) {
          this.refineProvide.setOptions.push(data[i].cards[o]['printing.set.title']);
        }
        if (!this.refineProvide.foilOptions.includes(data[i].cards[o]['printing.card.users.wishlist.pref_foil'])) {
          this.refineProvide.foilOptions.push(data[i].cards[o]['printing.card.users.wishlist.pref_foil']);
        }
        if (data[i].cards[o]['printing.card.users.wishlist.number_wanted'] > largestOffer) {
          largestOffer = data[i].cards[o]['printing.card.users.wishlist.number_wanted'];
        }
      }
      if (largestOffer > this.refineProvide.cardNumberOptions[this.refineProvide.cardNumberOptions.length - 1]) {
        this.refineProvide.cardNumberOptions.push(largestOffer);
      }
    }
  }
}
