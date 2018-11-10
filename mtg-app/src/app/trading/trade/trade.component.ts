import { Component, OnInit } from '@angular/core';
import { TradeService } from '../trade.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {
  opened: boolean;
  trade: Object;
  collection = [];
  currentCard: Object = {};
  constructor(private _tradeService: TradeService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      this._tradeService.getCurrentTrade(params.id).subscribe(result => {
        this.trade = result;
        console.log(this.trade);
      });
    });
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
    this._tradeService.addToTrade(this.currentCard, this.trade.id).subscribe(result => {
      console.log(result);
    });
  }
}
