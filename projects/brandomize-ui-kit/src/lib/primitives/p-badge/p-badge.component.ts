import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PBadgeConfig {
  label?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  class?: string[];
}

@Component({
  selector: 'bkit-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getBadgeClasses()">
      <ng-content></ng-content>
      @if (!hasContent()) {
        {{ getLabel() }}
      }
    </span>
  `,
  styles: []
})
export class PBadgeComponent {
  @Input() config?: PBadgeConfig;
  @Input() label?: string;
  @Input() variant?: PBadgeConfig['variant'];
  @Input() size?: PBadgeConfig['size'];

  constructor(public theme: ThemeService) {}

  hasContent(): boolean {
    return false; // ng-content not projected in config-driven mode
  }

  getLabel(): string {
    return this.config?.label ?? this.label ?? 'Badge';
  }

  getBadgeClasses(): string {
    const variant = this.config?.variant ?? this.variant ?? 'default';
    const size = this.config?.size ?? this.size ?? 'md';
    const rounded = this.config?.rounded ?? true;

    // Get base class from theme
    const base = this.theme.getPrimitiveClass('badge.base', 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium');
    
    // Get variant class from theme
    let variantClass = this.theme.getPrimitiveClass(`badge.variants.${variant}`, '');
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
      const infoMuted = colors.infoMuted ?? 'blue-100';
      const info = colors.info ?? 'blue-600';
      const variantMap: Record<string, string> = {
        default: `bg-${surfaceMuted} text-${text} dark:bg-${surfaceMutedDark} dark:text-${textMutedLight}`,
        primary: `bg-${primary} text-white`,
        success: `bg-${successMuted} text-${success} dark:bg-${success}/30 dark:text-${successMuted}`,
        warning: `bg-${warningMuted} text-${warning} dark:bg-${warning}/30 dark:text-${warningMuted}`,
        danger: `bg-${errorMuted} text-${error} dark:bg-${error}/30 dark:text-${errorMuted}`,
        info: `bg-${infoMuted} text-${info} dark:bg-${info}/30 dark:text-${infoMuted}`
      };
      variantClass = variantMap[variant] ?? variantMap['default'];
    }

    // Get size class from theme
    const sizeClass = this.theme.getPrimitiveClass(`badge.sizes.${size}`, '');
    const sizeFallback: Record<string, string> = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm'
    };

    const radius = rounded ? 'rounded-full' : 'rounded';

    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} ${base} ${radius} ${sizeClass || sizeFallback[size] || sizeFallback['md']} ${variantClass}`.trim();
  }
}
