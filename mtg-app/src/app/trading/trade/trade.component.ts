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
  trade: Object = {};
  collection = [];
  currentCard: Object = {};
  userOffers: Array<any> = [];
  partnerOffers: Array<any> = [];
  displayToggle: Boolean = false;
  updateBool: Boolean = false;
  constructor(private _tradeService: TradeService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this._tradeService.getCollection().subscribe(result => {
      this.collection = result;
      console.log(this.collection);
    });
    this.updateTrade();
  }
  targetCard(card) {
    this.updateBool = false;
    for (let i = 0; i < this.trade.collections.length; i++) {
      if (this.trade.collections[i].id === card.id) {
        this.updateBool = true;
      }
    }
    this.currentCard = card;
    console.log(this.currentCard);
    console.log(this.updateBool);
  }
  addCard() {
    this._tradeService.addToTrade(this.currentCard, this.trade.id).subscribe(result => {
      console.log(result);
      this.updateTrade();
      this.getOffers(this.trade.collections);
    });
  }
  getOffers(trade) {
    this.userOffers = [];
    this.partnerOffers = [];
    for (let i = 0; i < trade.length; i++) {
      // TODO: FIND BETTER TARGET FOR CHECKING LOGGED USER ID
      trade[i].userId === this.collection[0].userId ? this.userOffers.push(trade[i]) : this.partnerOffers.push(trade[i]);
    }
    console.log(this.userOffers);
    console.log(this.partnerOffers);
  }
  updateTrade() {
    this._route.params.subscribe((params: Params) => {
      this._tradeService.getCurrentTrade(params.id).subscribe(result => {
        this.trade = result;
        console.log(this.trade);
        this.getOffers(this.trade.collections);
      });
    });
  }
  toggleCardDisplay() {
    this.displayToggle === false ? this.displayToggle = true : this.displayToggle = false;
    console.log(this.displayToggle);
  }
}
