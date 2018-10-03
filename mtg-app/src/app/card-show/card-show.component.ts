import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-card-show',
  templateUrl: './card-show.component.html',
  styleUrls: ['./card-show.component.css']
})
export class CardShowComponent implements OnInit {
  cardArray = [];

  constructor(private card: CardService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      console.log(`params[['cardId']: ${params['cardId']}`);
      this.getCardById(params['cardId']);
    });
  }
  getCardById(id) {
    this.card.findCardById(id).subscribe(card => {
      console.log(card);
      if (!card.hasOwnProperty('message')) {
        this.cardArray = card;
        // for (let i=0; i<this.cardArray.length; i++) {
        //   this.card.scryfallFindCardByName(this.cardArray[i].card.name).subscribe(scryfallData => {
        //     console.log(scryfallData);
        //     this.cardArray[i]['url'] = scryfallData['image_uris']['small']
        //   });
        // }
      }
    });
  }

}
