import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, Sparkles, Loader2 } from 'lucide-angular';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { AiApi } from '../../core/api/ai.api';
import { AppError } from '../../core/errors/error-handler.service';

@Component({
  selector: 'app-initial-state',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="initial-state-container">
      <div class="initial-state-content">
        <div class="icon-wrapper">
          <lucide-icon [img]="Sparkles" [size]="64" class="sparkle-icon"></lucide-icon>
        </div>
        <h1 class="title">What about will be your website?</h1>
        <p class="subtitle">Describe your website and we'll create it for you</p>
        
        <form (ngSubmit)="onSubmit()" class="website-form">
          <textarea
            [(ngModel)]="websiteDescription"
            name="websiteDescription"
            class="description-input"
            rows="6"
            placeholder="Example: A modern SaaS landing page for a project management tool targeting small businesses. It should have a hero section, features, pricing, testimonials, and FAQ sections."
            [disabled]="isCreating">
          </textarea>
          
          <button
            type="submit"
            class="create-button"
            [disabled]="!canCreate() || isCreating">
            @if (isCreating) {
              <lucide-icon [img]="Loader2" [size]="20" class="spinning"></lucide-icon>
              <span>Creating website...</span>
            } @else {
              <span>Create Website</span>
            }
          </button>
        </form>
        
        @if (errorMessage) {
          <div class="error-message">
            {{ errorMessage }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .initial-state-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .initial-state-content {
      width: 100%;
      max-width: 600px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 48px 40px;
      text-align: center;
    }

    .icon-wrapper {
      margin-bottom: 24px;
    }

    .sparkle-icon {
      color: #667eea;
    }

    .title {
      font-size: 32px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 12px 0;
    }

    .subtitle {
      font-size: 16px;
      color: #6b7280;
      margin: 0 0 32px 0;
      line-height: 1.6;
    }

    .website-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .description-input {
      width: 100%;
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 16px;
      font-family: inherit;
      resize: vertical;
      min-height: 150px;
      transition: all 0.2s;
    }

    .description-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .description-input::placeholder {
      color: #9ca3af;
    }

    .description-input:disabled {
      background-color: #f3f4f6;
      cursor: not-allowed;
    }

    .create-button {
      padding: 16px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .create-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .create-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .error-message {
      margin-top: 16px;
      padding: 12px;
      background-color: #fee2e2;
      color: #dc2626;
      border-radius: 8px;
      font-size: 14px;
    }
  `]
})
export class InitialStateComponent {
  Sparkles = Sparkles;
  Loader2 = Loader2;

  websiteDescription = '';
  isCreating = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private aiApi: AiApi
  ) {}

  canCreate(): boolean {
    return this.websiteDescription.trim().length > 0 && !this.isCreating;
  }

  onSubmit(): void {
    if (!this.canCreate()) {
      return;
    }

    this.isCreating = true;
    this.errorMessage = '';

    this.aiApi.createWebsite({
      request: this.websiteDescription.trim(),
    }).subscribe({
      next: (response) => {
        const requestId = response.requestId;
        
        // Connect to SSE stream and wait for completion
        this.aiApi.streamWebsiteCreation(requestId).subscribe({
          next: (event) => {
            if (event.type === 'completed' && event.data) {
              const websiteId = event.data.websiteId;
              const pageId = event.data.pageId;
              
              if (websiteId && pageId) {
                this.redirectToPreview(websiteId, pageId);
                this.isCreating = false;
              } else {
                this.errorMessage = 'Website created but missing IDs. Please check the request status.';
                this.isCreating = false;
              }
            } else if (event.type === 'error') {
              this.errorMessage = event.data?.error || 'An error occurred during website creation';
              this.isCreating = false;
            }
            // Log other events for debugging (phase-start, phase-update, component-generated, etc.)
          },
          error: (error) => {
            this.errorMessage = 'Failed to connect to creation stream. Please try again.';
            this.isCreating = false;
            console.error('SSE stream error:', error);
          },
          complete: () => {
            // Stream completed but no completion event received
            if (this.isCreating) {
              this.errorMessage = 'Website creation stream ended unexpectedly. Please check the request status.';
              this.isCreating = false;
            }
          }
        });
      },
      error: (error: AppError | any) => {
        // Extract error message - handle both AppError and HttpErrorResponse
        if (error && typeof error === 'object') {
          // AppError structure (from error handler)
          if ('message' in error) {
            this.errorMessage = error.message;
          }
          // HttpErrorResponse structure (fallback)
          else if (error.error?.message) {
            this.errorMessage = error.error.message;
          }
          // Generic error message
          else if (error.message) {
            this.errorMessage = error.message;
          }
          else {
            this.errorMessage = 'Failed to create website. Please try again.';
          }
        } else {
          this.errorMessage = 'Failed to create website. Please try again.';
        }
        
        this.isCreating = false;
        console.error('Error creating website:', error);
      }
    });
  }

  private redirectToPreview(websiteId: string, pageId: string): void {
    // Redirect to preview app at localhost:4201
    window.location.href = `http://localhost:4201?websiteId=${websiteId}&pageId=${pageId}`;
  }
}
