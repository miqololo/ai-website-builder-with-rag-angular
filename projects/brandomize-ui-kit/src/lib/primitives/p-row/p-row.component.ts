import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PRowConfig {
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  class?: string[];
}

@Component({
  selector: 'bkit-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getRowClasses()">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class PRowComponent {
  @Input() config?: PRowConfig;
  @Input() gap?: PRowConfig['gap'];
  @Input() wrap = true;
  @Input() alignItems?: PRowConfig['alignItems'];
  @Input() justifyContent?: PRowConfig['justifyContent'];

  constructor(public theme: ThemeService) {}

  getRowClasses(): string {
    const gap = this.config?.gap ?? this.gap ?? 'md';
    const wrap = this.config?.wrap ?? this.wrap;
    const align = this.config?.alignItems ?? this.alignItems;
    const justify = this.config?.justifyContent ?? this.justifyContent;
    const pad = this.config?.padding ?? 'none';

    const gapMap: Record<string, string> = {
      none: '',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    };

    const alignMap: Record<string, string> = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline'
    };

    const justifyMap: Record<string, string> = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly'
    };

    const padMap: Record<string, string> = {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    };

    // Parent component classes come first (can override theme classes)
    const classes = [
      ...(this.config?.class ?? []),
      'flex flex-row',
      wrap ? 'flex-wrap' : 'flex-nowrap',
      gapMap[gap] ?? 'gap-4',
      align ? alignMap[align] ?? '' : '',
      justify ? justifyMap[justify] ?? '' : '',
      padMap[pad]
    ].filter(Boolean);

    return classes.join(' ');
  }
}
