import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-gathering-aquire',
  templateUrl: './gathering-aquire.component.html',
  styleUrls: ['./gathering-aquire.component.css']
})
export class GatheringAquireComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() Otherdata;

  constructor() { }

  ngOnInit() {

  }
  ngOnChanges(changes) {
    console.log(changes);
  }

}
