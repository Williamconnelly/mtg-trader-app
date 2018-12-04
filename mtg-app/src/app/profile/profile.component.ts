import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userId: number;
  loggedUser;
  owner: Boolean = false;
  constructor(private _route: ActivatedRoute, private _auth: AuthService) { }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      this.userId = parseInt(params.userId);
      console.log(this.userId);
      this.checkUser();
    });
  }
  checkUser() {
    if (this._auth.returnUser() === false) {
      setTimeout(() => {
        this.checkUser();
      }, 50);
    } else {
      this.loggedUser = this._auth.returnUser();
      if (this.loggedUser.id === this.userId) {
        this.owner = true;
        console.log(this.owner);
      }
    }
  }
}
