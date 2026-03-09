import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PSpacerConfig {
  size?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  class?: string[];
}

@Component({
  selector: 'bkit-spacer',
  standalone: true,
  imports: [CommonModule],
  template: `<div [class]="getSpacerClasses()"></div>`,
  styles: []
})
export class PSpacerComponent {
  @Input() config?: PSpacerConfig;
  @Input() size?: PSpacerConfig['size'];

  constructor(public theme: ThemeService) {}

  getSpacerClasses(): string {
    const size = this.config?.size ?? this.size ?? 'md';
    const sizeMap: Record<string, string> = {
      none: 'h-0',
      xs: 'h-2',
      sm: 'h-4',
      md: 'h-8',
      lg: 'h-12',
      xl: 'h-16',
      '2xl': 'h-24'
    };
    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} ${sizeMap[size] ?? 'h-8'}`.trim();
  }
}
