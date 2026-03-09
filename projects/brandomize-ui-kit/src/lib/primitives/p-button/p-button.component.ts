import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PButtonConfig {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  ariaLabel?: string;
  class?: string[];
}

@Component({
  selector: 'bkit-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (config?.href || href) {
      <a [href]="config?.href || href || '#'" [class]="getButtonClasses()" [attr.aria-label]="config?.ariaLabel ?? ariaLabel">
        <ng-content></ng-content>
        @if (getButtonLabel(); as label) {
          {{ label }}
        }
      </a>
    } @else {
      <button type="button" [class]="getButtonClasses()" [attr.aria-label]="config?.ariaLabel ?? ariaLabel">
        <ng-content></ng-content>
        @if (getButtonLabel(); as label) {
          {{ label }}
        }
      </button>
    }
  `,
  styles: []
})
export class PButtonComponent {
  @Input() config?: PButtonConfig;
  @Input() variant?: PButtonConfig['variant'];
  @Input() href?: string;
  @Input() text?: string;
  @Input() ariaLabel?: string;

  constructor(public theme: ThemeService) {}

  getButtonLabel(): string {
    return this.config?.text ?? this.text ?? '';
  }

  getButtonClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const primary = colors.primary ?? 'indigo-600';
    const primaryHover = colors.primaryHover ?? 'indigo-500';
    const primaryMuted = colors.primaryMuted ?? 'indigo-50';
    const borderMuted = colors.borderMuted ?? 'gray-300';
    const borderMutedDark = colors.borderMutedDark ?? 'gray-600';
    const text = colors.text ?? 'gray-900';
    const textMuted = colors.textMuted ?? 'gray-700';
    const surfaceMuted = colors.surfaceMuted ?? 'gray-100';
    const surfaceMutedDark = colors.surfaceMutedDark ?? 'gray-800';

    const variant = this.config?.variant ?? this.variant ?? 'primary';
    const size = this.config?.size ?? 'md';

    // Get size classes from theme
    const sizeClass = this.theme.getPrimitiveClass(`button.sizes.${size}`, 
      size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 
      size === 'lg' ? 'px-4 py-3 text-base' : 
      'px-3.5 py-2.5 text-sm'
    );

    // Get base and variant classes from theme, then resolve placeholders
    const baseClass = this.theme.getPrimitiveClass('button.base', 'inline-flex items-center justify-center rounded-md font-semibold transition-all duration-300');
    
    let variantClass = this.theme.getPrimitiveClass(`button.variants.${variant}`, '');
    if (!variantClass) {
      // Fallback to building classes dynamically if not in theme
      const variantMap: Record<string, string> = {
        primary: `text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md bg-${primary} hover:bg-${primaryHover} dark:bg-${primaryHover} dark:hover:bg-${primary} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${primary}`,
        secondary: `border border-${primary} text-${primary} hover:bg-${primaryMuted} dark:text-${primary} dark:hover:bg-${primary}/10`,
        outline: `border border-${borderMuted} bg-transparent text-${textMuted} hover:bg-${surfaceMuted} dark:border-${borderMutedDark} dark:text-gray-300 dark:hover:bg-${surfaceMutedDark}`,
        ghost: `text-${text} hover:bg-${surfaceMuted} hover:text-${primary} dark:text-white dark:hover:bg-${surfaceMutedDark} dark:hover:text-${primary}`
      };
      variantClass = variantMap[variant] ?? variantMap['primary'];
    } else {
      // Resolve placeholders in variant class using theme service
      variantClass = this.theme.resolveThemePlaceholders(variantClass);
    }

    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} ${baseClass} ${sizeClass} ${variantClass}`.trim();
  }
}
