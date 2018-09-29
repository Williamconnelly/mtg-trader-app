import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gathering-aquire',
  templateUrl: './gathering-aquire.component.html',
  styleUrls: ['./gathering-aquire.component.css']
})
export class GatheringAquireComponent implements OnInit {
  @Input() data;
  @Input() Otherdata;

  constructor() { }

  ngOnInit() {

  }

}
