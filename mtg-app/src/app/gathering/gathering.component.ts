import { Component, OnInit } from '@angular/core';
import { GatheringService } from '../gathering.service';
import { Observable, Observer} from 'rxjs';

@Component({
  selector: 'app-gathering',
  templateUrl: './gathering.component.html',
  styleUrls: ['./gathering.component.css']
})
export class GatheringComponent implements OnInit {

  // asyncTabs: Observable<any>;
  gathering = [];
  provide = [];
  constructor(private _gatheringService: GatheringService) {
//     this.asyncTabs = Observable.create((observer: Observer<any>) => {
//       setTimeout(() => {
//         observer.next([
// ]);
//       }, 1000);
//     });
  }

  ngOnInit() {
    this._gatheringService.getGatheringWant().subscribe(
      res => {
        console.log(res);
        this.gathering = res;
        console.log(this.gathering);
      },
      err => console.log(err)
    );
    this._gatheringService.getGatheringProvide().subscribe(
      res => {
        console.log(res);
        this.provide = res;
        console.log(this.provide);
      },
      err => console.log(err)
    );
  }
}
