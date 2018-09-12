import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Property to store backend API url
  private _registerUrl = 'http://localhost:3000/auth/signup';
  constructor(private http: HttpClient) { }

  // Register User Method accepts user object and returns backend API response
  registerUser(user) {
    return this.http.post<any>(this._registerUrl, user);
  }
}

