import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-trade-display',
  templateUrl: './trade-display.component.html',
  styleUrls: ['./trade-display.component.css']
})
export class TradeDisplayComponent implements OnInit {
  @Input() userCards;
  constructor() { }

  ngOnInit() {
  }

}
