import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule, Mail, Lock, User, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Sign Up</h1>
          <p>Create your account to get started.</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          @if (errorMessage) {
            <div class="error-message">
              {{ errorMessage }}
            </div>
          }

          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <div class="input-wrapper">
                <lucide-icon [img]="User" [size]="20" class="input-icon"></lucide-icon>
                <input
                  id="firstName"
                  type="text"
                  [(ngModel)]="firstName"
                  name="firstName"
                  placeholder="First name"
                  [disabled]="isLoading"
                  class="form-input">
              </div>
            </div>

            <div class="form-group">
              <label for="lastName">Last Name</label>
              <div class="input-wrapper">
                <lucide-icon [img]="User" [size]="20" class="input-icon"></lucide-icon>
                <input
                  id="lastName"
                  type="text"
                  [(ngModel)]="lastName"
                  name="lastName"
                  placeholder="Last name"
                  [disabled]="isLoading"
                  class="form-input">
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-wrapper">
              <lucide-icon [img]="Mail" [size]="20" class="input-icon"></lucide-icon>
              <input
                id="email"
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="Enter your email"
                required
                [disabled]="isLoading"
                class="form-input">
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <lucide-icon [img]="Lock" [size]="20" class="input-icon"></lucide-icon>
              <input
                id="password"
                type="password"
                [(ngModel)]="password"
                name="password"
                placeholder="Enter your password (min 8 characters)"
                required
                minlength="8"
                [disabled]="isLoading"
                class="form-input">
            </div>
          </div>

          <button
            type="submit"
            class="btn-primary"
            [disabled]="isLoading || !email || !password || password.length < 8">
            @if (isLoading) {
              <lucide-icon [img]="Loader2" [size]="20" class="spinning"></lucide-icon>
              <span>Creating account...</span>
            } @else {
              <span>Sign Up</span>
            }
          </button>
        </form>

        <div class="auth-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          class="btn-google"
          (click)="onGoogleLogin()"
          [disabled]="isLoading">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div class="auth-footer">
          <p>Already have an account? <a [routerLink]="['/auth/signin']">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card {
      width: 100%;
      max-width: 440px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 40px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .auth-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px 0;
    }

    .auth-header p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 12px;
      color: #9ca3af;
      pointer-events: none;
    }

    .form-input {
      width: 100%;
      padding: 12px 12px 12px 44px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }

    .btn-primary {
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-divider {
      margin: 24px 0;
      text-align: center;
      position: relative;
    }

    .auth-divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e5e7eb;
    }

    .auth-divider span {
      position: relative;
      background: white;
      padding: 0 16px;
      color: #6b7280;
      font-size: 14px;
    }

    .btn-google {
      width: 100%;
      padding: 12px 24px;
      background: white;
      color: #374151;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .btn-google:hover:not(:disabled) {
      border-color: #d1d5db;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .btn-google:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-footer {
      margin-top: 24px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
    }

    .auth-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    .error-message {
      padding: 12px;
      background-color: #fee2e2;
      color: #dc2626;
      border-radius: 8px;
      font-size: 14px;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class SignupComponent {
  Mail = Mail;
  Lock = Lock;
  User = User;
  Loader2 = Loader2;

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password || this.password.length < 8) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(
      this.email,
      this.password,
      this.firstName || undefined,
      this.lastName || undefined
    ).subscribe({
      next: () => {
        this.router.navigate(['/builder']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || error.message || 'Failed to create account. Please try again.';
      }
    });
  }

  onGoogleLogin(): void {
    this.authService.googleLogin();
  }
}
