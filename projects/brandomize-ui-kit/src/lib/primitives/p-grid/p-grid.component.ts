import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PGridConfig {
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  columnsMd?: 1 | 2 | 3 | 4;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  class?: string[];
}

@Component({
  selector: 'bkit-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getGridClasses()">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class PGridComponent {
  @Input() config?: PGridConfig;
  @Input() columns?: PGridConfig['columns'];
  @Input() gap?: PGridConfig['gap'];

  constructor(public theme: ThemeService) {}

  getGridClasses(): string {
    const cols = this.config?.columns ?? this.columns ?? 3;
    const colsMd = this.config?.columnsMd;
    const gap = this.config?.gap ?? this.gap ?? 'md';
    const pad = this.config?.padding ?? 'none';

    const colMap: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12'
    };

    const padMap: Record<string, string> = {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    };

    const gapMap: Record<string, string> = {
      none: '',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    };

    // Parent component classes come first (can override theme classes)
    const classes = [
      ...(this.config?.class ?? []),
      'grid',
      colMap[cols] ?? 'grid-cols-3',
      colsMd ? `md:grid-cols-${colsMd}` : '',
      gapMap[gap] ?? 'gap-4',
      padMap[pad]
    ].filter(Boolean);

    return classes.join(' ');
  }
}
