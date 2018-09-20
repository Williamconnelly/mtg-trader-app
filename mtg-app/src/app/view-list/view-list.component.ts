import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.component.html',
  styleUrls: ['./view-list.component.css']
})
export class ViewListComponent implements OnInit {
  cardArray = [];
  viewListSearch = 1;

  constructor(private card : CardService) { }

  ngOnInit() {
  }

  getCollectionById(viewListSearch) {
    this.card.getCollectionById(viewListSearch).subscribe(collection => {
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
