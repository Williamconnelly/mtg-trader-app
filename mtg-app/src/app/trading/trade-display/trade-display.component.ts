import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trade-display',
  templateUrl: './trade-display.component.html',
  styleUrls: ['./trade-display.component.css']
})
export class TradeDisplayComponent implements OnInit {
  @Input() userCards;

  @Output() targetCardEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
    $('.your-class').slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3
    });
  }

  targetCardFromOffer(card) {
    this.targetCardEmitter.emit(card);
  }

}
