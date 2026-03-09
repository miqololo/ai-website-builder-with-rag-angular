import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { StatCountupDirective } from './stat-countup.directive';

@Component({
  selector: 'bkit-stats-simple-grid-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    StatCountupDirective
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="mx-auto max-w-2xl text-center">
        <bkit-stack [config]="getHeaderStackConfig()">
          <bkit-text
            [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', align: 'center', color: getTitleColor() }"
          ></bkit-text>
          <bkit-text
            [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', align: 'center', color: getSubtitleColor() }"
          ></bkit-text>
        </bkit-stack>
      </div>
      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          @for (stat of getStats(); track $index) {
            <div [class]="getCardClasses()" [ngClass]="getStatCardHoverClasses()">
              <span class="text-4xl font-bold tabular-nums tracking-tight" [ngClass]="getStatValueClasses()" [statCountup]="stat.value" [statSuffix]="stat.suffix ?? ''">
                {{ stat.value }}
              </span>
              <span [class]="getLabelClasses()">
                {{ stat.label }}
              </span>
            </div>
          }
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class StatsSimpleGridPbComponent {
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

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Trusted by developers worldwide';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Join thousands of satisfied customers.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getStats(): Array<{ value: string; label: string; suffix?: string }> {
    return (this.getData()['stats'] as Array<{ value: string; label: string; suffix?: string }>) || [
      { value: '10K+', label: 'Users', suffix: '+' },
      { value: '500+', label: 'Companies', suffix: '+' },
      { value: '99.9%', label: 'Uptime', suffix: '%' },
      { value: '50+', label: 'Countries', suffix: '+' }
    ];
  }

  getCardClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `flex flex-col rounded-2xl border border-${border} bg-${surfaceMuted} p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-lg dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark}`;
  }

  getLabelClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 block text-sm font-medium text-${textMuted} dark:text-gray-400`;
  }

  getStatValueClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-${primary} dark:text-${primaryBase}-400`;
  }

  getStatCardHoverClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `hover:border-${primaryBase}-200 dark:hover:border-${primaryBase}-500/30`;
  }
}
