import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CardService } from '../card.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {
  autocompleteAPIResponse = [];
  autocomplete = [];
  lastAutocomplete;
  autocompleteTimer;
  cardSearch = "";
  @Output() searchEmitter = new EventEmitter<string>();

  constructor(private _card : CardService) { }

  ngOnInit() {
  }

  submit() {
    console.log("Autocomplete search field submit");
    this.searchEmitter.emit(this.cardSearch);
    clearTimeout(this.autocompleteTimer);
    this.cardSearch = "";
    this.lastAutocomplete = undefined;
    this.autocomplete = [];
  }

  autocompleteBuffer() {
    let cardSearch = this.cardSearch;
    if (this.autocompleteTimer !== undefined) {
      clearTimeout(this.autocompleteTimer);
    }
    if (cardSearch.length >= 3) {
      if (this.lastAutocomplete === undefined || !this.startsWith(cardSearch, this.lastAutocomplete)) {
        this.autocompleteTimer = setTimeout(function() {
          this._card.autocomplete(cardSearch).subscribe(data => {
            console.log("autocomplete API response");
            console.log(data);
            this.lastAutocomplete = cardSearch;
            this.autocompleteAPIResponse = data;
            this.autocomplete = data;
          })
        }.bind(this), 750);
      } else {
        this.autocomplete = this._filter(cardSearch);
      }
    }
  }

  startsWith(word, lastAutocomplete) {
    lastAutocomplete = lastAutocomplete.toLowerCase();
    word = word.toLowerCase();
    if (lastAutocomplete.length <= word.length) {
      for (let i=0; i<lastAutocomplete.length; i++) {
        if (lastAutocomplete[i] !== word[i]) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.autocompleteAPIResponse.filter(option => option.toLowerCase().includes(filterValue));
  }

}
