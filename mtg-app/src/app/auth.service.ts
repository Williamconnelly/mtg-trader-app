import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Property to store backend API url
  private _registerUrl = 'http://localhost:3000/auth/signup';
  private _loginUrl = 'http://localhost:3000/auth/login';

  constructor(private http: HttpClient, private _router: Router) { }

  // Register User Method accepts user object and returns backend API response
  registerUser(user) {
    return this.http.post<any>(this._registerUrl, user);
  }
  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user);
  }
  loggedIn() {
    // Returns true or false based on the presence of the token in localStorage
    return !!localStorage.getItem('token');
  }
  getToken() {
    return localStorage.getItem('token');
  }
  logoutUser() {
    localStorage.removeItem('token');
    this._router.navigate(['/']);
  }
}

