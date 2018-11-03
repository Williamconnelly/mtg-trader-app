import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GatheringService {
  private _gatheringWantUrl = 'http://localhost:3000/trade/gathering/acquire';
  private _gatheringProvideUrl = 'http://localhost:3000/trade/gathering/provide';
  private _acquireCardURL = `http://localhost:3000/trade/gathering/acquire/card/`;
  private _provideCardURL = `http://localhost:3000/trade/gathering/provide/card/`;
  private _acquireUserURL = `http://localhost:3000/trade/gathering/acquire/user/`;
  private _provideUserURL = `http://localhost:3000/trade/gathering/provide/user/`;
  constructor(private http: HttpClient) { }

  getGatheringAcquire() {
    return this.http.get<any>(this._gatheringWantUrl);
  }
  getGatheringProvide() {
    return this.http.get<any>(this._gatheringProvideUrl);
  }
  searchAcquireCard(name) {
    return this.http.get<any>(`${this._acquireCardURL}${name}`);
  }
  searchProvideCard(name) {
    return this.http.get<any>(`${this._provideCardURL}${name}`);
  }
  searchAcquireUser(name) {
    return this.http.get<any>(`${this._acquireUserURL}${name}`);
  }
  searchProvideUser(name) {
    return this.http.get<any>(`${this._provideUserURL}${name}`);
  }
}


