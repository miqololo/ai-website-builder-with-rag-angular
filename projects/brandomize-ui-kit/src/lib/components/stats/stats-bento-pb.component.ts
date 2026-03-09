import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { StatCountupDirective } from './stat-countup.directive';

@Component({
  selector: 'bkit-stats-bento-pb',
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
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:mt-20 lg:max-w-none lg:grid-cols-3 lg:grid-rows-2">
        @for (stat of getStats(); track $index) {
          <div [class]="getStatCardClasses(stat)">
            <span [class]="getValueClasses(stat)" [statCountup]="stat.value" [statSuffix]="stat.suffix ?? ''">
              {{ stat.value }}
            </span>
            <span [class]="getLabelClasses(stat)">
              {{ stat.label }}
            </span>
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class StatsBentoPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'muted') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: [...this.getSectionBgClasses(), ...(this.config?.classes ?? [])] as string[]
    };
  }

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'By the numbers';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Trusted by teams worldwide.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getSectionBgClasses(): string[] {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const surfaceBase = surfaceDark.split('-')[0];
    return [`!bg-${surfaceMuted}`, `dark:!bg-${surfaceBase}-950`];
  }

  getStatCardClasses(stat: { span?: number }): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    const base = `group flex flex-col justify-center rounded-2xl p-8 transition-all duration-500`;
    if (stat.span === 2) {
      return `${base} lg:col-span-2 lg:row-span-2 bg-${primary} text-white hover:scale-[1.02]`;
    }
    return `${base} bg-white shadow-sm ring-1 ring-${border} dark:bg-${surfaceMutedDark} dark:ring-${borderMutedDark} hover:-translate-y-1 hover:shadow-lg`;
  }

  getValueClasses(stat: { span?: number }): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    const base = `text-4xl font-bold tabular-nums tracking-tight lg:text-5xl`;
    if (stat.span === 2) return `${base} text-white`;
    return `${base} text-${primary} dark:text-${primaryBase}-400`;
  }

  getLabelClasses(stat: { span?: number }): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    const textMutedBase = textMuted.split('-')[0];
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    const base = `mt-2 text-sm font-medium`;
    if (stat.span === 2) return `${base} text-${primaryBase}-100`;
    return `${base} text-${textMutedBase}-600 dark:text-${textMutedBase}-400`;
  }

  getStats(): Array<{ value: string; label: string; suffix?: string; span?: number }> {
    return (this.getData()['stats'] as Array<{ value: string; label: string; suffix?: string; span?: number }>) || [
      { value: '10K+', label: 'Active users', suffix: '+', span: 1 },
      { value: '500+', label: 'Companies', suffix: '+', span: 1 },
      { value: '99.9%', label: 'Uptime', suffix: '%', span: 2 },
      { value: '50+', label: 'Countries', suffix: '+', span: 1 }
    ];
  }
}
