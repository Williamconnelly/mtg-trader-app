import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket = io('http://localhost:3000');
  
  constructor() { }

  connect() {
    return this.socket;
  }
}
