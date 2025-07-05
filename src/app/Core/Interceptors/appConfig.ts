import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {authInterceptor} from "./auth-interceptor/auth.interceptor";
import {errorInterceptor} from "./error-interceptor/error.interceptor";

export const appConfig = [
  provideHttpClient(
    withInterceptors([
      authInterceptor,
      errorInterceptor
    ])
  )
];
