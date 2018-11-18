import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trade-display',
  templateUrl: './trade-display.component.html',
  styleUrls: ['./trade-display.component.css']
})
export class TradeDisplayComponent implements OnInit {
  @Input() userCards;
  @Input() role;
  @Output() targetCardEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log(this.role);
    this.createCarousel();
  }

  targetCardFromOffer(card) {
    this.targetCardEmitter.emit(card);
  }

  createCarousel() {
    setTimeout(
      () => {
        $(`.${this.role}`).slick({
          dots: false,
          infinite: false,
          speed: 300,
          slidesToShow: 7,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 5,
                slidesToScroll: 1,
                dots: false
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
        });
      }, 1
    );
  }

}
