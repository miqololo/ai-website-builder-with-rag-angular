import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-bento-colorful-pb',
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
            [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', align: 'center', color: 'white' }"
          ></bkit-text>
          <bkit-text
            [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', align: 'center', color: getSubtitleColor() }"
          ></bkit-text>
        </bkit-stack>
      </div>
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-5">
        @for (card of getCards(); track $index) {
          <div
            class="group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl"
            [class]="getCardGradientClasses(card.color)"
            [class.lg:col-span-2]="card.span === 2"
            [class.lg:row-span-2]="card.rowSpan === 2"
          >
            <div class="relative">
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl  backdrop-blur-sm">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white">{{ card.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-white/90">{{ card.description }}</p>
            </div>
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class BentoColorfulPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    const t = this.theme.themeResolved();
    const surfaceDark = t.colors?.surfaceDark ?? 'slate-900';
    return {
      background: 'default' as const,
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      maxWidth: 'full' as const,
      animateOnScroll: true,
      class: [`!bg-${surfaceDark} dark:!bg-slate-950`, ...(this.config?.classes ?? [])] as string[]
    };
  }

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getCardGradientClasses(_color?: string): string {
    return this.theme.getGradientClass('hero');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    const dataColor = this.getData()['subtitleColor'] as string | undefined;
    // If subtitleColor is explicitly provided, use it (but ensure it's a valid theme color)
    if (dataColor) {
      return dataColor;
    }
    // Otherwise, use theme colors in order of preference
    // Prefer textMutedLight, then textMuted, then text, with a safe fallback
    return t.colors?.textMutedLight ?? t.colors?.textMuted ?? t.colors?.text ?? 'gray-500';
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Everything you need';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'All the tools you need to build amazing products.';
  }

  getCards(): Array<{ title: string; description: string; color?: string; span?: number; rowSpan?: number }> {
    return (this.getData()['cards'] as Array<{ title: string; description: string; color?: string; span?: number; rowSpan?: number }>) || [
      { title: 'Analytics', description: 'Get insights into your users.', color: 'indigo' },
      { title: 'Integrations', description: 'Connect with your favorite tools.', color: 'purple', span: 2 },
      { title: 'Security', description: 'Enterprise-grade security.', color: 'pink' },
      { title: 'Performance', description: 'Lightning-fast performance.', color: 'blue', span: 2, rowSpan: 2 }
    ];
  }
}
