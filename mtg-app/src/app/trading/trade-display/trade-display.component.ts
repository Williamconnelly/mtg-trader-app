import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trade-display',
  templateUrl: './trade-display.component.html',
  styleUrls: ['./trade-display.component.css']
})
export class TradeDisplayComponent implements OnInit {
  @Input() userCards;
  @Input() user;
  @Input() trade;
  @Input() lock;
  @Input() submit;
  @Output() targetCardEmitter = new EventEmitter();
  locked: Boolean;
  
  textDisplay: Boolean = false;

  constructor() { }

  ngOnInit() {
    console.log(this.user);
    console.log(this.trade);
    console.log(this.userCards);
    console.log("this.lock: " + this.lock);
    // Check if the respective parties have either locked or submitted
    if (this.user.role === 'user_a') {
      this.trade.a_lock ? this.locked = true : this.locked = false;
    } else if (this.user.role === 'user_b') {
      this.trade.b_lock ? this.locked = true : this.locked = false;
    }
  }

  targetCardFromOffer(card) {
    this.targetCardEmitter.emit(card);
  }
  // Toggle function for displaying either image or text display versions
  toggleTextDisplay() {
    this.textDisplay = !this.textDisplay;
  }
}
