import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthApi } from '../api/auth.api';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  tenantId?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authApi = inject(AuthApi);
  private router = inject(Router);
  
  private currentUser$ = new BehaviorSubject<User | null>(null);
  private token$ = new BehaviorSubject<string | null>(null);

  constructor() {
    // Load user from localStorage on init
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (token && userStr) {
      this.token$.next(token);
      this.currentUser$.next(JSON.parse(userStr));
    }
  }

  get currentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  get token(): string | null {
    return this.token$.value;
  }

  get isAuthenticated(): boolean {
    return !!this.token$.value;
  }

  register(email: string, password: string, firstName?: string, lastName?: string): Observable<AuthResponse> {
    return this.authApi.register(email, password, firstName, lastName).pipe(
      tap(response => this.setAuth(response))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.authApi.login(email, password).pipe(
      tap(response => this.setAuth(response))
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.authApi.forgotPassword(email);
  }

  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this.authApi.resetPassword(token, password);
  }

  googleLogin(): void {
    const apiBaseUrl = environment.apiBaseUrl || 'http://localhost:3000';
    window.location.href = `${apiBaseUrl}/api/auth/google`;
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.token$.next(null);
    this.currentUser$.next(null);
    this.router.navigate(['/auth/signin']);
  }

  private setAuth(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.accessToken);
    localStorage.setItem('auth_user', JSON.stringify(response.user));
    this.token$.next(response.accessToken);
    this.currentUser$.next(response.user);
  }

  getAuthHeaders(): { [key: string]: string } {
    const token = this.token$.value;
    if (!token) {
      return {};
    }
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  getAuthToken(): string | null {
    return this.token$.value;
  }
}
