import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.css']
})
export class ViewListComponent implements OnInit {
  cardArray = [];

  constructor(private card : CardService) { }

  ngOnInit() {
    this.getCollectionById(1);
  }

  getCollectionById(id) {
    this.card.getCollectionById(id).subscribe(collection => {
      console.log(collection);
      this.cardArray = collection;
      for (let i=0; i<this.cardArray.length; i++) {
        this.card.scryfallFindCardByName(this.cardArray[i].card.name).subscribe(scryfallData => {
          console.log(scryfallData);
          this.cardArray[i]['url'] = scryfallData['image_uris']['small']
        });
      }
    });
  }
}