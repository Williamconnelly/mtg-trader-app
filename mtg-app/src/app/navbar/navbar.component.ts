import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private _authService: AuthService) { }

  ngOnInit() {
    if (this._authService.loggedIn()) {
      this._authService.getUser().subscribe(data => {
        this._authService.storeUser(data);
      });
    }
  }
}
