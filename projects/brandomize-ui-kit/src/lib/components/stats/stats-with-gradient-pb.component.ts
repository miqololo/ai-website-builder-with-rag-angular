import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { StatCountupDirective } from './stat-countup.directive';

@Component({
  selector: 'bkit-stats-with-gradient-pb',
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
      <div class="absolute inset-0"></div>
      <div class="relative mx-auto max-w-2xl text-center">
        <bkit-stack [config]="getHeaderStackConfig()">
          <bkit-text
            [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', align: 'center', color: 'white' }"
          ></bkit-text>
          <bkit-text
            [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', align: 'center', color: getSubtitleColor() }"
          ></bkit-text>
        </bkit-stack>
      </div>
      <div class="relative mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-24 lg:max-w-none lg:grid-cols-4">
        @for (stat of getStats(); track $index) {
          <div class="flex flex-col items-center rounded-2xl bg-white/10 px-8 py-12 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:bg-white/20">
            <span class="text-5xl font-bold tabular-nums tracking-tight text-white" [statCountup]="stat.value" [statSuffix]="stat.suffix ?? ''">
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
export class StatsWithGradientPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: 'default' as const,
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: [
        'relative overflow-hidden',
        ...this.getSectionGradientClasses(),
        ...(this.config?.classes ?? [])
      ] as string[]
    };
  }

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Built for scale';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Numbers that speak for themselves.';
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.secondary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `${primaryBase}-100`;
  }

  getSectionGradientClasses(): string[] {
    const heroGradient = this.theme.getGradientClass('hero');
    return [heroGradient.split(' ').map(c => '!' + c).join(' ')];
  }

  getLabelClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.secondary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-3 text-sm font-medium text-${primaryBase}-100`;
  }

  getStats(): Array<{ value: string; label: string; suffix?: string }> {
    return (this.getData()['stats'] as Array<{ value: string; label: string; suffix?: string }>) || [
      { value: '10K+', label: 'Active users', suffix: '+' },
      { value: '500+', label: 'Companies', suffix: '+' },
      { value: '50+', label: 'Countries', suffix: '+' },
      { value: '99.9%', label: 'Uptime', suffix: '%' }
    ];
  }
}
