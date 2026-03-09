import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PImageConfig {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  loading?: 'lazy' | 'eager';
  class?: string[];
}

@Component({
  selector: 'bkit-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img
      [src]="getSrc()"
      [alt]="getAlt()"
      [width]="getWidth()"
      [height]="getHeight()"
      [loading]="getLoading()"
      [class]="getImageClasses()"
    />
  `,
  styles: []
})
export class PImageComponent {
  @Input() config?: PImageConfig;
  @Input() src?: string;
  @Input() alt?: string;
  @Input() width?: number | string;
  @Input() height?: number | string;

  constructor(public theme: ThemeService) {}

  getSrc(): string {
    return this.config?.src ?? this.src ?? '';
  }

  getAlt(): string {
    return this.config?.alt ?? this.alt ?? '';
  }

  getWidth(): number | string | undefined {
    return this.config?.width ?? this.width;
  }

  getHeight(): number | string | undefined {
    return this.config?.height ?? this.height;
  }

  getLoading(): 'lazy' | 'eager' {
    return this.config?.loading ?? 'lazy';
  }

  getImageClasses(): string {
    const fit = this.config?.objectFit ?? 'cover';
    const rounded = this.config?.rounded ?? 'md';

    const fitMap: Record<string, string> = {
      contain: 'object-contain',
      cover: 'object-cover',
      fill: 'object-fill',
      none: 'object-none'
    };

    const roundedMap: Record<string, string> = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      full: 'rounded-full'
    };

    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} ${fitMap[fit] ?? 'object-cover'} ${roundedMap[rounded] ?? 'rounded-md'}`.trim();
  }
}
