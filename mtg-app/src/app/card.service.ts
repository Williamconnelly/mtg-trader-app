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
  addCardsToWishlist(cards) {
    return this.http.post<any>("http://localhost:3000/user/wishlist/batch", {cards:cards});
  }
  editCardsInCollection(printings) {
    return this.http.put<any>("http://localhost:3000/user/collection/batch", {printings:printings});
  }
  editCardsInWishlist(cards) {
    return this.http.put<any>("http://localhost:3000/user/wishlist/batch", {cards:cards});
  }
  updateWishlistEntry(updateObject, id) {
    return this.http.put<any>("http://localhost:3000/user/wishlist/" + id, updateObject);
  }
  getLoggedInCollection() {
    return this.http.get<any>("http://localhost:3000/user/collection/loggedin");
  }
  getLoggedInWishlist() {
    return this.http.get<any>("http://localhost:3000/user/wishlist/loggedin");
  }
  getCollectionById(id) {
    return this.http.get<any>("http://localhost:3000/user/collection/" + id);
  }
  getWishlistById(id) {
    return this.http.get<any>("http://localhost:3000/user/wishlist/" + id);
  }
  findCardByName(name) {
    return this.http.post<any>("http://localhost:3000/card/name",{name:name});
  }
  findCardById(id) {
    return this.http.get<any>(`http://localhost:3000/card/${id}`);
  }
  scryfallFindCardByName(name) {
    return this.http.get<any>("https://api.scryfall.com/cards/named?fuzzy=" + name.replace(" ", "+"));
  }
}
