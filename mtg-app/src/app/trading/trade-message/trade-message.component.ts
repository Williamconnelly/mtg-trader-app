import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TradeService } from '../trade.service';

@Component({
  selector: 'app-trade-message',
  templateUrl: './trade-message.component.html',
  styleUrls: ['./trade-message.component.css']
})
export class TradeMessageComponent implements OnInit {
  @Input() socket;
  @Input() loggedUser;
  @Input() partner;
  @Input() messages;
  @Input() tradeId;

  usernames = {};

  messageInput

  constructor(private _trade: TradeService) { }

  ngOnInit() {
    this.usernames[this.loggedUser.id.toString()] = this.loggedUser.username;
    this.usernames[this.partner.id.toString()] = this.partner.username;
    console.log(this.socket);
    this.socket.on("tradeMessage", this.receiveMessage.bind(this));

  }

  ngOnDestroy() {
    this.socket.removeListener("tradeMessage", this.receiveMessage);
  }

  receiveMessage(data) {
    this.messages.push(data);
  }

  sendMessage() {
    let messageObject = {
      userId: this.loggedUser.id,
      tradeId: this.tradeId,
      content: this.messageInput
    }
    this.messageInput = "";
    this._trade.sendMessage(messageObject).subscribe(data => {
      if (data["status"] === "Success") {
        this.messages.push(data["messageObject"]);
        this.socket.emit("tradeMessage", {
          roomName: "trade" + this.tradeId,
          messageObject: data["messageObject"]
        })
      }
    });
  }

}
