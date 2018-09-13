import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) { }

  canActivate(): boolean {
    // If the user is logged in (has a token) return true
    if (this._authService.loggedIn()) {
      return true;
    } else {
      // If the user is not logged in, redirect to the login route
      this._router.navigate(['/login']);
      return false;
    }
  }
}
