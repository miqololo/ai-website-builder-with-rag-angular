import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PContainerConfig {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'default' | string;
  class?: string[];
}

@Component({
  selector: 'bkit-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getContainerClasses()">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class PContainerComponent {
  @Input() config?: PContainerConfig;
  @Input() maxWidth?: PContainerConfig['maxWidth'];
  @Input() padding?: PContainerConfig['padding'];

  constructor(public theme: ThemeService) {}

  getContainerClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const max = this.config?.maxWidth ?? this.maxWidth ?? '7xl';
    const pad = this.config?.padding ?? this.padding ?? 'md';

    const maxMap: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '7xl': 'max-w-7xl',
      full: 'max-w-full',
      none: ''
    };

    const padMap: Record<string, string> = {
      none: '',
      sm: 'px-2 py-2',
      md: 'px-4 py-4',
      lg: 'px-6 py-6',
      xl: 'px-8 py-8'
    };

    const bg = this.config?.background ?? 'default';
    const bgClass = bg === 'transparent' ? 'bg-transparent' : bg === 'default' ? `bg-${colors.background ?? 'white'}` : `bg-${bg}`;

    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} mx-auto ${maxMap[max] ?? 'max-w-7xl'} ${padMap[pad] ?? 'px-4 py-4'} ${bgClass}`.trim();
  }
}
