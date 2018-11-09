import { Component, OnInit } from '@angular/core';
import { TradeService } from '../trade.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {
  opened: boolean;
  collection = [];
  constructor(private _tradeService: TradeService) { }

  ngOnInit() {
    this._tradeService.getCollection().subscribe(result => {
      this.collection = result;
      console.log(this.collection);
    });
  }

}
