import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { StatCountupDirective } from './stat-countup.directive';

@Component({
  selector: 'bkit-stats-minimal-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PTextComponent,
    StatCountupDirective
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div [class]="getContainerClasses()">
        @for (stat of getStats(); track $index) {
          <div [class]="getStatClasses()">
            <span [class]="getValueClasses()" [statCountup]="stat.value" [statSuffix]="stat.suffix ?? ''">
              {{ stat.value }}
            </span>
            <span [class]="getLabelClasses()">
              {{ stat.label }}
            </span>
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class StatsMinimalPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'white') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: this.config?.classes ?? []
    };
  }

  getContainerClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `flex flex-col divide-y divide-${border} dark:divide-${borderMutedDark} sm:flex-row sm:divide-x sm:divide-y-0`;
  }

  getStatClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `flex flex-1 flex-col items-center justify-center px-8 py-12 transition-all duration-300 hover:bg-${surfaceMuted} dark:hover:bg-${surfaceMutedDark}/50`;
  }

  getValueClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-3xl font-bold tabular-nums tracking-tight text-${text} dark:text-white sm:text-4xl`;
  }

  getLabelClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `mt-1 text-sm font-medium text-${textMutedLight} dark:text-gray-400`;
  }

  getStats(): Array<{ value: string; label: string; suffix?: string }> {
    return (this.getData()['stats'] as Array<{ value: string; label: string; suffix?: string }>) || [
      { value: '10K+', label: 'Users', suffix: '+' },
      { value: '500+', label: 'Companies', suffix: '+' },
      { value: '99.9%', label: 'Uptime', suffix: '%' },
      { value: '50+', label: 'Countries', suffix: '+' }
    ];
  }
}
