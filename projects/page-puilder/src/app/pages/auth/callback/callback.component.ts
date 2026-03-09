import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="callback-container">
      <div class="callback-content">
        <lucide-icon [img]="Loader2" [size]="48" class="spinning"></lucide-icon>
        <p>Completing sign in...</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .callback-content {
      text-align: center;
      color: white;
    }

    .callback-content p {
      margin-top: 16px;
      font-size: 16px;
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
export class AuthCallbackComponent implements OnInit {
  Loader2 = Loader2;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const userStr = params['user'];

      if (token && userStr) {
        // Set auth data
        const user = JSON.parse(decodeURIComponent(userStr));
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        
        // Redirect to builder
        this.router.navigate(['/builder']);
      } else {
        // Handle error
        this.router.navigate(['/auth/signin'], {
          queryParams: { error: 'oauth_failed' }
        });
      }
    });
  }
}
