import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../../Services/auth-service/auth.service";
import {inject} from "@angular/core";

export const emailVerifiedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (user && user.isEmailVerified) {
    return true;
  }

  router.navigate(['/verifyemail'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
