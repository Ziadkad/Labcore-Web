import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Login } from '../../../Shared/Interfaces/Auth/login';
import { AuthResponse } from '../../../Shared/Interfaces/Auth/auth-response';
import { Register } from '../../../Shared/Interfaces/Auth/register';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth/User`;
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'current_user';
  private logoutTimer: any = null;

  private readonly _currentUser = signal<AuthResponse | null>(null);
  readonly currentUser = this._currentUser;
  readonly isAuthenticated = computed(() => !!this._currentUser());

  constructor(
    private readonly http: HttpClient,
    private readonly localStorageService: LocalStorageService
  ) {
    this.loadAuthState();
  }

  login(payload: Login): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap(res => {
        this.localStorageService.setItem(this.tokenKey, res.token);
        this.localStorageService.setItem(this.userKey, res);
        this._currentUser.set(res);
        this.loadAuthState();
        const exp = this.getTokenExpiration(res.token);
        if (exp) {
          this.scheduleAutoLogout(exp);
        }
      }),
      catchError(() => {
        this.logout();
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  register(payload: Register): Observable<AuthResponse> {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, formData).pipe(
      tap(res => {
        this.localStorageService.setItem(this.tokenKey, res.token);
        this.localStorageService.setItem(this.userKey, res);
        this._currentUser.set(res);
        this.loadAuthState();
        const exp = this.getTokenExpiration(res.token);
        if (exp) {
          this.scheduleAutoLogout(exp);
        }
      }),
      catchError(() => {
        this.logout();
        return throwError(() => new Error('Registration failed'));
      })
    );
  }

  logout(): void {
    this.localStorageService.removeItem(this.tokenKey);
    this.localStorageService.removeItem(this.userKey);
    this._currentUser.set(null);
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  VerifyRequest(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/requestVerification`, {}).pipe(
      tap(() => {
        console.log('Verification email requested');
      }),
      catchError((err) => {
        console.error('Error requesting verification', err);
        return of();
      })
    );
  }

  verifyEmail(payload: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/verifyEmail`, payload).pipe(
      tap(() => {
        const current = this._currentUser();
        if (current) {
          const updatedUser: AuthResponse = { ...current, isEmailVerified: true };
          this.localStorageService.setItem(this.userKey, updatedUser);
          this._currentUser.set(updatedUser);
        }
        console.log('Email verified');
      }),
      catchError((err) => {
        console.error('Error verifying email', err);
        return of();
      })
    );
  }

  private loadAuthState(): void {
    const token = this.localStorageService.getItem<string>(this.tokenKey);
    const user = this.localStorageService.getItem<AuthResponse>(this.userKey);
    const exp = token ? this.getTokenExpiration(token) : null;

    if (token && user && exp && exp > Math.floor(Date.now() / 1000)) {
      this._currentUser.set(user);
      this.scheduleAutoLogout(exp);
    } else {
      this.logout();
    }
  }

  private decodeToken(token: string): any | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  private isTokenValid(token: string): boolean {
    const payload = this.decodeToken(token);
    const now = Math.floor(Date.now() / 1000);
    return payload?.exp && payload.exp > now;
  }

  private getTokenExpiration(token: string): number | null {
    const payload = this.decodeToken(token);
    return payload?.exp ?? null;
  }

  private scheduleAutoLogout(expirationUnix: number): void {
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = expirationUnix - now;

    if (expiresIn > 0) {
      if (this.logoutTimer) {
        clearTimeout(this.logoutTimer);
      }

      this.logoutTimer = setTimeout(() => {
        this.logout();
        console.warn('User has been automatically logged out due to token expiration.');
      }, expiresIn * 1000);
    }
  }
}
