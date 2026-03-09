import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-faq-split-qa-pb',
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
      <div class="mx-auto mt-16 max-w-4xl">
        <dl [class]="getDlClasses()">
          @for (item of getItems(); track $index) {
            <div class="flex flex-col gap-4 py-10 lg:flex-row lg:items-start lg:gap-12">
              <dd [class]="getAnswerClasses()">
                {{ item.answer }}
              </dd>
              <dt [class]="getQuestionClasses()">
                {{ item.question }}
              </dt>
            </div>
          }
        </dl>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class FaqSplitQaPbComponent {
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
    return (this.getData()['title'] as string) || 'Frequently asked questions';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Everything you need to know.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getDlClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `divide-y divide-${border} dark:divide-${borderMutedDark}`;
  }

  getAnswerClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `min-w-0 flex-1 text-base leading-7 text-${textMuted} dark:text-gray-300 lg:order-first`;
  }

  getQuestionClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-base font-semibold leading-7 text-${text} dark:text-white lg:order-last lg:w-80 lg:flex-shrink-0`;
  }

  getItems(): Array<{ question: string; answer: string }> {
    return (this.getData()['items'] as Array<{ question: string; answer: string }>) || [
      { question: 'How do I get started?', answer: 'Simply sign up for an account, verify your email, and you can start using all features right away. No credit card required for the free tier.' },
      { question: 'Can I change my plan later?', answer: 'Yes, you can upgrade or downgrade at any time. Changes take effect immediately, and we\'ll prorate any differences.' },
      { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans. Invoices are available for enterprise customers.' },
      { question: 'Is there a free trial?', answer: 'Yes, we offer a 14-day free trial on all paid plans. No credit card required to start.' }
    ];
  }
}
