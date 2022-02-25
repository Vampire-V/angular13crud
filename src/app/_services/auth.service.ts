import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { Auth } from '../_interfaces/auth';
import { User } from '../_interfaces/user';
import { TokenStorageService } from './token-storage.service';

const AUTH_API: string = environment.systemApi;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

interface AuthResponse {
  token: string;
  refreshToken: string;
  isSuccess: boolean;
  reason: string;
  user: User;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private tokenService: TokenStorageService
  ) {
  }


  sendVerifyCode(email: string): Observable<any> {
    return this.http
      .post(
        `${AUTH_API}/user/api/makeverifycode`,
        {
          email: email,
        },
        httpOptions
      )
      .pipe(retry(1), catchError(this.processError));
  }

  login(auth: Auth): Observable<any> {
    return this.http.post(
      `${AUTH_API}/user/authenticate`,
      {
        email: auth.email,
        verifyCode: auth.verifyCode,
      },
      httpOptions
    );
  }

  refreshToken(): Observable<any> {
    const token = this.tokenService.getToken();
    const refreshToken = this.tokenService.getRefreshToken();
    return this.http.post(
      `${AUTH_API}/user/refreshToken`,
      {
        expiredToken: token,
        refreshToken: refreshToken,
      },
      httpOptions
    );
    // .pipe(retry(1), catchError(this.processError));
  }

  processError(err: any) {
    // console.log(err);

    let message = '';
    if (err.error instanceof ErrorEvent) {
      message = err.error.message;
    } else {
      message = `Error Code: ${err.status}\nMessage: ${err.message}`;
    }
    // console.log(message);
    return throwError(() => {
      message;
    });
  }
}
