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
}
