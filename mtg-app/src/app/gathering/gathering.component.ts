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
  searchData = {
    card: false,
    user: false,
    searchName: ''
  };
  setOptions = [];
  foilOptions = [];
  setSelection = 'all';
  foilSelection = 'all';
  preservedCardSearch = [];
  gathering = [];
  provide = [];
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
      this.preservedCardSearch = this.gathering = result;
      this.setOptions = [];
      this.foilOptions = [];
      for (let user in result) {
        for (let set in result[user].cards) {
          if (!this.setOptions.includes(result[user].cards[set]['card.cardPrintings.set.title'])) {
            this.setOptions.push(result[user].cards[set]['card.cardPrintings.set.title']);
          }
          if (!this.foilOptions.includes(result[user].cards[set]['card.cardPrintings.users.collection.foil'])) {
            this.foilOptions.push(result[user].cards[set]['card.cardPrintings.users.collection.foil']);
          }
        }
      }
      console.log(this.setOptions);
      console.log(this.foilOptions);
    });
    this._gatheringService.searchProvideCard(this.cardSearch).subscribe(result => {
      console.log(result);
      this.provide = result;
    });
    this.searchData.searchName = cardString;
    this.searchData.card = true;
  }
  submitUserSearch(userString) {
    console.log(`Searching for ${this.userSearch}`);
    this._gatheringService.searchAcquireUser(userString).subscribe(result => {
      console.log(result);
      this.gathering = result;
    });
    this._gatheringService.searchProvideUser(userString).subscribe(result => {
      console.log(result);
      this.provide = result;
    });
    this.searchData.searchName = userString;
    this.searchData.user = true;
  }
  gather() {
    this._gatheringService.getGatheringAcquire().subscribe(
      res => {
        if (res.hasOwnProperty('error')) {
          this._authService.logoutUser();
        } else {
          this.gathering = res;
          console.log(this.gathering);
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
    this.searchData.card = this.searchData.user = false;
    this.cardSearch = this.userSearch = '';
    this.gather();
  }
  refineCardSearch() {
    if (this.setSelection === 'all') {
      const refinedData = new Array(this.preservedCardSearch.length);
      for (let i = this.preservedCardSearch.length - 1; i >= 0; i --) {
        refinedData[i] = {username: this.preservedCardSearch[i].username, userId: this.preservedCardSearch[i].userId};
        if (this.foilSelection !== 'all') {
          const refinedCards = this.preservedCardSearch[i].cards.filter(
            card => card['card.cardPrintings.users.collection.foil'] === this.foilSelection
          );
          refinedData[i].cards = refinedCards;
          if (refinedData[i].cards.length < 1) {
            refinedData.splice(refinedData[i], 1);
          }
          this.gathering = refinedData;
        } else {
          this.gathering = this.preservedCardSearch;
        }
      }
    } else {
      const refinedData = new Array(this.preservedCardSearch.length);
      for (let i = this.preservedCardSearch.length - 1; i >= 0; i --) {
        refinedData[i] = {username: this.preservedCardSearch[i].username, userId: this.preservedCardSearch[i].userId};
        let refinedCards = [];
        if (this.foilSelection !== 'all') {
          refinedCards = this.preservedCardSearch[i].cards.filter(
            card => card['card.cardPrintings.set.title'] === this.setSelection &&
            card['card.cardPrintings.users.collection.foil'] === this.foilSelection
          );
        } else {
          refinedCards = this.preservedCardSearch[i].cards.filter(card => card['card.cardPrintings.set.title'] === this.setSelection);
        }
        refinedData[i].cards = refinedCards;
        if (refinedData[i].cards.length < 1) {
          refinedData.splice(refinedData[i], 1);
        }
      }
      this.gathering = refinedData;
    }
  }
  refineByFoil() {

  }
}
