import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { CardService } from '../card.service';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.css']
})
export class EditCardComponent implements OnInit {
  updateTimer: any
  dbVersion = {}

  @Input() index;
  @Input() id;
  @Input() owned_copies;
  @Input() trade_copies;
  @Input() number_wanted;
  @Input() printing;
  @Input() foil;
  @Input() name;
  @Input() card;
  @Input() revertIndicator;

  @Output() updateBufferEmitter = new EventEmitter();
  @Output() updateEmitter = new EventEmitter();
  @Output() successfulUpdateEmitter = new EventEmitter();
  @Output() unsuccessfulUpdateEmitter = new EventEmitter();

  constructor(private _card : CardService) { }

  ngOnInit() {
    if (this.number_wanted !== undefined) {
      this.dbVersion["number_wanted"] = this.number_wanted;
      this.dbVersion["pref_foil"] = this.foil;
      this.dbVersion["pref_printing"] = (this.printing === "none") ? null : this.printing.id;
    } else {
      this.dbVersion["owned_copies"] = this.owned_copies;
      this.dbVersion["trade_copies"] = this.trade_copies;
      this.dbVersion["foil"] = this.foil;
      this.dbVersion["printingId"] = this.printing.id;
    }
  }

  minusWanted() {
    if (this.number_wanted > 1) {
      this.number_wanted--;
      this.updateCardBuffer('number_wanted', this.number_wanted);
    }
  }

  plusWanted() {
    this.number_wanted++;
    this.updateCardBuffer('number_wanted', this.number_wanted);
  }

  minusOwned() {
    if (this.owned_copies > 1) {
      this.owned_copies--;
      if (this.trade_copies > this.owned_copies) {
        this.trade_copies = this.owned_copies;
        this.updateCardBuffer('trade_copies', this.trade_copies)
      }
      this.updateCardBuffer('owned_copies', this.owned_copies);
    }
  }

  plusOwned() {
    this.owned_copies++;
    this.updateCardBuffer('owned_copies', this.owned_copies);
  }

  minusTrade() {
    if (this.trade_copies > 0) {
      this.trade_copies--;
      this.updateCardBuffer('trade_copies', this.trade_copies);
    }
  }

  plusTrade() {
    if (this.trade_copies < this.owned_copies) {
      this.trade_copies++;
      this.updateCardBuffer('trade_copies', this.trade_copies);
    }
  }

  updateCardBuffer(field, newValue) {
    let emitObj = {
      index: this.index,
      field: field,
      value: newValue
    }
    if (this.updateTimer !== undefined) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(this.updateCard.bind(this), 1500);
    this.updateBufferEmitter.emit(emitObj);
  }
  

  updateCard(force) {
    console.log("updateCard() has run");
    let updateObject = {};
    if (this.number_wanted !== undefined) {
      updateObject['number_wanted'] = this.number_wanted;
      updateObject['pref_foil'] = (this.printing === "none") ? this.foil : (this.foil) ? (this.printing.foil_version) : (!this.printing.nonFoil_version)
      updateObject['pref_printing'] = (this.printing === "none") ? null : this.printing.id
    } else {
      updateObject['owned_copies'] = this.owned_copies;
      updateObject['trade_copies'] = this.trade_copies;
      updateObject['foil'] = this.foil ? this.printing.foil_version : !this.printing.nonFoil_version
      updateObject['printingId'] = this.printing.id;
    }
    for (let key in updateObject) {
      if (updateObject[key] === this.dbVersion[key]) {
        delete updateObject[key]
      }
    }
    if (force) {
      updateObject["force"] = true;
    }
    if (Object.keys(updateObject).length > 0) {
      let observable = (this.number_wanted !== undefined) ? this._card.updateWishlistEntry(updateObject, this.id) : this._card.updateCollectionEntry(updateObject, this.id)
      this.updateEmitter.emit(this.index);
      console.log(updateObject);
      observable.subscribe(data => {
        console.log(data);
        switch(data["status"]) {
          case "Success":
            for (let key in this.dbVersion) {
              this.dbVersion[key] = data["update"][key]
            }
            this.successfulUpdateEmitter.emit(this.index);
            break;
          case "Pending":
            // Check if they want to make the change while deleting the existing tradescollections, if so
            // add "force" to the updateObject
            if (window.confirm(data["message"])) {
              console.log("window.confirm true")
              this.updateCard(true);
            } else {
              this.unsuccessfulUpdateEmitter.emit({index: this.index, dbVersion: this.dbVersion});  
            }
            break;
          case "Fail":
            console.log("case fail");
            this.unsuccessfulUpdateEmitter.emit({index: this.index, dbVersion:this.dbVersion, message:data["message"]});
            break;
        }
      });
    } else {
      console.log("Nothing needs updating");
      this.successfulUpdateEmitter.emit(this.index);
    }
  }

}
