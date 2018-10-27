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
  submitCardSearch() {
    console.log(`Searching for ${this.cardSearch}`);
    this._gatheringService.searchCard(this.cardSearch).subscribe(result => {
      console.log(result);
    });
  }
  submitUserSearch() {
    console.log(`Searching for ${this.userSearch}`);
    this._gatheringService.searchUser(this.userSearch).subscribe(result => {
      console.log(result.msg);
    });
  }
}
