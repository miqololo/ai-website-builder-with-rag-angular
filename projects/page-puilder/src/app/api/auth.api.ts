import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../core/http/http-client.service';
import { AuthResponse, User } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private http = inject(HttpClientService);

  register(email: string, password: string, firstName?: string, lastName?: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/accounts/register', {
      email,
      password,
      firstName,
      lastName
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/accounts/login', {
      email,
      password
    });
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/accounts/forgot-password', {
      email
    });
  }

  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/accounts/reset-password', {
      token,
      password
    });
  }

  getProfile(): Observable<User> {
    return this.http.get<User>('/accounts/profile');
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.patch<User>('/accounts/profile', data);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>('/accounts/change-password', {
      currentPassword,
      newPassword
    });
  }
}
