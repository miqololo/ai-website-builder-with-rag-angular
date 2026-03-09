import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PChipConfig {
  label?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  closable?: boolean;
  class?: string[];
}

@Component({
  selector: 'bkit-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getChipClasses()">
      {{ getLabel() }}
      @if (isClosable()) {
        <button
          type="button"
          (click)="handleClose()"
          [class]="getCloseButtonClasses()"
        >
          <span class="text-xs">×</span>
        </button>
      }
    </span>
  `,
  styles: []
})
export class PChipComponent {
  @Input() config?: PChipConfig;
  @Input() label?: string;
  @Input() variant?: PChipConfig['variant'];
  @Input() size?: PChipConfig['size'];
  @Input() closable = false;
  @Output() close = new EventEmitter<void>();

  constructor(public theme: ThemeService) {}

  getLabel(): string {
    return this.config?.label ?? this.label ?? 'Chip';
  }

  isClosable(): boolean {
    return this.config?.closable ?? this.closable ?? false;
  }

  handleClose(): void {
    this.close.emit();
  }

  getCloseButtonClasses(): string {
    const closeButtonClass = this.theme.getPrimitiveClass('chip.closeButton', '');
    if (closeButtonClass) {
      return this.theme.resolveThemePlaceholders(closeButtonClass);
    }
    // Fallback - use theme colors
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const surfaceMuted = colors.surfaceMuted ?? 'gray-200';
    const surfaceMutedDark = colors.surfaceMutedDark ?? 'gray-600';
    return `ml-1 hover:bg-${surfaceMuted} dark:hover:bg-${surfaceMutedDark} rounded-full p-0.5`;
  }

  getChipClasses(): string {
    const variant = this.config?.variant ?? this.variant ?? 'default';
    const size = this.config?.size ?? this.size ?? 'md';

    // Get base class from theme
    const base = this.theme.getPrimitiveClass('chip.base', 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium');
    
    // Get variant class from theme
    let variantClass = this.theme.getPrimitiveClass(`chip.variants.${variant}`, '');
    if (variantClass) {
      variantClass = this.theme.resolveThemePlaceholders(variantClass);
    } else {
      // Fallback
      const t = this.theme.themeResolved();
      const colors = t.colors ?? {};
      const primary = colors.primary ?? 'indigo-600';
      const surfaceMuted = colors.surfaceMuted ?? 'gray-100';
      const surfaceMutedDark = colors.surfaceMutedDark ?? 'gray-800';
      const text = colors.text ?? 'gray-800';
      const textMutedLight = colors.textMutedLight ?? 'gray-200';
      const successMuted = colors.successMuted ?? 'green-100';
      const success = colors.success ?? 'green-600';
      const warningMuted = colors.warningMuted ?? 'yellow-100';
      const warning = colors.warning ?? 'yellow-600';
      const errorMuted = colors.errorMuted ?? 'red-100';
      const error = colors.error ?? 'red-600';
      const variantMap: Record<string, string> = {
        default: `bg-${surfaceMuted} text-${text} dark:bg-${surfaceMutedDark} dark:text-${textMutedLight}`,
        primary: `bg-${primary}/10 text-${primary} dark:bg-${primary}/20 dark:text-${primary}`,
        success: `bg-${successMuted} text-${success} dark:bg-${success}/30 dark:text-${successMuted}`,
        warning: `bg-${warningMuted} text-${warning} dark:bg-${warning}/30 dark:text-${warningMuted}`,
        danger: `bg-${errorMuted} text-${error} dark:bg-${error}/30 dark:text-${errorMuted}`
      };
      variantClass = variantMap[variant] ?? variantMap['default'];
    }

    // Get size class from theme
    const sizeClass = this.theme.getPrimitiveClass(`chip.sizes.${size}`, '');
    const sizeFallback: Record<string, string> = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm'
    };

    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} ${base} ${sizeClass || sizeFallback[size] || sizeFallback['md']} ${variantClass}`.trim();
  }
}
