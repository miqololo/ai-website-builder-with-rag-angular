import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule, Mail, Loader2, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Forgot Password</h1>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        @if (isSuccess) {
          <div class="success-message">
            <p>If an account exists with this email, a password reset link has been sent.</p>
            <p>Please check your email inbox.</p>
          </div>
          <a [routerLink]="['/auth/signin']" class="back-link">
            <lucide-icon [img]="ArrowLeft" [size]="16"></lucide-icon>
            <span>Back to Sign In</span>
          </a>
        } @else {
          <form (ngSubmit)="onSubmit()" class="auth-form">
            @if (errorMessage) {
              <div class="error-message">
                {{ errorMessage }}
              </div>
            }

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

            <button
              type="submit"
              class="btn-primary"
              [disabled]="isLoading || !email">
              @if (isLoading) {
                <lucide-icon [img]="Loader2" [size]="20" class="spinning"></lucide-icon>
                <span>Sending...</span>
              } @else {
                <span>Send Reset Link</span>
              }
            </button>
          </form>

          <div class="auth-footer">
            <a [routerLink]="['/auth/signin']" class="back-link">
              <lucide-icon [img]="ArrowLeft" [size]="16"></lucide-icon>
              <span>Back to Sign In</span>
            </a>
          </div>
        }
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

    .auth-footer {
      margin-top: 24px;
      text-align: center;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #667eea;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .success-message {
      padding: 20px;
      background-color: #d1fae5;
      color: #065f46;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 24px;
    }

    .success-message p {
      margin: 8px 0;
      font-size: 14px;
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
export class ForgotPasswordComponent {
  Mail = Mail;
  Loader2 = Loader2;
  ArrowLeft = ArrowLeft;

  email = '';
  isLoading = false;
  errorMessage = '';
  isSuccess = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || error.message || 'Failed to send reset link. Please try again.';
      }
    });
  }
}
