import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PIconComponent } from '@brandomize/primitives/p-icon/p-icon.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { StatCountupDirective } from './stat-countup.directive';

@Component({
  selector: 'bkit-stats-with-icons-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PIconComponent,
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
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-24 lg:max-w-none lg:grid-cols-4">
        @for (stat of getStats(); track $index) {
          <div [class]="getCardClasses()" [ngClass]="getStatCardHoverClasses()">
            <div class="flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" [ngClass]="getIconBackgroundClasses()">
              <bkit-icon [config]="{ name: getStatIcon(stat), size: 28, color: 'primary' }"></bkit-icon>
            </div>
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
export class StatsWithIconsPbComponent {
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

  getStats(): Array<{ value: string; label: string; suffix?: string; icon?: string }> {
    return (this.getData()['stats'] as Array<{ value: string; label: string; suffix?: string; icon?: string }>) || [
      { value: '10K+', label: 'Users', suffix: '+', icon: 'users' },
      { value: '500+', label: 'Companies', suffix: '+', icon: 'building-2' },
      { value: '99.9%', label: 'Uptime', suffix: '%', icon: 'activity' },
      { value: '50+', label: 'Countries', suffix: '+', icon: 'globe' }
    ];
  }

  getStatIcon(stat: { icon?: string }): string {
    return stat.icon ?? 'user';
  }

  getCardClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const border = colors.border ?? 'gray-200';
    const borderMutedDark = colors.borderMutedDark ?? 'gray-700';
    const surface = colors.surface ?? 'white';
    const surfaceMutedDark = colors.surfaceMutedDark ?? 'gray-800';
    return `group flex flex-col items-center rounded-2xl border border-${border} bg-${surface} px-8 py-12 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-xl dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark}`;
  }

  getValueClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `mt-3 text-4xl font-bold tabular-nums tracking-tight text-${text}`;
  }

  getLabelClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-400';
    return `mt-2 text-sm font-medium text-${textMuted} dark:text-${textMutedLight}`;
  }

  getIconBackgroundClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryMuted = t.colors?.primaryMuted ?? 'indigo-50';
    const primaryBase = primary.split('-')[0];
    return `bg-${primaryMuted} text-${primary} dark:bg-${primaryBase}-500/20 dark:text-${primaryBase}-400`;
  }

  getStatCardHoverClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    const borderHover = t.colors?.borderHover ?? `${primaryBase}-500`;
    return `hover:border-${primaryBase}-300 dark:hover:border-${borderHover}/50`;
  }
}
