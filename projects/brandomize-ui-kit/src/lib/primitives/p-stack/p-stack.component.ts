import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PStackConfig {
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  class?: string[];
}

@Component({
  selector: 'bkit-stack',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getStackClasses()">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class PStackComponent {
  @Input() config?: PStackConfig;
  @Input() gap?: PStackConfig['gap'];
  @Input() alignItems?: PStackConfig['alignItems'];
  @Input() justifyContent?: PStackConfig['justifyContent'];

  constructor(public theme: ThemeService) {}

  getStackClasses(): string {
    const gap = this.config?.gap ?? this.gap ?? 'md';
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
      stretch: 'items-stretch'
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
      'flex flex-col',
      gapMap[gap] ?? 'gap-4',
      align ? alignMap[align] ?? '' : '',
      justify ? justifyMap[justify] ?? '' : '',
      padMap[pad]
    ].filter(Boolean);

    return classes.join(' ');
  }
}
