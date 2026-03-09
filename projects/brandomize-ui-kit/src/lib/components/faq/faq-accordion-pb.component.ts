import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PAccordionComponent } from '@brandomize/primitives/p-accordion/p-accordion.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-faq-accordion-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PAccordionComponent
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
      <div class="mx-auto mt-16 max-w-3xl">
        <bkit-accordion [config]="getAccordionConfig()"></bkit-accordion>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class FaqAccordionPbComponent {
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

  getAccordionConfig() {
    const items = (this.getData()['items'] as Array<{ question: string; answer: string }>) || this.getDefaultItems();
    return {
      items: items.map(i => ({ title: i.question, content: i.answer })),
      variant: 'bordered' as const,
      allowMultiple: false,
      class: [] as string[]
    };
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

  private getDefaultItems(): Array<{ question: string; answer: string }> {
    return [
      { question: 'How do I get started?', answer: 'Simply sign up for an account, verify your email, and you can start using all features right away.' },
      { question: 'Can I change my plan later?', answer: 'Yes, you can upgrade or downgrade at any time. Changes take effect immediately.' },
      { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and bank transfers.' },
      { question: 'Is there a free trial?', answer: 'Yes, we offer a 14-day free trial on all paid plans.' }
    ];
  }
}
