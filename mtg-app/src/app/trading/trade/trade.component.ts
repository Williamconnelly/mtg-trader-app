import { Component, OnInit, OnDestroy } from '@angular/core';
import { TradeService } from '../trade.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SocketService } from '../../socket.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {
  loggedUser;
  partner;



  socket;
  opened: boolean;
  trade;
  collection = [];
  userOffers: Array<any> = [];
  partnerOffers: Array<any> = [];
  displayToggle: Boolean = false;
  updateBool: Boolean = false;
  currentCard = {
    selection: undefined,
    offerArray: [],
    offerNumber: 1
  };
  comparison: Object = {};

  constructor(
    private _tradeService: TradeService,
    private _route: ActivatedRoute,
    private _socket: SocketService,
    private _auth: AuthService
  ) { }

  ngOnInit() {
    this.socket = this._socket.connect();

    this._tradeService.getCollection().subscribe(result => {
      this.collection = result;
      console.log("full collection")
      console.log(this.collection);

      this.updateTrade();
      this.makeComparison();
    });
  }

  ngOnDestroy() {
    
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
    // console.log(this.currentCard);
    // console.log(this.updateBool);
  }
  targetCardFromOffer(card) {
    for (let i=0; i<this.collection.length; i++) {
      if (card.id === this.collection[i].id) {
        this.targetCard(this.collection[i]);
      }
    }
  }
  addCard() {
    this._tradeService.addToTrade(this.currentCard.selection, this.trade.id, this.currentCard.offerNumber).subscribe(result => {
      console.log("addCard()");
      console.log(result);
      if (result["status"] === "Success") {
        result["trade"]["tradescollections"] = result["trade"]["tradeEntry"][0];
        delete result["trade"]["tradeEntry"];
        this.userOffers.push(result["trade"]);
        // this.updateTrade();
        // this.targetCard(this.currentCard.selection);
        this.updateBool = true;
      } else {
        window.alert(result["msg"]);
      }
    });
  }
  updateCard() {
    console.log("updateCard()")
    console.log(this.currentCard);
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
  updateTrade() {
    this._route.params.subscribe((params: Params) => {
      this._tradeService.getCurrentTrade(params.id).subscribe(result => {
        this.trade = result["trade"];
        if (this.trade.user_a.id === result["myUser"]) {
          this.loggedUser = this.trade.user_a
          this.partner = this.trade.user_b
        } else {
          this.loggedUser = this.trade.user_b
          this.partner = this.trade.user_a
        }
        console.log(this.trade);
        this.getOffers(this.trade.collections);
      });
    });
  }
  getOffers(trade) {
    this.userOffers = [];
    this.partnerOffers = [];
    for (let i = 0; i < trade.length; i++) {
      // TODO: FIND BETTER TARGET FOR CHECKING LOGGED USER ID
      trade[i].userId === this.loggedUser.id ? this.userOffers.push(trade[i]) : this.partnerOffers.push(trade[i]);
    }
    console.log(this.userOffers);
    console.log(this.partnerOffers);
  }
  toggleCardDisplay() {
    this.displayToggle = !this.displayToggle;
  }
  // Temp Method
  makeComparison() {
    this._tradeService.comparePartners(2).subscribe(result => {
      this.comparison = result;
      console.log(this.comparison);
      for (let i = 0; i < this.collection.length; i++) {
        for (let o = 0; o < this.comparison[0].cards.length; o++) {
          if (this.collection[i].printingId === this.comparison[0].cards[o]['printing.id']) {
            this.collection[i].match = true;
          }
        }
      }
      console.log(this.collection);
    });
  }
}
