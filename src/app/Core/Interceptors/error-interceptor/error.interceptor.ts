import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {catchError, throwError} from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error) => {
      const backendMessage = error.error?.message;
      const backendErrors: string[] = error.error?.errors || [];
      const time: number = 4000;

      switch (error.status) {
        case 400:
          if (backendErrors.length > 0) {
            backendErrors.forEach(err => toastr.error(err, '', { timeOut: time }));
          } else {
            toastr.error(backendMessage || 'Bad Request', '', { timeOut: time });
          }
          break;
        case 401:
          toastr.warning(backendMessage || 'Unauthorized, please log in', '', { timeOut: time });
          router.navigate(['/login']);
          break;
        case 403:
          toastr.warning(backendMessage || 'Forbidden', '', { timeOut: time });
          break;
        case 404:
          toastr.info(backendMessage || 'Not Found', '', { timeOut: time });
          break;
        case 500:
          toastr.error(backendMessage || 'Server Error, please try again later', '', { timeOut: time });
          break;
        default:
          toastr.error(backendMessage || 'An unexpected error occurred', '', { timeOut: time });
      }

      return throwError(() => error);
    })
  );
};
