import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-card-show',
  templateUrl: './card-show.component.html',
  styleUrls: ['./card-show.component.css']
})
export class CardShowComponent implements OnInit {
  cardShow = <any>{};
  changeFace = false;

  constructor(private card: CardService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      console.log(`params[['cardId']: ${params['cardId']}`);
      this.getCardById(params['cardId']);
    });
  }
  getCardById(id) {
    this.card.findCardById(id).subscribe(card => {
      if (!card.hasOwnProperty('message')) {
        this.cardShow = card;
      }
      if (this.cardShow.card.text !== null) {
        this.cardShow.card.newtext = this.cardShow.card.text.replace(/\n/g, '\n\n');
      }
      this.cardShow.newImg = this.cardShow.img_url.replace(/(cards\/small)/gm, 'cards/normal');
      if (this.cardShow.backside_img_url !== null) {
        this.cardShow.newImgBack = this.cardShow.backside_img_url.replace(/(cards\/small)/gm, 'cards/normal');
      }
      console.log(this.cardShow);
    });
  }


}
