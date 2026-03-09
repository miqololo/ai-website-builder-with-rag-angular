import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PRadioOption {
  label: string;
  value: string;
}

export interface PRadioConfig {
  label?: string;
  name?: string;
  options?: PRadioOption[];
  value?: string;
  required?: boolean;
  disabled?: boolean;
  class?: string[];
}

@Component({
  selector: 'bkit-radio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getWrapperClasses()">
      @if (getGroupLabel()) {
        <label [class]="getGroupLabelClasses()">
          {{ getGroupLabel() }}
          @if (isRequired()) {
            <span [class]="getRequiredClasses()">*</span>
          }
        </label>
      }
      <div class="flex flex-col gap-2">
        @for (option of getOptions(); track option.value) {
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              [name]="getName()"
              [value]="option.value"
              [checked]="isChecked(option.value)"
              [disabled]="isDisabled()"
              [required]="isRequired()"
              [class]="getRadioClasses()"
            />
            <span [class]="getOptionLabelClasses()">{{ option.label }}</span>
          </label>
        }
      </div>
    </div>
  `,
  styles: []
})
export class PRadioComponent {
  @Input() config?: PRadioConfig;
  @Input() label?: string;
  @Input() name = 'radio-group';
  @Input() options: PRadioOption[] = [];
  @Input() value?: string;
  @Input() required = false;
  @Input() disabled = false;

  constructor(public theme: ThemeService) {}

  getGroupLabel(): string {
    return this.config?.label ?? this.label ?? '';
  }

  getName(): string {
    return this.config?.name ?? this.name ?? 'radio-group';
  }

  getOptions(): PRadioOption[] {
    return this.config?.options ?? this.options ?? [];
  }

  isChecked(optionValue: string): boolean {
    return (this.config?.value ?? this.value) === optionValue;
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

  getRadioClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const primary = colors.primary ?? 'indigo-600';
    const borderMuted = colors.borderMuted ?? 'gray-300';
    const borderMutedDark = colors.borderMutedDark ?? 'gray-600';
    const base = [
      `w-4 h-4 border-${borderMuted} dark:border-${borderMutedDark}`,
      'focus:ring-2 focus:ring-' + primary,
      'text-' + primary
    ];

    if (this.isDisabled()) {
      base.push('cursor-not-allowed opacity-50');
    }

    return base.join(' ');
  }

  getGroupLabelClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-700';
    return `block text-sm font-medium text-${text} dark:text-gray-300 mb-2`;
  }

  getRequiredClasses(): string {
    return this.theme.getPrimitiveClass('radio.required', 'text-red-500');
  }

  getOptionLabelClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-700';
    return `text-sm text-${text} dark:text-gray-300`;
  }
}
