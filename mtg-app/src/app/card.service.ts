import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http : HttpClient) { }
  addCardsToCollection(printings) {
    return this.http.post<any>("http://localhost:3000/user/collection/batch", {printings:printings});
  }
  addCardToCollection(collectionObject) {
    return this.http.post<any>("http://localhost:3000/user/collection/", collectionObject);
  }
  editCardsInCollection(printings) {
    return this.http.put<any>("http://localhost:3000/user/collection/batch", {printings:printings});
  }
  updateCollectionEntry(updateObject, id) {
    return this.http.put<any>("http://localhost:3000/user/collection/" + id, updateObject);
  }
  deleteCollectionEntry(id, force) {
    return this.http.put<any>("http://localhost:3000/user/collection/delete/" + id, force);
  }
  addCardsToWishlist(cards) {
    return this.http.post<any>("http://localhost:3000/user/wishlist/batch", {cards:cards});
  }
  addCardToWishlist(wishlistObject) {
    return this.http.post<any>("http://localhost:3000/user/wishlist/", wishlistObject);
  }
  editCardsInWishlist(cards) {
    return this.http.put<any>("http://localhost:3000/user/wishlist/batch", {cards:cards});
  }
  updateWishlistEntry(updateObject, id) {
    return this.http.put<any>("http://localhost:3000/user/wishlist/" + id, updateObject);
  }
  deleteWishlistEntry(id) {
    return this.http.delete<any>("http://localhost:3000/user/wishlist/" + id);
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
  autocomplete(string) {
    return this.http.post<any>("http://localhost:3000/autocomplete/", {word:string});
  }
}
