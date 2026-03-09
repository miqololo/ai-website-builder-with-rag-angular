import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PAlertConfig {
  title?: string;
  message?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
  icon?: string;
  class?: string[];
}

@Component({
  selector: 'bkit-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getAlertClasses()" role="alert">
      <div class="flex">
        <div class="flex-1">
          @if (getTitle()) {
            <h4 class="font-semibold mb-1">{{ getTitle() }}</h4>
          }
          <div [class]="getMessageClasses()">
            <ng-content></ng-content>
            @if (!hasContent()) {
              {{ getMessage() }}
            }
          </div>
        </div>
        @if (isDismissible()) {
          <button
            type="button"
            (click)="dismiss()"
            [class]="getDismissButtonClasses()"
          >
            <span class="sr-only">Dismiss</span>
            <span class="text-lg leading-none">×</span>
          </button>
        }
      </div>
    </div>
  `,
  styles: []
})
export class PAlertComponent {
  @Input() config?: PAlertConfig;
  @Input() title?: string;
  @Input() message?: string;
  @Input() variant?: PAlertConfig['variant'];
  @Input() dismissible = false;

  private dismissed = false;

  constructor(public theme: ThemeService) {}

  hasContent(): boolean {
    return false;
  }

  getTitle(): string {
    return this.config?.title ?? this.title ?? '';
  }

  getMessage(): string {
    return this.config?.message ?? this.message ?? '';
  }

  isDismissible(): boolean {
    return this.config?.dismissible ?? this.dismissible ?? false;
  }

  dismiss(): void {
    this.dismissed = true;
  }

  getDismissButtonClasses(): string {
    return this.theme.getPrimitiveClass('alert.dismissButton', 'ml-4 shrink-0 rounded-md p-1.5 inline-flex hover:opacity-75 focus:outline-none');
  }

  getAlertClasses(): string {
    if (this.dismissed) return 'hidden';

    const variant = this.config?.variant ?? this.variant ?? 'info';

    // Get base class from theme
    const baseClass = this.theme.getPrimitiveClass('alert.base', 'rounded-lg border p-4');
    
    // Get variant class from theme
    let variantClass = this.theme.getPrimitiveClass(`alert.variants.${variant}`, '');
    if (!variantClass) {
      // Fallback
      const variantMap: Record<string, string> = {
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
        success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
      };
      variantClass = variantMap[variant] ?? variantMap['info'];
    }

    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} ${baseClass} ${variantClass}`.trim();
  }

  getMessageClasses(): string {
    const messageClass = this.theme.getPrimitiveClass('alert.message', 'text-sm');
    return this.getTitle() ? messageClass : '';
  }
}
