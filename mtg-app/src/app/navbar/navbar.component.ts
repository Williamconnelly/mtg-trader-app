import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  status = false;

  constructor(private _authService: AuthService) { }

  ngOnInit() {
  }
  clickEvent() {
    this.status = !this.status;
    console.log('ahhh');
  }
}
