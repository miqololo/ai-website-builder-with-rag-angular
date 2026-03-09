import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-bento-asymmetric-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent
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
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:grid-rows-3 lg:gap-5">
        @for (card of getCards(); track $index) {
          <div
            [class]="getCardClasses()"
            [class.lg:col-span-1]="card.span === 1"
            [class.lg:col-span-2]="card.span === 2"
            [class.lg:col-span-3]="card.span === 3"
            [class.lg:row-span-2]="card.rowSpan === 2"
          >
            <div [class]="getIndexBadgeClasses()">
              {{ $index + 1 }}
            </div>
            <h3 [class]="getCardTitleClasses()">{{ card.title }}</h3>
            <p [class]="getCardDescriptionClasses()">{{ card.description }}</p>
            @if (card.stat) {
              <div class="mt-8 flex flex-col">
                <span [class]="getStatValueClasses()">{{ card.stat.value }}</span>
                <span [class]="getStatLabelClasses()">{{ card.stat.label }}</span>
              </div>
            }
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class BentoAsymmetricPbComponent {
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
      maxWidth: 'full' as const,
      animateOnScroll: true,
      class: this.config?.classes ?? []
    };
  }

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Everything you need';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'All the tools you need to build amazing products.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getCardClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surface = t.colors?.surface ?? 'white';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const borderMuted = t.colors?.borderMuted ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `group relative overflow-hidden rounded-2xl bg-${surfaceMuted} p-8 transition-all duration-500 ease-out hover:bg-${surface} hover:shadow-xl hover:ring-1 hover:ring-${borderMuted}/80 dark:bg-${surfaceMutedDark}/50 dark:hover:bg-${surfaceMutedDark} dark:hover:ring-${borderMutedDark}/80`;
  }

  getIndexBadgeClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-200';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-700';
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `absolute right-4 top-4 rounded-lg bg-${surfaceMuted}/50 px-2 py-1 text-xs font-medium text-${textMutedLight} transition-colors duration-300 group-hover:bg-${primaryBase}-100 group-hover:text-${primary} dark:bg-${surfaceMutedDark}/50 dark:text-slate-400 dark:group-hover:bg-${primaryBase}-500/20 dark:group-hover:text-${primaryBase}-400`;
  }

  getCardTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-lg font-semibold text-${text} dark:text-white`;
  }

  getCardDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-sm leading-6 text-${textMuted} dark:text-slate-400`;
  }

  getStatValueClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-4xl font-bold tracking-tight text-${primary} dark:text-${primaryBase}-400`;
  }

  getStatLabelClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `mt-1 text-xs font-medium uppercase tracking-wider text-${textMutedLight} dark:text-slate-400`;
  }

  getCards(): Array<{ title: string; description: string; span?: number; rowSpan?: number; stat?: { value: string; label: string } }> {
    return (this.getData()['cards'] as Array<{ title: string; description: string; span?: number; rowSpan?: number; stat?: { value: string; label: string } }>) || [
      { title: 'Analytics', description: 'Get insights into your users.', span: 1 },
      { title: 'Integrations', description: 'Connect with your favorite tools.', span: 2 },
      { title: 'Security', description: 'Enterprise-grade security.', span: 1 },
      { title: 'Performance', description: 'Lightning-fast performance.', span: 1, rowSpan: 2, stat: { value: '99.9%', label: 'Uptime' } },
      { title: 'Support', description: '24/7 expert support.', span: 2 }
    ];
  }
}
