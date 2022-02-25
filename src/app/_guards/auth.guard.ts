import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../_services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  public jwtHelper: JwtHelperService = new JwtHelperService();
  isRefreshSuccess: boolean = false;
  constructor(
    private tokenStorage: TokenStorageService,
    private authService: AuthService,
    private route: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.tokenStorage.getToken();
    if (token) {
      return true;
    }
    this.route.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
