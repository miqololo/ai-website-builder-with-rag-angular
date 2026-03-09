import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PFormConfig {
  method?: 'get' | 'post';
  action?: string;
  layout?: 'vertical' | 'horizontal';
  gap?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  class?: string[];
}

@Component({
  selector: 'bkit-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <form
      [method]="config?.method ?? method ?? 'post'"
      [action]="config?.action ?? action ?? ''"
      [class]="getFormClasses()"
      (ngSubmit)="handleSubmit($event)"
    >
      <ng-content></ng-content>
    </form>
  `,
  styles: []
})
export class PFormComponent {
  @Input() config?: PFormConfig;
  @Input() method?: PFormConfig['method'];
  @Input() action?: string;
  @Output() submit = new EventEmitter<Event>();

  constructor(public theme: ThemeService) {}

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.submit.emit(event);
  }

  getFormClasses(): string {
    const layout = this.config?.layout ?? 'vertical';
    const gap = this.config?.gap ?? 'md';
    const pad = this.config?.padding ?? 'none';

    const gapMap: Record<string, string> = {
      none: '',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6'
    };

    const padMap: Record<string, string> = {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    };

    const layoutClasses = layout === 'vertical' ? 'flex flex-col' : 'flex flex-row flex-wrap';

    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} ${layoutClasses} ${gapMap[gap] ?? 'gap-4'} ${padMap[pad]}`.trim();
  }
}
