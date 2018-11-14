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
  userOffers: Array<any> = [];
  partnerOffers: Array<any> = [];
  displayToggle: Boolean = false;
  updateBool: Boolean = false;
  currentCard = {
    selection: {},
    offerArray: [],
    offerNumber: 1
  };
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
        this.currentCard.offerNumber = this.trade.collections[i].tradescollections.copies_offered;
      }
    }
    this.currentCard.selection = card;
    this.currentCard.offerArray = Array.from({length: this.currentCard.selection.trade_copies}, (u, i) => i + 1);
    console.log(this.currentCard);
    console.log(this.updateBool);
  }
  addCard() {
    this._tradeService.addToTrade(this.currentCard.selection, this.trade.id, this.currentCard.offerNumber).subscribe(result => {
      console.log(result);
      this.updateTrade();
      // this.targetCard(this.currentCard.selection);
      this.updateBool = true;
    });
  }
  updateCard() {
    this._tradeService.updateCard(this.currentCard.selection, this.trade.id, this.currentCard.offerNumber).subscribe(result => {
      console.log(result);
      this.updateTrade();
    });
  }
  removeCard() {
    this._tradeService.removeCard(this.currentCard.selection, this.trade.id).subscribe(result => {
      console.log(result);
      this.updateTrade();
      this.updateBool = false;
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
