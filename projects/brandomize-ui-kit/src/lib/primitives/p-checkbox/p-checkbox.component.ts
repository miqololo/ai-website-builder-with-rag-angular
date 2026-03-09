import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PCheckboxConfig {
  label?: string;
  checked?: boolean;
  required?: boolean;
  disabled?: boolean;
  class?: string[];
}

@Component({
  selector: 'bkit-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getWrapperClasses()">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          [checked]="isChecked()"
          [disabled]="isDisabled()"
          [required]="isRequired()"
          [class]="getCheckboxClasses()"
        />
        <span [class]="getLabelClasses()">{{ getLabel() }}</span>
        @if (isRequired()) {
          <span [class]="getRequiredClasses()">*</span>
        }
      </label>
    </div>
  `,
  styles: []
})
export class PCheckboxComponent {
  @Input() config?: PCheckboxConfig;
  @Input() label?: string;
  @Input() checked = false;
  @Input() required = false;
  @Input() disabled = false;

  constructor(public theme: ThemeService) {}

  getLabel(): string {
    return this.config?.label ?? this.label ?? 'Checkbox';
  }

  isChecked(): boolean {
    return this.config?.checked ?? this.checked ?? false;
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

  getCheckboxClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const primary = colors.primary ?? 'indigo-600';
    const borderMuted = colors.borderMuted ?? 'gray-300';
    const borderMutedDark = colors.borderMutedDark ?? 'gray-600';
    const base = [
      `w-4 h-4 rounded border-${borderMuted} dark:border-${borderMutedDark}`,
      'focus:ring-2 focus:ring-' + primary,
      'text-' + primary
    ];

    if (this.isDisabled()) {
      base.push('cursor-not-allowed opacity-50');
    }

    return base.join(' ');
  }

  getRequiredClasses(): string {
    return this.theme.getPrimitiveClass('checkbox.required', 'text-red-500');
  }

  getLabelClasses(): string {
    const labelClass = this.theme.getPrimitiveClass('checkbox.label', '');
    if (labelClass) {
      return this.theme.resolveThemePlaceholders(labelClass);
    }
    // Fallback
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-700';
    return `text-sm text-${text} dark:text-gray-300`;
  }
}
