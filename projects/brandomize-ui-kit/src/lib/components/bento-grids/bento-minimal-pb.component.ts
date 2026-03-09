import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-bento-minimal-pb',
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
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-5 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:gap-6">
        @for (card of getCards(); track $index) {
          <div
            [class]="getCardClasses()"
            [class.lg:col-span-2]="card.span === 2"
            [class.lg:row-span-2]="card.rowSpan === 2"
          >
            <h3 [class]="getCardTitleClasses()">{{ card.title }}</h3>
            <p [class]="getCardDescriptionClasses()">{{ card.description }}</p>
            <div [class]="getIconWrapperClasses()">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class BentoMinimalPbComponent {
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
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    const surface = t.colors?.surface ?? 'white';
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `group relative overflow-hidden rounded-2xl border border-${border}/80 bg-${surface} px-6 py-8 transition-all duration-300 hover:border-${primaryBase}-300 hover:bg-${surfaceMuted}/50 hover:shadow-lg dark:border-${borderMutedDark}/80 dark:bg-${surfaceMutedDark}/50 dark:hover:border-${primaryBase}-500/30 dark:hover:bg-${surfaceMutedDark}`;
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

  getIconWrapperClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-100';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-700';
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-400';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-4 flex h-8 w-8 items-center justify-center rounded-lg bg-${surfaceMuted} text-${textMutedLight} transition-colors duration-300 group-hover:bg-${primaryBase}-100 group-hover:text-${primary} dark:bg-${surfaceMutedDark} dark:group-hover:bg-${primaryBase}-500/20 dark:group-hover:text-${primaryBase}-400`;
  }

  getCards(): Array<{ title: string; description: string; span?: number; rowSpan?: number }> {
    return (this.getData()['cards'] as Array<{ title: string; description: string; span?: number; rowSpan?: number }>) || [
      { title: 'Fast', description: 'Lightning-fast performance.' },
      { title: 'Secure', description: 'Enterprise-grade security.', span: 2 },
      { title: 'Scalable', description: 'Grows with your business.' },
      { title: 'Reliable', description: '99.9% uptime guarantee.', span: 2, rowSpan: 2 },
      { title: 'Easy', description: 'Simple to use and integrate.' },
      { title: 'Support', description: '24/7 expert support.' }
    ];
  }
}
