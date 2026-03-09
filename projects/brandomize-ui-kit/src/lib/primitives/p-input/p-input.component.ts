import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PInputConfig {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  class?: string[];
}

@Component({
  selector: 'bkit-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getWrapperClasses()">
      @if (getLabel()) {
        <label [class]="getLabelClasses()">
          {{ getLabel() }}
          @if (isRequired()) {
            <span [class]="getRequiredClasses()">*</span>
          }
        </label>
      }
      <input
        [type]="getType()"
        [placeholder]="getPlaceholder()"
        [disabled]="isDisabled()"
        [required]="isRequired()"
        [class]="getInputClasses()"
      />
    </div>
  `,
  styles: []
})
export class PInputComponent {
  @Input() config?: PInputConfig;
  @Input() type?: PInputConfig['type'];
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() required = false;
  @Input() disabled = false;

  constructor(public theme: ThemeService) {}

  getLabel(): string {
    return this.config?.label ?? this.label ?? '';
  }

  getPlaceholder(): string {
    return this.config?.placeholder ?? this.placeholder ?? 'Enter text...';
  }

  getType(): string {
    return this.config?.type ?? this.type ?? 'text';
  }

  isRequired(): boolean {
    return this.config?.required ?? this.required ?? false;
  }

  isDisabled(): boolean {
    return this.config?.disabled ?? this.disabled ?? false;
  }

  getLabelClasses(): string {
    const labelClass = this.theme.getPrimitiveClass('input.label', '');
    if (labelClass) {
      return this.theme.resolveThemePlaceholders(labelClass);
    }
    // Fallback - resolve placeholders manually
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const text = colors.text ?? 'gray-900';
    const textMutedLight = colors.textMutedLight ?? 'gray-300';
    return `block text-sm font-medium text-${text} dark:text-${textMutedLight} mb-1`;
  }

  getWrapperClasses(): string {
    const wrapperClass = this.theme.getPrimitiveClass('input.wrapper', 'w-full');
    // Parent component classes come first (can override theme classes)
    return [...(this.config?.class ?? []), wrapperClass].filter(Boolean).join(' ');
  }

  getRequiredClasses(): string {
    const requiredClass = this.theme.getPrimitiveClass('input.required', '');
    if (requiredClass) {
      return this.theme.resolveThemePlaceholders(requiredClass);
    }
    // Fallback - resolve placeholders manually
    const t = this.theme.themeResolved();
    const error = t.colors?.error ?? 'red-500';
    return `text-${error}`;
  }

  getInputClasses(): string {
    // Get base class from theme
    let baseClass = this.theme.getPrimitiveClass('input.base', '');
    if (baseClass) {
      // Resolve placeholders using theme service
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
      const disabledClass = this.theme.getPrimitiveClass('input.disabled', '');
      if (disabledClass) {
        baseClass += ' ' + this.theme.resolveThemePlaceholders(disabledClass);
      } else {
        const t = this.theme.themeResolved();
        const colors = t.colors ?? {};
        const surfaceMuted = colors.surfaceMuted ?? 'gray-100';
        const surfaceMutedDark = colors.surfaceMutedDark ?? 'gray-800';
        baseClass += ` bg-${surfaceMuted} dark:bg-${surfaceMutedDark} cursor-not-allowed opacity-50`;
      }
    }

    return baseClass;
  }
}
