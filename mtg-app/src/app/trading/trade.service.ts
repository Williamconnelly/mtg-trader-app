import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private _initiateTradeURL = 'http://localhost:3000/trade/initiate/';
  constructor(private http: HttpClient) { }
  initiateTrade(id) {
    return this.http.get<any>(`${this._initiateTradeURL}${id}`);
  }
}
