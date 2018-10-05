import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-view-collection',
  templateUrl: './view-collection.component.html',
  styleUrls: ['./view-collection.component.css']
})
export class ViewCollectionComponent implements OnInit {
  cardArray = [];
  searchBool = false;
  viewCollectionSearch = 1;

  constructor(private card : CardService, private _route: ActivatedRoute) { }

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
        this.getCollectionById(params['userId']);
      }
    });
  }

  getCollectionById(id) {
    this.card.getCollectionById(id).subscribe(collection => {
      console.log(collection);
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
