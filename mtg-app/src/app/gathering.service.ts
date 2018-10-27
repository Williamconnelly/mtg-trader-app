import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GatheringService {
  private _gatheringWantUrl = 'http://localhost:3000/trade/gathering/acquire';
  private _gatheringProvideUrl = 'http://localhost:3000/trade/gathering/provide';
  private _gatheringCardURL = `http://localhost:3000/trade/gathering/card/`;
  private _gatheringUserURL = `http://localhost:3000/trade/gathering/user/`;
  constructor(private http: HttpClient) { }

  getGatheringAcquire() {
    return this.http.get<any>(this._gatheringWantUrl);
  }
  getGatheringProvide() {
    return this.http.get<any>(this._gatheringProvideUrl);
  }
  searchCard(name) {
    return this.http.get<any>(`${this._gatheringCardURL}${name}`);
  }
  searchUser(name) {
    return this.http.get<any>(`${this._gatheringUserURL}${name}`);
  }
}


