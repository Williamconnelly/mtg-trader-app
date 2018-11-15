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
  roomName;

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
    this.socket.on('addCard', this.roomTest.bind(this));
    this._tradeService.getCollection().subscribe(result => {
      this.collection = result;
      console.log('full collection');
      console.log(this.collection);
      this._route.params.subscribe((params: Params) => {
        this.roomName = 'trade' + params.id;
        this.socket.emit('joinRoom', {roomName: this.roomName});
        this.socket.on('room', this.roomTest.bind(this));
      });
      this.updateTrade();
      // this.makeComparison();
    });
  }

  ngOnDestroy() {

  }

  roomTest(data) {
    console.log('roomTest()');
    console.log(data);
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
    for (let i = 0; i < this.collection.length; i++) {
      if (card.id === this.collection[i].id) {
        this.targetCard(this.collection[i]);
      }
    }
  }
  addCard() {
    this._tradeService.addToTrade(this.currentCard.selection, this.trade.id, this.currentCard.offerNumber).subscribe(result => {
      console.log('addCard()');
      console.log(result);
      if (result['status'] === 'Success') {
        result['trade']['tradescollections'] = result['trade']['tradeEntry'][0];
        delete result['trade']['tradeEntry'];
        this.userOffers.push(result['trade']);
        // this.updateTrade();
        // this.targetCard(this.currentCard.selection);
        this.socket.emit('addCard', {
          roomName: this.roomName,
          tradescollectionsId: result['trade']['tradescollections'].id
        });
        this.updateBool = true;
      } else {
        window.alert(result['msg']);
      }
    });
  }
  updateCard() {
    console.log('updateCard()');
    console.log(this.currentCard);
    this._tradeService.updateCard(this.currentCard.selection, this.trade.id, this.currentCard.offerNumber).subscribe(result => {
      console.log(result);
      if (result.status === 'Success') {
        result.trade.tradescollections = result.trade.tradeEntry[0];
        delete result.trade.tradeEntry;
        for (let offer in this.userOffers) {
          if (this.userOffers[offer].id === result.trade.id) {
            this.userOffers[offer] = result.trade;
          }
        }
        console.log(this.userOffers);
      }
    });
  }
  removeCard() {
    this._tradeService.removeCard(this.currentCard.selection, this.trade.id).subscribe(result => {
      console.log(result);
      // REMOVE CARD FROM USEROFFERS
      // this.updateTrade();
      if (result['status'] === 'Success') {
        for (let offer in this.userOffers) {
          if (this.userOffers[offer].id === result['cardRemoved']) {
            this.userOffers.splice(offer, 1);
          }
        }
        console.log(this.userOffers);
      }
      this.updateBool = false;
    });
  }
  updateTrade() {
    this._route.params.subscribe((params: Params) => {
      this._tradeService.getCurrentTrade(params.id).subscribe(result => {
        this.trade = result['trade'];
        if (this.trade.user_a.id === result['myUser']) {
          this.loggedUser = this.trade.user_a;
          this.loggedUser.role = 'user_a';
          this.partner = this.trade.user_b;
          this.partner.role = 'user_b';
        } else {
          this.loggedUser = this.trade.user_b;
          this.loggedUser.role = 'user_b';
          this.partner = this.trade.user_a;
          this.partner.role = 'user_a';
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
    this.makeComparison();
  }
  toggleCardDisplay() {
    this.displayToggle = !this.displayToggle;
  }
  // Temp Method
  makeComparison() {
    this._tradeService.comparePartners(this.partner.id).subscribe(result => {
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
