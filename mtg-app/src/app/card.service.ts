import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http : HttpClient) { }

  findCardByName(name) {
    return this.http.post<any>("http://localhost:3000/card/name",{name:name});
  }
}
