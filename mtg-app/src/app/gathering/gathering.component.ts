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
  searchBool = {
    card: false,
    user: false
  };
  setOptions = [];
  setSelection = 'all';
  testVar = [];

  // asyncTabs: Observable<any>;
  gathering = [];
  provide = [];
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
  submitCardSearch() {
    console.log(`Searching for ${this.cardSearch}`);
    this._gatheringService.searchAcquireCard(this.cardSearch).subscribe(result => {
      console.log(result);
      this.gathering = result;
      this.setOptions = [];
      for (let user in result) {
        for (let set in result[user].cards) {
          if (!this.setOptions.includes(result[user].cards[set]['card.cardPrintings.set.title'])) {
            this.setOptions.push(result[user].cards[set]['card.cardPrintings.set.title']);
          }
        }
      }
      console.log(this.setOptions);
    });
    this._gatheringService.searchProvideCard(this.cardSearch).subscribe(result => {
      console.log(result);
      this.provide = result;
    });
    this.searchBool.card = true;
  }
  submitUserSearch() {
    console.log(`Searching for ${this.userSearch}`);
    this._gatheringService.searchAcquireUser(this.userSearch).subscribe(result => {
      console.log(result);
      this.gathering = result;
    });
    this._gatheringService.searchProvideUser(this.userSearch).subscribe(result => {
      console.log(result);
      this.provide = result;
    });
    this.searchBool.user = true;
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
    this.searchBool.card = this.searchBool.user = false;
    this.cardSearch = this.userSearch = '';
    this.gather();
  }
  refineCardSearch() {
    // console.log('Refined!');
    // console.log(this.setSelection);
    // for (const user in this.gathering) {
    //   // const refinedCards = this.gathering[user].cards.filter(card => card['card.cardPrintings.set.title'] === this.setSelection);
    //   // this.gathering[user].cards = refinedCards;
    //   for (let card in this.gathering[user].cards) {
    //     if (this.gathering[user].cards[card]['card.cardPrintings.set.title'] !== this.setSelection) {
    //       this.gathering[user].cards.splice(this.gathering[user].cards.indexOf(this.gathering[user].cards[card]), 1);
    //     }
    //   }
    //   console.log("BEFORE CUT" + this.gathering[user].username)
    //   console.log(this.gathering);
    //   if (this.gathering[user].cards.length < 1) {
    //     this.gathering.splice(this.gathering.indexOf(this.gathering[user]), 1);
    //   }
    // }
    // console.log("AFTER CUT");
    // console.log(this.gathering);
    this.testVar = new Array(this.gathering.length);
    for (let i = this.gathering.length - 1; i >= 0; i --) {
      this.testVar[i] = {username: this.gathering[i].username, userId: this.gathering[i].userId};
      const refinedCards = this.gathering[i].cards.filter(card => card['card.cardPrintings.set.title'] === this.setSelection);
      this.testVar[i].cards = refinedCards;
      // for (let o = this.gathering[i].cards.length - 1; o >= 0; o --) {
      //   if (this.gathering[i].cards[o]['card.cardPrintings.set.title'] !== this.setSelection) {
      //     console.log(this.gathering[i].cards[o]['card.cardPrintings.set.title']);
      //     console.log(this.gathering[i].cards.splice(this.gathering[i].cards.indexOf(this.gathering[i].cards[o]), 1));
      //   }
      // }
    }
    this.gathering = this.testVar;
    // this.gathering = this.gathering;
    // console.log(this.gathering);
  }
}
