import { Component, OnInit } from '@angular/core';
import { CardService } from '../card.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.css']
})
export class EditListComponent implements OnInit {
  cardSearch = "";
  cardArray = [];


  constructor(private card : CardService) { }

  ngOnInit() {
  }

  submitCardSearch() {
    console.log("Searching for " + this.cardSearch);
    let obs = this.card.findCardByName(this.cardSearch);
    obs.subscribe(cardResult => {
      console.log(cardResult);
      if (cardResult != null) {
        this.cardArray.push(cardResult);
      }
    });
  }
}
