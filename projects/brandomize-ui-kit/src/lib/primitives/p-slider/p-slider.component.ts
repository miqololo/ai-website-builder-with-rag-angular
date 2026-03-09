import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PSliderConfig {
  label?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  showLabels?: boolean;
  required?: boolean;
  disabled?: boolean;
  class?: string[];
}

@Component({
  selector: 'bkit-slider',
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
          @if (shouldShowValue()) {
            <span [class]="getValueClasses()">{{ getValue() }}</span>
          }
        </label>
      }
      <input
        type="range"
        [min]="getMin()"
        [max]="getMax()"
        [step]="getStep()"
        [value]="getValue()"
        [disabled]="isDisabled()"
        [required]="isRequired()"
        [class]="getSliderClasses()"
      />
      @if (shouldShowLabels()) {
        <div [class]="getLabelsClasses()">
          <span>{{ getMin() }}</span>
          <span>{{ getMax() }}</span>
        </div>
      }
    </div>
  `,
  styles: []
})
export class PSliderComponent {
  @Input() config?: PSliderConfig;
  @Input() label?: string;
  @Input() value?: number;
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() showValue = false;
  @Input() showLabels = false;
  @Input() required = false;
  @Input() disabled = false;

  constructor(public theme: ThemeService) {}

  getLabel(): string {
    return this.config?.label ?? this.label ?? '';
  }

  getValue(): number {
    return this.config?.value ?? this.value ?? this.getMin();
  }

  getMin(): number {
    return this.config?.min ?? this.min ?? 0;
  }

  getMax(): number {
    return this.config?.max ?? this.max ?? 100;
  }

  getStep(): number {
    return this.config?.step ?? this.step ?? 1;
  }

  shouldShowValue(): boolean {
    return this.config?.showValue ?? this.showValue ?? false;
  }

  shouldShowLabels(): boolean {
    return this.config?.showLabels ?? this.showLabels ?? false;
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

  getSliderClasses(): string {
    // Get base class from theme
    let baseClass = this.theme.getPrimitiveClass('slider.base', '');
    if (baseClass) {
      baseClass = this.theme.resolveThemePlaceholders(baseClass);
    } else {
      // Fallback - use theme colors
      const t = this.theme.themeResolved();
      const colors = t.colors ?? {};
      const primary = colors.primary ?? 'indigo-600';
      const surfaceMuted = colors.surfaceMuted ?? 'gray-200';
      const surfaceMutedDark = colors.surfaceMutedDark ?? 'gray-700';
      baseClass = `w-full h-2 bg-${surfaceMuted} dark:bg-${surfaceMutedDark} rounded-lg appearance-none cursor-pointer accent-${primary}`;
    }

    if (this.isDisabled()) {
      baseClass += ' opacity-50 cursor-not-allowed';
    }

    return baseClass;
  }

  getLabelClasses(): string {
    const labelClass = this.theme.getPrimitiveClass('slider.label', '');
    if (labelClass) {
      return this.theme.resolveThemePlaceholders(labelClass);
    }
    // Fallback
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-700';
    return `block text-sm font-medium text-${text} dark:text-${t.colors?.textMutedLight ?? 'gray-300'} mb-1`;
  }

  getValueClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `ml-2 text-${textMutedLight} dark:text-${textMutedLight}`;
  }

  getRequiredClasses(): string {
    const requiredClass = this.theme.getPrimitiveClass('slider.required', '');
    if (requiredClass) {
      return this.theme.resolveThemePlaceholders(requiredClass);
    }
    // Fallback - resolve placeholders manually
    const t = this.theme.themeResolved();
    const error = t.colors?.error ?? 'red-500';
    return `text-${error}`;
  }

  getLabelsClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `flex justify-between text-xs text-${textMutedLight} dark:text-${textMutedLight} mt-1`;
  }
}
