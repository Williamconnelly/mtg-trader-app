import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GatheringService {
  private _gatheringWantUrl = 'http://localhost:3000/trade/gathering/want';
  private _gatheringProvideUrl = 'http://localhost:3000/trade/gathering/provide';
  constructor(private http: HttpClient) { }

  getGatheringWant() {
    return this.http.get<any>(this._gatheringWantUrl);
  }

  getGatheringProvide() {
    return this.http.get<any>(this._gatheringProvideUrl);
  }
}


