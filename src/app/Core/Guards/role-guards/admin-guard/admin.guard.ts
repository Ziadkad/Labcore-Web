import {CanMatchFn, Router} from '@angular/router';
import {UserRole} from "../../../../Shared/Interfaces/Auth/user-role";
import {inject} from "@angular/core";
import {AuthService} from "../../../Services/auth-service/auth.service";

export const adminGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (user && user.role === UserRole.Admin) {
    return true;
  }

  // Redirect if not authorized
  router.navigate([''], {
    queryParams: { returnUrl: '/' + segments.map(s => s.path).join('/') }
  });
  return false;
};
