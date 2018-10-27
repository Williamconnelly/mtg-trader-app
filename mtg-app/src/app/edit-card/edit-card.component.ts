import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.css']
})
export class EditCardComponent implements OnInit {
  _number_wanted: number
  ApiCallTimer: any

  @Input() card;

  @Input() pref_printing;

  @Input() 
  set number_wanted(number_wanted: number) {
    this._number_wanted = number_wanted;
  }

  get number_wanted(): number { return this._number_wanted }

  constructor() { }

  ngOnInit() {
    
  }

  ngOnChanges(changes) {
    console.log(changes);
    if (changes.hasOwnProperty('pref_printing') && !changes.pref_printing.firstChange) {
      this.updateCardBuffer();
    }
  }

  minusWanted() {
    console.log("minusWanted");
    if (this._number_wanted > 1) {
      this._number_wanted -= 1;
      this.updateCardBuffer();
    }
  }

  plusWanted() {
    console.log("plusWanted");
    this._number_wanted++;
    this.updateCardBuffer();
  }

  updateCardBuffer() {
    if (this.ApiCallTimer !== undefined) {
      clearTimeout(this.ApiCallTimer);
    }
    this.ApiCallTimer = setTimeout(this.updateCard, 1500);
  }

  updateCard() {
    console.log("updateCard() has run");
  }
}
