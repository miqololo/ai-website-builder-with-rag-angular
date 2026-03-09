import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PDropdownOption {
  label: string;
  value: string;
}

export interface PDropdownConfig {
  label?: string;
  placeholder?: string;
  options?: PDropdownOption[];
  required?: boolean;
  disabled?: boolean;
  class?: string[];
}

@Component({
  selector: 'bkit-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getWrapperClasses()">
      @if (getLabel()) {
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ getLabel() }}
          @if (isRequired()) {
            <span [class]="getRequiredClasses()">*</span>
          }
        </label>
      }
      <select
        [disabled]="isDisabled()"
        [required]="isRequired()"
        [class]="getSelectClasses()"
      >
        @if (getPlaceholder()) {
          <option value="" disabled>{{ getPlaceholder() }}</option>
        }
        @for (option of getOptions(); track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
    </div>
  `,
  styles: []
})
export class PDropdownComponent {
  @Input() config?: PDropdownConfig;
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() options: PDropdownOption[] = [];
  @Input() required = false;
  @Input() disabled = false;

  constructor(public theme: ThemeService) {}

  getLabel(): string {
    return this.config?.label ?? this.label ?? '';
  }

  getPlaceholder(): string {
    return this.config?.placeholder ?? this.placeholder ?? '';
  }

  getOptions(): PDropdownOption[] {
    return this.config?.options ?? this.options ?? [];
  }

  isRequired(): boolean {
    return this.config?.required ?? this.required ?? false;
  }

  isDisabled(): boolean {
    return this.config?.disabled ?? this.disabled ?? false;
  }

  getWrapperClasses(): string {
    return ['w-full', ...(this.config?.class ?? [])].join(' ');
  }

  getRequiredClasses(): string {
    const requiredClass = this.theme.getPrimitiveClass('dropdown.required', '');
    if (requiredClass) {
      return this.theme.resolveThemePlaceholders(requiredClass);
    }
    // Fallback - resolve placeholders manually
    const t = this.theme.themeResolved();
    const error = t.colors?.error ?? 'red-500';
    return `text-${error}`;
  }

  getSelectClasses(): string {
    // Get base class from theme
    let baseClass = this.theme.getPrimitiveClass('dropdown.base', '');
    if (baseClass) {
      baseClass = this.theme.resolveThemePlaceholders(baseClass);
    } else {
      // Fallback
      const t = this.theme.themeResolved();
      const colors = t.colors ?? {};
      const primary = colors.primary ?? 'indigo-600';
      const borderMuted = colors.borderMuted ?? 'gray-300';
      const borderMutedDark = colors.borderMutedDark ?? 'gray-600';
      const surfaceMutedDark = colors.surfaceMutedDark ?? 'gray-800';
      const text = colors.text ?? 'gray-900';
      baseClass = `w-full px-3 py-2 border border-${borderMuted} dark:border-${borderMutedDark} rounded-lg focus:outline-none focus:ring-2 focus:ring-${primary} focus:border-transparent transition-colors bg-${colors.background ?? 'white'} dark:bg-${surfaceMutedDark} text-${text} dark:text-${colors.background ?? 'white'}`;
    }

    if (this.isDisabled()) {
      const t = this.theme.themeResolved();
      const colors = t.colors ?? {};
      const surfaceMuted = colors.surfaceMuted ?? 'gray-100';
      const surfaceMutedDark = colors.surfaceMutedDark ?? 'gray-800';
      baseClass += ` bg-${surfaceMuted} dark:bg-${surfaceMutedDark} cursor-not-allowed opacity-50`;
    }

    return baseClass;
  }
}
