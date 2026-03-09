import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PButtonComponent } from '@brandomize/primitives/p-button/p-button.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-faq-split-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PButtonComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="lg:grid lg:grid-cols-2 lg:gap-16">
        <div>
          <bkit-stack [config]="getHeaderStackConfig()">
            <bkit-text [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', color: getTitleColor() }"></bkit-text>
            <bkit-text [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', color: getSubtitleColor() }"></bkit-text>
          </bkit-stack>
          <div class="mt-12 space-y-6">
            @for (item of getItems(); track $index) {
              <div
                [class]="getItemClasses($index)"
              >
                <button
                  type="button"
                  [class]="getButtonClasses()"
                  [attr.aria-expanded]="openIndex() === $index"
                  (click)="toggle($index)"
                >
                  <span [class]="getQuestionClasses()">{{ item.question }}</span>
                  <span
                    [class]="getChevronClasses()"
                    [class.rotate-180]="openIndex() === $index"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                @if (openIndex() === $index) {
                  <div [class]="getAnswerWrapClasses()">
                    <p [class]="getAnswerClasses()">{{ item.answer }}</p>
                  </div>
                }
              </div>
            }
          </div>
        </div>
        <div class="mt-16 lg:mt-0">
          <div [class]="getCtaBoxClasses()">
            <h3 class="text-2xl font-bold tracking-tight">{{ getCtaTitle() }}</h3>
            <p [class]="getCtaDescClasses()">{{ getCtaDescription() }}</p>
            <div class="mt-6">
              <bkit-button
                [config]="{
                  href: getCtaButtonLink(),
                  variant: 'secondary',
                  size: 'md',
                  text: getCtaButtonText(),
                  ariaLabel: getCtaButtonText(),
                  class: getCtaButtonClasses()
                }"
              ></bkit-button>
            </div>
          </div>
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class FaqSplitPbComponent {
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
      background: (d['background'] ?? 'muted') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: this.config?.classes ?? []
    };
  }

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'start' as const, class: [] as string[] };
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

  getCtaTitle(): string {
    return (this.getData()['ctaTitle'] as string) || 'Still have questions?';
  }

  getCtaDescription(): string {
    return (this.getData()['ctaDescription'] as string) || 'Our team is here to help.';
  }

  getCtaButtonText(): string {
    return (this.getData()['ctaButtonText'] as string) || 'Contact support';
  }

  getCtaButtonLink(): string {
    return (this.getData()['ctaButtonLink'] as string) || '#';
  }

  getItemClasses(index: number): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const primary = t.colors?.primary ?? 'indigo-600';
    const base = `overflow-hidden rounded-lg border border-${border}  dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark}`;
    return this.openIndex() === index ? `${base} ring-2 ring-${primary}` : base;
  }

  getButtonClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-${surfaceMuted} dark:hover:bg-${surfaceMutedDark}/50`;
  }

  getQuestionClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-sm font-semibold text-${text} dark:text-white`;
  }

  getChevronClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `ml-2 flex h-6 w-6 flex-shrink-0 items-center justify-center text-${primary} transition-transform duration-300 dark:text-${primaryBase}-400`;
  }

  getAnswerWrapClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `border-t border-${border} px-5 pb-4 pt-0 dark:border-${borderMutedDark}`;
  }

  getAnswerClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `text-sm text-${textMuted} dark:text-gray-300`;
  }

  getCtaBoxClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `rounded-2xl bg-${primary} px-8 py-12 text-white shadow-xl dark:bg-${primaryBase}-700`;
  }

  getCtaDescClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-4 text-${primaryBase}-100`;
  }

  getCtaButtonClasses(): string[] {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryMuted = t.colors?.primaryMuted ?? 'indigo-50';
    return [`!bg-white !text-${primary} hover:!bg-${primaryMuted}`];
  }

  getItems(): Array<{ question: string; answer: string }> {
    return (this.getData()['items'] as Array<{ question: string; answer: string }>) || [
      { question: 'How do I get started?', answer: 'Sign up for an account and verify your email. You can start using all features right away.' },
      { question: 'Can I change my plan later?', answer: 'Yes, upgrade or downgrade at any time. Changes take effect immediately.' },
      { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and bank transfers.' }
    ];
  }
}
