import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.css']
})
export class ViewListComponent implements OnInit {
  cardArray = [];
  searchBool = false;
  viewWishlistSearch = 1;

  constructor(private card: CardService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      if (params != undefined) {
        console.log("params['userId']: " + params['userId']);
      } else {
        console.log("params is undefined");
      }
      if (params['userId'] === undefined) {
        this.searchBool = true;
      } else {
        this.getWishlistById(params['userId']);
      }
    });
  }

  getWishlistById(viewWishlistSearch) {
    this.card.getWishlistById(viewWishlistSearch).subscribe(wishlist => {
      console.log(wishlist);
      if (!wishlist.hasOwnProperty('message')) {
        for (let i=0; i<wishlist.length; i++) {
          this.card.scryfallFindCardByName(wishlist[i].name).subscribe(scryfallData => {
            console.log(scryfallData);
            wishlist[i]['url'] = scryfallData['image_uris']['small']
          });
        }
        this.cardArray = wishlist;
      }
    });
  }
}
