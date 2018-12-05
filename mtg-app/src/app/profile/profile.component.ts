import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { TradeService } from '../trading/trade.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: number;
  currentUser;
  owner: Boolean = false;
  trades = {
    active: [],
    pending: []
  };
  constructor(private _route: ActivatedRoute, private _auth: AuthService, private _trade: TradeService) { }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      this.userId = parseInt(params.userId);
      console.log(this.userId);
      this.checkUser();
    });
  }
  // Recursive function that awaits the site to 'know' who the logged user is and then sets properties accordingly
  checkUser() {
    // If the user isn't available yet, try again after 50ms
    if (this._auth.returnUser() === false) {
      setTimeout(() => {
        this.checkUser();
      }, 50);
    } else {
      this.currentUser = this._auth.returnUser();
      if (this.currentUser.id === this.userId) {
        this.owner = true;
        console.log(this.owner);
        this.findTrades();
      } else {
        this.findUser(this.userId);
      }
    }
  }
  findTrades() {
    // Get all of the user's associated trades and sort them into either pending or currently active
    this._trade.findTrades().subscribe(userTrades => {
      for (const trade of userTrades) {
        !trade.b_accept ?
        this.trades.pending.push(trade) :
        this.trades.active.push(trade);
      }
      console.log(this.trades);
    });
  }
  findUser(userId) {
    this._auth.findUser(userId).subscribe(userInfo => {
      this.currentUser = userInfo;
      console.log(this.currentUser);
    });
  }
  initiateTrade(id) {
    console.log(`Initiating Trade with User: ${id}`);
    this._trade.initiateTrade(id).subscribe(result => {
      console.log(result);
    });
  }
}
