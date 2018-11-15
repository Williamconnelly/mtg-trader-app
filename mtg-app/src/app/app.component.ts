import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mtg-app';

  constructor(private _auth: AuthService) { }

  ngOnInit() {
    if (this._auth.loggedIn()) {
      this._auth.getUser().subscribe(data => {
        this._auth.storeUser(data);
      })
    }
  }
}
