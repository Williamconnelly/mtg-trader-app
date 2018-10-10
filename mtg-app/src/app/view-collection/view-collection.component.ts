import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AuthService} from '../auth.service';

@Component({
  selector: 'app-view-collection',
  templateUrl: './view-collection.component.html',
  styleUrls: ['./view-collection.component.css']
})
export class ViewCollectionComponent implements OnInit {
  cardArray = [];

  constructor(private card : CardService, private _route: ActivatedRoute, private _authService: AuthService) { }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      if (params['userId'] === undefined) {
        console.log("params is undefined");
        // If no params are given, set the id to undefined. getCollectionById() will get currently logged
        // in user's collection
        this.getCollectionById(undefined);
      } else {
        console.log("params['userId']: " + params['userId']);
        this.getCollectionById(params['userId']);
      }
    });
  }

  getCollectionById(id) {
    let observable;
    // If id is undefined, get the currently logged in user's collection
    if (id === undefined) {
      observable = this.card.getLoggedInCollection()
    } else {
      observable = this.card.getCollectionById(id);
    }
    observable.subscribe(collection => {
      console.log(collection);
      // TEMP LOGOUT CATCH
      if (collection.hasOwnProperty('error')) {
        this._authService.logoutUser();
      }
      if (!collection.hasOwnProperty('message')) {
        this.cardArray = collection;
        for (let i=0; i<this.cardArray.length; i++) {
          this.card.scryfallFindCardByName(this.cardArray[i].card.name).subscribe(scryfallData => {
            console.log(scryfallData);
            this.cardArray[i]['url'] = scryfallData['image_uris']['small']
          });
        }
      }
    });
  }
}
