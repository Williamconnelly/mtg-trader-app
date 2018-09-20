import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http : HttpClient) { }
  addCardsToCollection(cards) {
    let postObject = {
      cards: cards
    };
    return this.http.post<any>("http://localhost:3000/user/collection/batch", postObject);
  }
  findCardByName(name) {
    return this.http.post<any>("http://localhost:3000/card/name",{name:name});
  }
  scryfallFindCardByName(name) {
    let removeSpaces = "";
    for (let i=0; i<name.length; i++) {
      if (name[i] !== " ") {
        removeSpaces += name[i];
      } else {
        removeSpaces += "+";
      }
    }
    return this.http.get<any>("https://api.scryfall.com/cards/named?fuzzy=" + removeSpaces);
  }
}
