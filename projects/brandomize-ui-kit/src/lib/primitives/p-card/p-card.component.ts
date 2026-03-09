import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PCardConfig {
  variant?: 'default' | 'elevated' | 'bordered' | 'ghost';
  hover?: boolean;
  padding?: string;
  radius?: string;
  class?: string[];
}

@Component({
  selector: 'bkit-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [class]="getCardClasses()"
      [attr.data-p-card]="variant"
    >
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class PCardComponent {
  @Input() config?: PCardConfig;
  @Input() variant?: PCardConfig['variant'];
  @Input() hover = true;

  constructor(public theme: ThemeService) {}

  getCardClasses(): string {
    const t = this.theme.themeResolved();
    const card = t.card ?? {};
    const colors = t.colors ?? {};
    const variant = this.config?.variant ?? this.variant ?? 'default';
    const useHover = this.config?.hover ?? this.hover;

    const primary = colors.primary ?? 'indigo-600';
    const border = colors.border ?? 'gray-200';
    const borderHover = colors.borderHover ?? 'indigo-500';
    const surfaceMuted = colors.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = colors.surfaceMutedDark ?? 'gray-700';
    const surface = colors.surface ?? 'white';

    // Get base class from theme
    const base = this.theme.getPrimitiveClass('card.base', 'flex flex-col transition-all duration-300');
    const radius = card.radius ? (card.radius.startsWith('rounded') ? card.radius : `rounded-[${card.radius}]`) : 'rounded-xl';
    const padding = card.padding ?? 'p-8';

    // Get variant class from theme
    let variantClass = this.theme.getPrimitiveClass(`card.variants.${variant}`, '');
    if (!variantClass) {
      // Fallback - use semi-transparent white background with backdrop blur for glass effect
      const variantMap: Record<string, string> = {
        default: `bg-white/95 backdrop-blur-sm shadow-lg ring-1 ring-gray-900/5 dark:bg-${surfaceMutedDark}/95 dark:backdrop-blur-sm dark:ring-white/10 ${useHover ? `hover:shadow-xl hover:ring-${primary}/50 dark:hover:ring-${primary}/50` : ''}`,
        elevated: `bg-white/95 backdrop-blur-sm shadow-xl dark:bg-${surfaceMutedDark}/95 dark:backdrop-blur-sm ${useHover ? 'hover:shadow-2xl' : ''}`,
        bordered: `bg-white/95 backdrop-blur-sm border border-${border} dark:border-${colors.borderMutedDark ?? 'gray-700'} dark:bg-${surfaceMutedDark}/95 dark:backdrop-blur-sm shadow-md ${useHover ? `hover:border-${borderHover}` : ''}`,
        ghost: `bg-white/80 backdrop-blur-sm dark:bg-${surfaceMutedDark}/80 dark:backdrop-blur-sm shadow-sm ${useHover ? `hover:bg-white/95 dark:hover:bg-${surfaceMutedDark}/95` : ''}`
      };
      variantClass = variantMap[variant] ?? variantMap['default'];
    } else {
      // Resolve placeholders using theme service
      variantClass = this.theme.resolveThemePlaceholders(variantClass);
      
      // Ensure white background for cards (override {surface} placeholder)
      variantClass = variantClass.replace(/bg-\{surface\}/g, 'bg-white/95 backdrop-blur-sm');
      
      // Remove hover effects if hover is disabled
      if (!useHover) {
        // Remove hover: classes
        variantClass = variantClass.replace(/\s*hover:[^\s]+/g, '');
      }
    }

    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} ${base} ${radius} ${padding} ${variantClass}`.trim();
  }
}
