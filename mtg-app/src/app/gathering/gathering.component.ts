import { Component, OnInit } from '@angular/core';
import { GatheringService } from '../gathering.service';

@Component({
  selector: 'app-gathering',
  templateUrl: './gathering.component.html',
  styleUrls: ['./gathering.component.css']
})
export class GatheringComponent implements OnInit {

  gathering = [];
  condition = false;
  constructor(private _gatheringService: GatheringService) { }

  ngOnInit() {
    this._gatheringService.getGatheringWant().subscribe(
      res => {
        console.log(res);
        console.log(this.gathering);
        this.gathering = res;
        console.log(this.gathering);
      },
      err => console.log(err)
    );
  }
  test() {
    console.log('HIT');
  }
}
