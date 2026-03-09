import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-faq-with-gradient-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="absolute inset-0" aria-hidden="true"></div>
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
      <div class="relative mx-auto mt-16 max-w-3xl">
        <div class="space-y-4">
          @for (item of getItems(); track $index) {
            <div
              class="overflow-hidden rounded-xl border border-white/20  backdrop-blur-sm transition-all duration-300"
              [class.ring-2]="openIndex() === $index"
              [class.ring-white]="openIndex() === $index"
              [class.bg-white/20]="openIndex() === $index"
            >
              <button
                type="button"
                class="flex w-full items-center justify-between px-6 py-4 text-left text-white transition-colors hover:bg-white/10"
                [attr.aria-expanded]="openIndex() === $index"
                (click)="toggle($index)"
              >
                <span class="text-base font-semibold">{{ item.question }}</span>
                <span
                  class="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-transform duration-300"
                  [class.rotate-180]="openIndex() === $index"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div
                class="grid transition-all duration-300 ease-out"
                [style.grid-template-rows]="openIndex() === $index ? '1fr' : '0fr'"
              >
                <div class="overflow-hidden">
                  <div class="px-6 pb-4 pt-0">
                    <p [class]="getAnswerClasses()">{{ item.answer }}</p>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class FaqWithGradientPbComponent {
  @Input() config?: ComponentConfig;
  openIndex = signal<number | null>(0);

  constructor(public theme: ThemeService) {}

  toggle(index: number): void {
    this.openIndex.set(this.openIndex() === index ? null : index);
  }

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
    return (this.getData()['title'] as string) || 'Frequently asked questions';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Everything you need to know.';
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

  getAnswerClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.textMuted ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-${primaryBase}-100`;
  }

  getItems(): Array<{ question: string; answer: string }> {
    return (this.getData()['items'] as Array<{ question: string; answer: string }>) || [
      { question: 'How do I get started?', answer: 'Sign up for an account and verify your email. You can start using all features right away.' },
      { question: 'Can I change my plan later?', answer: 'Yes, upgrade or downgrade at any time. Changes take effect immediately.' },
      { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and bank transfers.' },
      { question: 'Is there a free trial?', answer: 'Yes, we offer a 14-day free trial on all paid plans.' }
    ];
  }
}
