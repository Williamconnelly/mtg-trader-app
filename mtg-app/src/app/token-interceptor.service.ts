import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class TokenInterceptorService implements HttpInterceptor {
//   // Using injector instead of direct injection because of potential dependency error
//   constructor(private _injector: Injector) { }

//   intercept(req, next) {
//     // Get instance of AuthService via injector
//     const authService = this._injector.get(AuthService);
//     // Create copy of original request and set new header 'Authorization'
//     const tokenizedReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${authService.getToken()}`
//       }
//     });
//     // Pass control to the next interceptor (if exist)
//     return next.handle(tokenizedReq);
//   }
// }

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(public auth: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Create copy of original request and set new header 'Authorization'
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.auth.getToken()}`
      }
    });
    // Pass control to the next interceptor (if exist)
    return next.handle(request);
  }
}
