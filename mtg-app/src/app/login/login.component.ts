import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginUserData = {};
  errors = {};
  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  loginUser() {
    this._auth.loginUser(this.loginUserData).subscribe(
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
      },
      err => console.log(err)
    );
  }
}
