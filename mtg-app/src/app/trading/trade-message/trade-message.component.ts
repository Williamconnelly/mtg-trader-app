import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-trade-message',
  templateUrl: './trade-message.component.html',
  styleUrls: ['./trade-message.component.css']
})
export class TradeMessageComponent implements OnInit {
  @Input() socket;

  messageInput
  messages = [];

  constructor() { }

  ngOnInit() {
    console.log(this.socket);
    this.socket.on("message", this.receiveMessage.bind(this));

  }

  ngOnDestroy() {
    this.socket.removeListener("message", this.receiveMessage);
  }

  receiveMessage(data) {
    console.log(data);
    this.messages.push(data);
  }

  sendMessage() {
    this.socket.emit("message", this.messageInput);
    this.messageInput = "";
  }

}
