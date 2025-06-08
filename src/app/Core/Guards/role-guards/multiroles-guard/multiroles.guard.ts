import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../../../Services/auth-service/auth.service";
import {UserRole} from "../../../../Shared/Interfaces/Auth/user-role";

export function multirolesGuard(allowedRoles: UserRole[]): CanActivateFn {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUser();

    if (user && allowedRoles.includes(user.role)) {
      return true;
    }

    router.navigate([''], {
      queryParams: { returnUrl: state.url }
    });

    return false;
  };
}
