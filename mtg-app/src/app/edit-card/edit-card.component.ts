import { Component, OnInit, Input } from '@angular/core';
import { CardService } from '../card.service';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.css']
})
export class EditCardComponent implements OnInit {
  _number_wanted: number
  ApiCallTimer: any
  progressClass

  @Input() card;

  @Input() pref_printing;

  @Input() pref_foil;

  @Input() 
  set number_wanted(number_wanted: number) {
    this._number_wanted = number_wanted;
  }

  get number_wanted(): number { return this._number_wanted }

  constructor(private _card : CardService) { }

  ngOnInit() {

  }

  ngOnChanges(changes) {
    console.log(changes);
    if ((changes.hasOwnProperty('pref_printing') && !changes.pref_printing.firstChange) || changes.hasOwnProperty('pref_foil') && !changes.pref_foil.firstChange) {
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
    this.ApiCallTimer = setTimeout(this.updateCard.bind(this), 1500);
    this.progressClass = "inProgress";
  }

  updateCard() {
    console.log("updateCard() has run");
    this._card.updateWishlistEntry({
      number_wanted: this._number_wanted,
      pref_printing: (this.pref_printing === "none") ? null : this.pref_printing.id
    }, this.card.wishlist.id).subscribe(data => {
      console.log(data);
      if (data["message"] === "Success") {
        this.progressClass = undefined;
      }
    })
  }
}
