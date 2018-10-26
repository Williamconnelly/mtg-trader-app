import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.css']
})
export class EditCardComponent implements OnInit {
  _number_wanted: number
  number_wantedTimer: any

  
  @Input() card;

  @Input() 
  set number_wanted(number_wanted: number) {
    console.log(number_wanted);
    this._number_wanted = number_wanted;
  }

  get number_wanted(): number { return this._number_wanted }


  constructor() { }

  ngOnInit() {
  }

  minusWanted() {
    console.log("minusWanted");
    if (this._number_wanted > 1) {
      this._number_wanted -= 1;
      if (this.number_wantedTimer !== undefined) {
        clearTimeout(this.number_wantedTimer);
      }
      this.number_wantedTimer = setTimeout(this.number_wantedUpdate, 2000);
    }
  }

  plusWanted() {
    console.log("plusWanted");
    this._number_wanted++;
    if (this.number_wantedTimer !== undefined) {
      clearTimeout(this.number_wantedTimer);
    }
    this.number_wantedTimer = setTimeout(this.number_wantedUpdate, 2000);
  }

  number_wantedUpdate() {
    console.log("number_wantedUpdate() has run");
  }
}
