import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private _initiateTradeURL = 'http://localhost:3000/trade/initiate/';
  private _collectionURL = 'http://localhost:3000/trade/collection';
  private _addToTradeURL = 'http://localhost:3000/trade/add';
  private _getTradeURL = `http://localhost:3000/trade/current`;
  private _updateTradeURL = `http://localhost:3000/trade/update`;
  private _removeTradeURL = `http://localhost:3000/trade/remove`;
  constructor(private http: HttpClient) { }
  initiateTrade(id) {
    return this.http.get<any>(`${this._initiateTradeURL}${id}`);
  }
  getCollection() {
    return this.http.get<any>(this._collectionURL);
  }
  addToTrade(card: object, tradeId: number, offered: number) {
    return this.http.post<any>(this._addToTradeURL, {card, tradeId, offered});
  }
  getCurrentTrade(id: number) {
    return this.http.post<any>(`${this._getTradeURL}`, {id});
  }
  updateCard(card: object, tradeId: number, offered: number) {
    return this.http.put<any>(this._updateTradeURL, {card, tradeId, offered});
  }
  // POST vs DELETE
  removeCard(card: object, tradeId: number) {
    return this.http.post(this._removeTradeURL, {card, tradeId});
  }
}
