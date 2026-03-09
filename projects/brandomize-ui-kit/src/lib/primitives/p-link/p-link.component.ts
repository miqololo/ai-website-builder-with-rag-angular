import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PLinkConfig {
  href?: string;
  target?: '_self' | '_blank';
  rel?: string;
  text?: string;
  variant?: 'default' | 'primary' | 'muted' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
  class?: string[];
}

@Component({
  selector: 'bkit-link',
  standalone: true,
  imports: [CommonModule],
  template: `
    <a
      [href]="getHref()"
      [target]="getTarget()"
      [attr.rel]="getRel()"
      [attr.aria-label]="getAriaLabel()"
      [class]="getLinkClasses()"
    >
      <ng-content></ng-content>
      @if (!hasContent()) {
        {{ getText() }}
      }
    </a>
  `,
  styles: []
})
export class PLinkComponent {
  @Input() config?: PLinkConfig;
  @Input() href?: string;
  @Input() target?: PLinkConfig['target'];
  @Input() variant?: PLinkConfig['variant'];

  constructor(public theme: ThemeService) {}

  getHref(): string {
    return this.config?.href ?? this.href ?? '#';
  }

  getTarget(): string {
    return this.config?.target ?? this.target ?? '_self';
  }

  hasContent(): boolean {
    return false;
  }

  getText(): string {
    return this.config?.text ?? '';
  }

  getRel(): string {
    const target = this.getTarget();
    return target === '_blank' ? 'noopener noreferrer' : (this.config?.rel ?? '');
  }

  getAriaLabel(): string | undefined {
    return this.config?.ariaLabel ?? undefined;
  }

  getLinkClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const primary = colors.primary ?? 'indigo-600';
    const textMuted = colors.textMuted ?? 'gray-600';
    const text = colors.text ?? 'gray-900';
    const variant = this.config?.variant ?? this.variant ?? 'default';
    const size = this.config?.size ?? 'md';

    const variantMap: Record<string, string> = {
      default: `text-${primary} hover:text-${primary}/80 transition-colors`,
      primary: `font-semibold text-${primary} hover:underline`,
      muted: `text-${textMuted} dark:text-gray-400 hover:text-${text} dark:hover:text-gray-200`,
      underline: `text-${primary} underline hover:no-underline`
    };

    const sizeMap: Record<string, string> = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };

    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} inline-flex items-center ${sizeMap[size]} ${variantMap[variant]}`.trim();
  }
}
