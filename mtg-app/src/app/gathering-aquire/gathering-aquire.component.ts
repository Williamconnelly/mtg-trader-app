import { Component, OnInit, Input } from '@angular/core';
import { TradeService } from '../trading/trade.service';

@Component({
  selector: 'app-gathering-aquire',
  templateUrl: './gathering-aquire.component.html',
  styleUrls: ['./gathering-aquire.component.css']
})
export class GatheringAquireComponent implements OnInit {
  @Input() data;
  @Input() Otherdata;
  @Input() refineAcquire;
  @Input() refineProvide;
  @Input() searchState;
  // @Input() setSelection;
  // @Input() foilSelection;
  // @Input() cardNumberSelection;
  setSelection = 'all';
  foilSelection = 'all';
  cardNumberSelection = 'all';
  // @Input() setOptions;
  // @Input() foilOptions;
  // @Input() cardNumberOptions;

  constructor(private _tradeService: TradeService) { }

  ngOnInit() {

  }
  refineCardSearch() {
    const refinedData = new Array(this.refineAcquire.preservedCardSearch.length);
    for (let i = this.refineAcquire.preservedCardSearch.length - 1; i >= 0; i --) {
      refinedData[i] = {username: this.refineAcquire.preservedCardSearch[i].username,
         userId: this.refineAcquire.preservedCardSearch[i].userId};
      const refinedCards = this.refineAcquire.preservedCardSearch[i].cards.filter(
        card => (card['card.cardPrintings.set.title'] === this.setSelection ||
                this.setSelection === 'all') &&
                (card['card.cardPrintings.users.collection.foil'] === this.foilSelection ||
                this.foilSelection === 'all') &&

                (card['card.cardPrintings.users.collection.trade_copies'] >= this.cardNumberSelection ||
                this.cardNumberSelection === 'all')
      );
      refinedData[i].cards = refinedCards;
      if (refinedData[i].cards.length < 1) {
        refinedData.splice(refinedData[i], 1);
      }
      this.data = refinedData;
    }
  }
  refineCardSearchProvide() {
    const refinedData = new Array(this.refineProvide.preservedCardSearch.length);
    for (let i = this.refineProvide.preservedCardSearch.length - 1; i >= 0; i --) {
      refinedData[i] = {username: this.refineProvide.preservedCardSearch[i].username,
         userId: this.refineProvide.preservedCardSearch[i].userId};
      const refinedCards = this.refineProvide.preservedCardSearch[i].cards.filter(
        card => (card['printing.set.title'] === this.setSelection ||
                this.setSelection === 'all') &&
                (card['printing.card.users.wishlist.pref_foil'] === this.foilSelection ||
                this.foilSelection === 'all') &&
                (card['printing.card.users.wishlist.number_wanted'] >= this.cardNumberSelection ||
                this.cardNumberSelection === 'all')
      );
      refinedData[i].cards = refinedCards;
      if (refinedData[i].cards.length < 1) {
        refinedData.splice(refinedData[i], 1);
      }
      this.Otherdata = refinedData;
    }
  }
  initiateTrade(id) {
    console.log(`Initiating Trade with User: ${id}`);
    this._tradeService.initiateTrade(id).subscribe(result => {
      console.log(result);
    });
  }
}
