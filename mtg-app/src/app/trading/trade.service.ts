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
  private _updateCardURL = `http://localhost:3000/trade/update`;
  private _removeTradeURL = `http://localhost:3000/trade/remove`;
  private _comparePartnersURL = `http://localhost:3000/trade/compare`;
  private _sendMessageURL = 'http://localhost:3000/trade/message';
  private _progressTradeURL = 'http://localhost:3000/trade/progress';
  private _completeTradeURL = 'http://localhost:3000/trade/complete';
  private _findTradesURL = 'http://localhost:3000/trade/list';
  private _acceptURL = 'http://localhost:3000/trade/accept/';
  private _deleteTradeURL = 'http://localhost:3000/trade/delete/';

  constructor(private http: HttpClient) { }
  initiateTrade(id) {
    return this.http.get<any>(`${this._initiateTradeURL}${id}`);
  }
  getCollection() {
    return this.http.get<any>(this._collectionURL);
  }
  comparePartners(partnerId) {
    return this.http.post(this._comparePartnersURL, {partnerId});
  }
  addToTrade(card: object, tradeId: number, offered: number) {
    return this.http.post<any>(this._addToTradeURL, {card, tradeId, offered});
  }
  getCurrentTrade(id: number) {
    return this.http.post<any>(`${this._getTradeURL}`, {id});
  }
  updateCard(card: object, tradeId: number, offered: number) {
    return this.http.put<any>(this._updateCardURL, {card, tradeId, offered});
  }
  // POST vs DELETE
  removeCard(card: object, tradeId: number) {
    return this.http.post(this._removeTradeURL, {card, tradeId});
  }
  sendMessage(messageObject) {
    return this.http.post<any>(this._sendMessageURL, messageObject);
  }
  progressTrade(role: string, action: string, tradeId: number, cardSet: string) {
    return this.http.put<any>(this._progressTradeURL, {role, action, tradeId, cardSet});
  }
  completeTrade(trade) {
    return this.http.put<any>(this._completeTradeURL, {trade});
  }
  findTrades() {
    return this.http.get<any>(this._findTradesURL);
  }
  acceptTrade(tradeId) {
    return this.http.put<any>(`${this._acceptURL}${tradeId}`, {tradeId});
  }
  deleteTrade(tradeId) {
    return this.http.delete<any>(`${this._deleteTradeURL}${tradeId}`);
  }
}
