import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-faq-with-icons-pb',
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
      <div class="mx-auto mt-16 max-w-3xl">
        <div class="space-y-4">
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
                <span [class]="getIconBoxClasses()">
                  @switch (item.icon || 'help') {
                    @case ('credit-card') {
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    }
                    @case ('shield') {
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    }
                    @case ('settings') {
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                    @default {
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                  }
                </span>
                <div class="min-w-0 flex-1">
                  <span [class]="getQuestionClasses()">{{ item.question }}</span>
                  <span [class]="getChevronClasses()"
                    [class.rotate-180]="openIndex() === $index"
                  >
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </button>
              <div
                class="grid transition-all duration-300 ease-out"
                [style.grid-template-rows]="openIndex() === $index ? '1fr' : '0fr'"
              >
                <div class="overflow-hidden">
                  <div [class]="getAnswerWrapClasses()">
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
export class FaqWithIconsPbComponent {
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

  getItemClasses(index: number): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const primary = t.colors?.primary ?? 'indigo-600';
    const base = `overflow-hidden rounded-xl border border-${border} bg-white transition-all duration-300 dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark}`;
    return this.openIndex() === index ? `${base} ring-2 ring-${primary}` : base;
  }

  getButtonClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `flex w-full items-start gap-4 px-6 py-4 text-left transition-colors hover:bg-${surfaceMuted} dark:hover:bg-${surfaceMutedDark}/50`;
  }

  getIconBoxClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryMuted = t.colors?.primaryMuted ?? 'indigo-100';
    const primaryBase = primary.split('-')[0];
    return `flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-${primaryMuted} text-${primary} dark:bg-${primaryBase}-500/20 dark:text-${primaryBase}-400`;
  }

  getQuestionClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-base font-semibold text-${text} dark:text-white`;
  }

  getChevronClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `ml-2 inline-flex flex-shrink-0 items-center justify-center text-${primary} transition-transform duration-300 dark:text-${primaryBase}-400`;
  }

  getAnswerWrapClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `border-t border-${border} pl-14 pr-6 pb-4 pt-0 dark:border-${borderMutedDark}`;
  }

  getAnswerClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `text-${textMuted} dark:text-gray-300`;
  }

  getItems(): Array<{ question: string; answer: string; icon?: 'help' | 'credit-card' | 'shield' | 'settings' }> {
    return (this.getData()['items'] as Array<{ question: string; answer: string; icon?: 'help' | 'credit-card' | 'shield' | 'settings' }>) || [
      { question: 'How do I get started?', answer: 'Sign up for an account and verify your email. You can start using all features right away.', icon: 'help' },
      { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.', icon: 'credit-card' },
      { question: 'Is my data secure?', answer: 'Yes. We use industry-standard encryption and are SOC 2 compliant.', icon: 'shield' },
      { question: 'Can I customize my workspace?', answer: 'Absolutely. You can customize themes, layouts, and integrations to match your workflow.', icon: 'settings' }
    ];
  }
}
