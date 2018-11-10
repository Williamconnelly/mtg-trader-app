import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private _initiateTradeURL = 'http://localhost:3000/trade/initiate/';
  private _collectionURL = 'http://localhost:3000/trade/collection';
  private _addToTradeURL = 'http://localhost:3000/trade/add';
  constructor(private http: HttpClient) { }
  initiateTrade(id) {
    return this.http.get<any>(`${this._initiateTradeURL}${id}`);
  }
  getCollection() {
    return this.http.get<any>(this._collectionURL);
  }
  addToTrade(card) {
    return this.http.post<any>(this._addToTradeURL, {card});
  }
  // initiateTrade(id) {
  //   return this.http.get<any>('http://localhost:3000/trade/test');
  // }
}
