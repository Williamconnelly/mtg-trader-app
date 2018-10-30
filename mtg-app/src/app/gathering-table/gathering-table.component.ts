import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-gathering-table',
  templateUrl: './gathering-table.component.html',
  styleUrls: ['./gathering-table.component.css']
})
export class GatheringTableComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() Otherdata;
  dataSource = [];
  dataSource2 = [];
  displayedColumns: string[] = ['acquireName', 'set', 'foil', 'trade'];
  displayedColumns2: string[] = ['provideName', 'wanted', 'printing', 'foilPref'];

  constructor() { }

  ngOnInit() {
    this.dataSource = this.data;
    this.dataSource2 = this.Otherdata;
  }
  ngOnChanges(changes) {
    // console.log('CHANGES');
    // console.log(changes);
  }

}
