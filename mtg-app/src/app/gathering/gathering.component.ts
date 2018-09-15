import { Component, OnInit } from '@angular/core';
import { GatheringService } from '../gathering.service';

@Component({
  selector: 'app-gathering',
  templateUrl: './gathering.component.html',
  styleUrls: ['./gathering.component.css']
})
export class GatheringComponent implements OnInit {

  gathering = [];
  constructor(private _gatheringService: GatheringService) { }

  ngOnInit() {
    this._gatheringService.getGatheringWant().subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }

}
