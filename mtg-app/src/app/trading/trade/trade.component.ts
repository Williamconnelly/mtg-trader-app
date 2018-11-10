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
  currentCard: Object = {};
  constructor(private _tradeService: TradeService) { }

  ngOnInit() {
    this._tradeService.getCollection().subscribe(result => {
      this.collection = result;
      console.log(this.collection);
    });
  }
  targetCard(card) {
    this.currentCard = card;
    console.log(this.currentCard);
  }
  addCard() {
    this._tradeService.addToTrade(this.targetCard).subscribe(result => {
      console.log(result);
    });
  }
}
