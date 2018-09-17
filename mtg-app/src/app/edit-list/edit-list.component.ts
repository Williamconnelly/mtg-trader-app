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
    let obs = this.card.findCardByName(this.cardSearch);
    obs.subscribe(cardResult => {
      this.cardArray.push(cardResult);
    });
  }
}
