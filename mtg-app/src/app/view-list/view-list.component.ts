import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService} from '../auth.service';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.css']
})
export class ViewListComponent implements OnInit {
  fullWishlist = [];
  wishlistArray = [];

  constructor(private card: CardService, private _route: ActivatedRoute, private _authService: AuthService) { }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      if (params['userId'] === undefined) {
        // If no params are given, set the id to undefined. getWishlistById() will get currently logged
        // in user's wishlist
        console.log("params is undefined");
        this.getWishlistById(undefined);
      } else {
        console.log("params['userId']: " + params['userId']);
        this.getWishlistById(params['userId']);
      }
    });
  }

  getWishlistById(id) {
    let observable;
    // If id is undefined, get the currently logged in user's wishlist
    if (id === undefined) {
      observable = this.card.getLoggedInWishlist();
    } else {
      observable = this.card.getWishlistById(id);
    }
    observable.subscribe(wishlist => {
      console.log(wishlist);
      // TEMP LOGOUT CATCH
      if (wishlist.hasOwnProperty('error')) {
        this._authService.logoutUser();
      }
      if (!wishlist.hasOwnProperty('message')) {
        for (let i = 0; i < wishlist.length; i++) {
          if (wishlist[i].pref_printing === null) {
            wishlist[i]['url'] = wishlist[i].card.cardPrintings[0].img_url;
          } else {
            for (let x=0; x<wishlist[i].card.cardPrintings.length; x++) {
              if (wishlist[i].pref_printing === wishlist[i].card.cardPrintings[x].id) {
                wishlist[i].url = wishlist[i].card.cardPrintings[x].img_url;
                break;
              }
            }
          }
        }
        this.wishlistArray = wishlist;
        this.fullWishlist = wishlist;
      }
    });
  }
}
