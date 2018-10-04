import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-card-show',
  templateUrl: './card-show.component.html',
  styleUrls: ['./card-show.component.css']
})
export class CardShowComponent implements OnInit {
  cardShow = [];

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
        this.cardShow.push(card);
        // TEMPORARY
        for (let i = 0; i < this.cardShow.length; i++) {
          this.card.scryfallFindCardByName(this.cardShow[i].name).subscribe(scryfallData => {
            console.log(scryfallData);
            this.cardShow[i]['url'] = scryfallData['image_uris']['small'];
          });
        }
      }
      console.log(this.cardShow);
    });
  }

}
