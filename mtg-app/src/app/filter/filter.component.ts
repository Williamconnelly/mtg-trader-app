import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() fullArray;
  @Input() type;
  @Output() filterEmitter = new EventEmitter<any>();

  filterBoolean = false;
  filterOptions = {
    name: "",
    colors: {
      White: false,
      Blue: false,
      Black: false,
      Red: false,
      Green: false
    },
    colorless: false,
    superTypes: {
      Legendary: false,
      Snow: false,
      World: false
    },
    types: {
      Artifact: false,
      Creature: false,
      Land: false,
      Enchantment: false,
      Planeswalker: false,
      Instant: false,
      Sorcery: false,
      Tribal: false
    }
  }
  filterColors = Object.keys(this.filterOptions.colors);
  filterSuperTypes = Object.keys(this.filterOptions.superTypes);
  filterTypes = Object.keys(this.filterOptions.types);

  constructor() { }

  ngOnInit() {
    console.log(this.type);
  }

  colorChanges(changes) {
    if (changes) {
      this.filterOptions.colorless = false;
    }
    this.filterCards();
  }

  colorlessChanges(changes) {
    if (changes) {
      this.filterOptions.colors = {
        White: false,
        Blue: false,
        Black: false,
        Red: false,
        Green: false
      }
    }
    this.filterCards();
  }

  filterCards() {
    let colorArray = [];
    let superTypeArray =[];
    let typeArray = [];
    let name = this.filterOptions.name;
    this.filterColors.forEach(key => {
      if (this.filterOptions.colors[key]) {
        colorArray.push(key);
      }
    });
    this.filterSuperTypes.forEach(key => {
      if (this.filterOptions.superTypes[key]) {
        superTypeArray.push(key);
      }
    });
    this.filterTypes.forEach(key => {
      if (this.filterOptions.types[key]) {
        typeArray.push(key);
      }
    });
    
    this.filterEmitter.emit(this.fullArray.filter(function(item) {
      let card = item.hasOwnProperty('card') ? item.card : item.printing.card;
      if (!card.name.toLowerCase().includes(name.toLowerCase())) {
        return false;
      }
      if (this.filterOptions.colorless) {
        if (card.colors !== null) {
          return false;
        }
      } else {
        for (let i=0; i<colorArray.length; i++) {
          if (card.colors === null || !card.colors.includes(colorArray[i])) {
            return false;
          }
        }
      }
      for (let i=0; i<superTypeArray.length; i++) {
        if (card.supertypes === null || !card.supertypes.includes(superTypeArray[i])) {
          return false;
        }
      }
      for (let i=0; i<typeArray.length; i++) {
        if (!card.types.includes(typeArray[i])) {
          return false;
        }
      }
      return true;
    }.bind(this)));
  }

}
