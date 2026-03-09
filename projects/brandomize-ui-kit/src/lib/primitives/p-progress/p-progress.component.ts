import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PProgressConfig {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  class?: string[];
}

@Component({
  selector: 'bkit-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getWrapperClasses()">
      @if (getLabel() || shouldShowValue()) {
        <div class="flex justify-between items-center mb-1">
          @if (getLabel()) {
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ getLabel() }}</span>
          }
          @if (shouldShowValue()) {
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ getValue() }}%</span>
          }
        </div>
      }
      <div [class]="getTrackClasses()">
        <div [class]="getBarClasses()" [style.width.%]="getPercent()"></div>
      </div>
    </div>
  `,
  styles: []
})
export class PProgressComponent {
  @Input() config?: PProgressConfig;
  @Input() value?: number;
  @Input() max = 100;
  @Input() label?: string;
  @Input() showValue = false;

  constructor(public theme: ThemeService) {}

  getValue(): number {
    return Math.min(Math.max(this.config?.value ?? this.value ?? 0, 0), this.getMax());
  }

  getMax(): number {
    return this.config?.max ?? this.max ?? 100;
  }

  getPercent(): number {
    return Math.round((this.getValue() / this.getMax()) * 100);
  }

  getLabel(): string {
    return this.config?.label ?? this.label ?? '';
  }

  shouldShowValue(): boolean {
    return this.config?.showValue ?? this.showValue ?? false;
  }

  getWrapperClasses(): string {
    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} w-full`.trim();
  }

  getTrackClasses(): string {
    const t = this.theme.themeResolved();
    const size = this.config?.size ?? 'md';
    const sizeMap: Record<string, string> = {
      sm: 'h-1.5',
      md: 'h-2',
      lg: 'h-3'
    };
    const colors = t.colors ?? {};
    const surfaceMuted = colors.surfaceMuted ?? 'gray-200';
    const surfaceMutedDark = colors.surfaceMutedDark ?? 'gray-700';
    return `w-full bg-${surfaceMuted} dark:bg-${surfaceMutedDark} rounded-full overflow-hidden ${sizeMap[size]}`;
  }

  getBarClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const primary = colors.primary ?? 'indigo-600';
    const success = colors.success ?? 'green-600';
    const warning = colors.warning ?? 'yellow-600';
    const error = colors.error ?? 'red-600';
    const variant = this.config?.variant ?? 'default';

    const variantMap: Record<string, string> = {
      default: `bg-${primary}`,
      primary: `bg-${primary}`,
      success: `bg-${success}`,
      warning: `bg-${warning}`,
      danger: `bg-${error}`
    };

    return `h-full rounded-full transition-all duration-300 ${variantMap[variant]}`;
  }
}
