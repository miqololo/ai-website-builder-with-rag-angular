import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PAvatarConfig {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square' | 'rounded';
  class?: string[];
}

@Component({
  selector: 'bkit-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (getSrc()) {
      <img
        [src]="getSrc()"
        [alt]="getAlt()"
        [class]="getAvatarClasses()"
      />
    } @else {
      <span [class]="getInitialsClasses()">{{ getInitials() }}</span>
    }
  `,
  styles: []
})
export class PAvatarComponent {
  @Input() config?: PAvatarConfig;
  @Input() src?: string;
  @Input() alt?: string;
  @Input() initials?: string;
  @Input() size?: PAvatarConfig['size'];

  constructor(public theme: ThemeService) {}

  getSrc(): string {
    return this.config?.src ?? this.src ?? '';
  }

  getAlt(): string {
    return this.config?.alt ?? this.alt ?? '';
  }

  getInitials(): string {
    const initials = this.config?.initials ?? this.initials ?? '?';
    return initials.slice(0, 2).toUpperCase();
  }

  getAvatarClasses(): string {
    return `${this.getBaseClasses()} object-cover`;
  }

  getInitialsClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    return `${this.getBaseClasses()} flex items-center justify-center bg-${primary}/10 text-${primary} font-semibold`;
  }

  private getBaseClasses(): string {
    const size = this.config?.size ?? this.size ?? 'md';
    const shape = this.config?.shape ?? 'circle';

    const sizeMap: Record<string, string> = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl'
    };

    const shapeMap: Record<string, string> = {
      circle: 'rounded-full',
      square: 'rounded-none',
      rounded: 'rounded-lg'
    };

    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} inline-block overflow-hidden ${sizeMap[size]} ${shapeMap[shape]}`.trim();
  }
}
