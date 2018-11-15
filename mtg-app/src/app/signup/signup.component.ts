import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  registerUserData = {};
  errors = {};
  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  registerUser() {
    this._auth.registerUser(this.registerUserData).subscribe(
      res => {
        console.log(res);
        if (res.hasOwnProperty('error')) {
          this.errors = res;
        } else {
        localStorage.setItem('token', res.token);
        this._auth.getUser().subscribe(data => {
          this._auth.storeUser(data);
        })
        this._router.navigate(['/']);
        }
      }
    );
  }
}
