import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PDividerConfig {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  class?: string[];
}

@Component({
  selector: 'bkit-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (getLabel()) {
      <div [class]="getWrapperClasses()">
        <div [class]="getLineClasses()"></div>
        <span [class]="getLabelClasses()">{{ getLabel() }}</span>
        <div [class]="getLineClasses()"></div>
      </div>
    } @else {
      <hr [class]="getLineClasses()" />
    }
  `,
  styles: []
})
export class PDividerComponent {
  @Input() config?: PDividerConfig;
  @Input() orientation?: PDividerConfig['orientation'];
  @Input() label?: string;

  constructor(public theme: ThemeService) {}

  getLabel(): string {
    return this.config?.label ?? this.label ?? '';
  }

  getWrapperClasses(): string {
    const orientation = this.config?.orientation ?? this.orientation ?? 'horizontal';
    const base = orientation === 'vertical' ? 'flex flex-col items-center gap-2' : 'flex items-center gap-4';
    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} ${base}`.trim();
  }

  getLineClasses(): string {
    const orientation = this.config?.orientation ?? this.orientation ?? 'horizontal';
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const border = colors.border ?? 'gray-200';
    const borderMutedDark = colors.borderMutedDark ?? 'gray-700';
    const line = `border-${border} dark:border-${borderMutedDark}`;
    const dir = orientation === 'vertical' ? 'border-l flex-1 w-px min-h-[1px]' : 'border-t flex-1 min-w-[1px]';
    return `${line} ${dir}`;
  }

  getLabelClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `text-sm text-${textMutedLight} dark:text-gray-400 whitespace-nowrap`;
  }
}
