import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule, Lock, Loader2, ArrowLeft, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Reset Password</h1>
          <p>Enter your new password below.</p>
        </div>

        @if (isSuccess) {
          <div class="success-message">
            <lucide-icon [img]="CheckCircle" [size]="48" class="success-icon"></lucide-icon>
            <p>Password has been reset successfully!</p>
            <a [routerLink]="['/auth/signin']" class="btn-primary">
              Go to Sign In
            </a>
          </div>
        } @else {
          <form (ngSubmit)="onSubmit()" class="auth-form">
            @if (errorMessage) {
              <div class="error-message">
                {{ errorMessage }}
              </div>
            }

            <div class="form-group">
              <label for="password">New Password</label>
              <div class="input-wrapper">
                <lucide-icon [img]="Lock" [size]="20" class="input-icon"></lucide-icon>
                <input
                  id="password"
                  type="password"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="Enter new password (min 8 characters)"
                  required
                  minlength="8"
                  [disabled]="isLoading"
                  class="form-input">
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <div class="input-wrapper">
                <lucide-icon [img]="Lock" [size]="20" class="input-icon"></lucide-icon>
                <input
                  id="confirmPassword"
                  type="password"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  required
                  [disabled]="isLoading"
                  class="form-input">
              </div>
            </div>

            @if (password && confirmPassword && password !== confirmPassword) {
              <div class="error-message">
                Passwords do not match
              </div>
            }

            <button
              type="submit"
              class="btn-primary"
              [disabled]="isLoading || !password || !confirmPassword || password.length < 8 || password !== confirmPassword">
              @if (isLoading) {
                <lucide-icon [img]="Loader2" [size]="20" class="spinning"></lucide-icon>
                <span>Resetting...</span>
              } @else {
                <span>Reset Password</span>
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
      text-decoration: none;
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
      text-align: center;
    }

    .success-icon {
      color: #10b981;
      margin-bottom: 16px;
    }

    .success-message p {
      margin: 16px 0;
      font-size: 16px;
      color: #374151;
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
export class ResetPasswordComponent implements OnInit {
  Lock = Lock;
  Loader2 = Loader2;
  ArrowLeft = ArrowLeft;
  CheckCircle = CheckCircle;

  token = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  errorMessage = '';
  isSuccess = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.errorMessage = 'Invalid reset token. Please request a new password reset.';
      }
    });
  }

  onSubmit(): void {
    if (!this.token || !this.password || !this.confirmPassword) {
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.resetPassword(this.token, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || error.message || 'Failed to reset password. Please try again.';
      }
    });
  }
}
