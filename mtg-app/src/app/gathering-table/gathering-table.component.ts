import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gathering-table',
  templateUrl: './gathering-table.component.html',
  styleUrls: ['./gathering-table.component.css']
})
export class GatheringTableComponent implements OnInit {
  @Input() data;
  @Input() Otherdata;
  dataSource = [];
  dataSource2 = [];
  displayedColumns: string[] = ['name', 'set', 'trade'];
  displayedColumns2: string[] = ['name', 'wanted', 'printing'];

  constructor() { }

  ngOnInit() {
    this.dataSource = this.data;
    this.dataSource2 = this.Otherdata;
    console.log('this');
    console.log(this.dataSource);
  }

}
