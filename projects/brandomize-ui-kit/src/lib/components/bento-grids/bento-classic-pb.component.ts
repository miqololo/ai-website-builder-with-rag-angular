import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-bento-classic-pb',
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
          <span [class]="getBadgeClasses()">
            {{ getBadge() }}
          </span>
          <bkit-text
            [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', align: 'center', color: getTitleColor() }"
          ></bkit-text>
          <bkit-text
            [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', align: 'center', color: getSubtitleColor() }"
          ></bkit-text>
        </bkit-stack>
      </div>
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:grid-rows-2">
        @for (card of getCards(); track $index) {
          <div
            [class]="getCardClasses()"
            [class.lg:col-span-2]="card.span === 2"
            [class.lg:row-span-2]="card.rowSpan === 2"
          >
            <div class="relative">
              <div [class]="getIconWrapperClasses()">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 [class]="getCardTitleClasses()">{{ card.title }}</h3>
              <p [class]="getCardDescriptionClasses()">{{ card.description }}</p>
            </div>
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class BentoClassicPbComponent {
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
      maxWidth: 'full' as const,
      animateOnScroll: true,
      class: ['relative overflow-hidden', ...(this.config?.classes ?? [])] as string[]
    };
  }

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getBadge(): string {
    return (this.getData()['badge'] as string) || 'Features';
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

  getBadgeClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `inline-flex items-center rounded-full bg-${primaryBase}-500/10 px-4 py-1.5 text-sm font-medium text-${primary} ring-1 ring-inset ring-${primaryBase}-500/20 dark:text-${primaryBase}-400 dark:ring-${primaryBase}-400/30`;
  }

  getCardClasses(): string {
    const t = this.theme.themeResolved();
    const surface = t.colors?.surface ?? 'white';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `group relative overflow-hidden rounded-2xl bg-${surface}/80 p-8 shadow-sm backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-xl dark:bg-${surfaceMutedDark}/80`;
  }

  getIconWrapperClasses(): string {
    const heroGradient = this.theme.getGradientClass('hero');
    return `mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${heroGradient} text-white shadow-lg`;
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

  getCards(): Array<{ title: string; description: string; span?: number; rowSpan?: number }> {
    return (this.getData()['cards'] as Array<{ title: string; description: string; span?: number; rowSpan?: number }>) || [
      { title: 'Fast', description: 'Lightning-fast performance.' },
      { title: 'Secure', description: 'Enterprise-grade security.', span: 2 },
      { title: 'Scalable', description: 'Grows with your business.' },
      { title: 'Reliable', description: '99.9% uptime guarantee.', span: 2, rowSpan: 2 },
      { title: 'Easy', description: 'Simple to use and integrate.' }
    ];
  }
}
