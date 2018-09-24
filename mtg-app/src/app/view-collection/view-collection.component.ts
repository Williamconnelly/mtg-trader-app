import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';

@Component({
  selector: 'app-view-collection',
  templateUrl: './view-collection.component.html',
  styleUrls: ['./view-collection.component.css']
})
export class ViewCollectionComponent implements OnInit {
  cardArray = [];
  viewCollectionSearch = 1;

  constructor(private card : CardService) { }

  ngOnInit() {
  }

  getCollectionById(viewCollectionSearch) {
    this.card.getCollectionById(viewCollectionSearch).subscribe(collection => {
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
