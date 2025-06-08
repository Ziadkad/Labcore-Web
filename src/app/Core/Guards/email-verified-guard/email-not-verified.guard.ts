import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../../Services/auth-service/auth.service";

export const emailNotVerifiedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (user && !user.isEmailVerified) {
    return true;
  }

  router.navigate([''], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
