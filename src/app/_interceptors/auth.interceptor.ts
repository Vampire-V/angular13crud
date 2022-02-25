import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthService } from '../_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private jwtHelper: JwtHelperService = new JwtHelperService();
  constructor(
    private tokenService: TokenStorageService,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private route: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<Object>> {
    console.log('Auth intercepter...');

    const token = this.tokenService.getToken();
    console.log(token);

    if (token != null) {
      request = this.addTokenHeader(request, token);
    }
    // if (this.jwtHelper.isTokenExpired(token ?? undefined)) {
    //   this.tryRefreshingTokens()
    //   console.log("Auth intercepter refresh token..");
    // }

    return next.handle(request).pipe(
      catchError((error) => {
        console.log('error interceptor..');
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        console.log(error);
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    const token = this.tokenService.getToken();
    const refreshToken = this.tokenService.getRefreshToken();
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // if (token && refreshToken)
      if (token && this.jwtHelper.isTokenExpired(token)) {
        console.log('token exp');
        return this.authService.refreshToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;

            this.tokenService.saveToken(token.token);
            this.tokenService.saveRefreshToken(token.refreshToken);
            this.refreshTokenSubject.next(token.token);

            return next.handle(this.addTokenHeader(request, token.token));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.tokenService.signOut();
            return throwError(() => err);
          })
        );
      }
    }
    console.log(!this.isRefreshing);

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token))),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Spring Boot back-end */
    return request.clone({
      headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token),
    });

    /* for Node.js Express back-end */
    // return request.clone({
    //   headers: request.headers.set(TOKEN_HEADER_KEY, token),
    // });
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
