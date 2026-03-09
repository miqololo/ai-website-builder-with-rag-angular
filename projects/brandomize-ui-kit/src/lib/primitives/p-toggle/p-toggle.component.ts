import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PToggleConfig {
  label?: string;
  checked?: boolean;
  required?: boolean;
  disabled?: boolean;
  class?: string[];
}

@Component({
  selector: 'bkit-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getWrapperClasses()">
      <label class="flex items-center gap-3 cursor-pointer">
        <div class="relative">
          <input
            type="checkbox"
            [checked]="isChecked()"
            [disabled]="isDisabled()"
            [required]="isRequired()"
            class="sr-only peer"
          />
          <div [class]="getToggleClasses()"></div>
        </div>
        @if (getLabel()) {
          <span [class]="getLabelClasses()">{{ getLabel() }}</span>
          @if (isRequired()) {
            <span [class]="getRequiredClasses()">*</span>
          }
        }
      </label>
    </div>
  `,
  styles: [`
    .toggle-switch {
      width: 3rem;
      height: 1.5rem;
      background-color: #d1d5db;
      border-radius: 9999px;
      transition: background-color 0.2s;
    }
    .toggle-switch:has(input:checked) {
      background-color: rgb(99 102 241);
    }
    .toggle-switch::after {
      content: '';
      position: absolute;
      top: 0.125rem;
      left: 0.125rem;
      width: 1.25rem;
      height: 1.25rem;
      background-color: white;
      border-radius: 9999px;
      transition: transform 0.2s;
    }
    .toggle-switch:has(input:checked)::after {
      transform: translateX(1.5rem);
    }
    .toggle-switch:has(input:disabled) {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class PToggleComponent {
  @Input() config?: PToggleConfig;
  @Input() label?: string;
  @Input() checked = false;
  @Input() required = false;
  @Input() disabled = false;

  constructor(public theme: ThemeService) {}

  getLabel(): string {
    return this.config?.label ?? this.label ?? '';
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

  getToggleClasses(): string {
    return 'toggle-switch';
  }

  getRequiredClasses(): string {
    return this.theme.getPrimitiveClass('toggle.required', 'text-red-500');
  }

  getLabelClasses(): string {
    const labelClass = this.theme.getPrimitiveClass('toggle.label', '');
    if (labelClass) {
      return this.theme.resolveThemePlaceholders(labelClass);
    }
    // Fallback
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-700';
    return `text-sm text-${text} dark:text-gray-300`;
  }
}
