import { AuthService } from '../_services/auth.service';

export function appInitializer(authenticationService: AuthService) {
  return () => new Promise(resolve => {
      // attempt to refresh token on app start up to auto authenticate
      authenticationService.refreshToken()
          .subscribe()
          .add(resolve(true));
  });
}
