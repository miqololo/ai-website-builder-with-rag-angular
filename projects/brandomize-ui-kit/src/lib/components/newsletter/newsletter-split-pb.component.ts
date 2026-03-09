import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-newsletter-split-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-2 lg:items-center lg:gap-x-8">
        <div>
          <bkit-stack [config]="getContentStackConfig()">
            <bkit-text
              [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', color: getTitleColor() }"
            ></bkit-text>
            <bkit-text
              [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', color: getSubtitleColor() }"
            ></bkit-text>
          </bkit-stack>
          <ul class="mt-8 space-y-4">
            @for (benefit of getBenefits(); track $index) {
              <li class="flex gap-x-3">
                <svg [class]="getCheckIconClasses()" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
                <span [class]="getBenefitClasses()">{{ benefit }}</span>
              </li>
            }
          </ul>
        </div>
        <div class="mt-12 lg:mt-0">
          <form [class]="getFormClasses()" (ngSubmit)="onSubmit($event)">
            <h3 [class]="getFormTitleClasses()">{{ getFormTitle() }}</h3>
            <p [class]="getFormSubtitleClasses()">{{ getFormSubtitle() }}</p>
            <div class="mt-6 flex flex-col gap-4 sm:flex-row">
              <input
                type="email"
                [placeholder]="getEmailPlaceholder()"
                required
                autocomplete="email"
                [class]="getInputClasses()"
              />
              <button
                type="submit"
                [class]="getButtonClasses()"
              >
                {{ getButtonText() }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class NewsletterSplitPbComponent {
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
      class: this.config?.classes ?? []
    };
  }

  getContentStackConfig() {
    return { gap: 'md' as const, alignItems: 'start' as const, class: [] as string[] };
  }

  onSubmit(e: Event): void {
    e.preventDefault();
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Subscribe to our newsletter';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Get the latest news, insights, and updates delivered to your inbox.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getBenefits(): string[] {
    return (this.getData()['benefits'] as string[]) || [
      'Weekly product updates',
      'Exclusive tips and guides',
      'No spam, unsubscribe anytime'
    ];
  }

  getFormTitle(): string {
    return (this.getData()['formTitle'] as string) || 'Sign up';
  }

  getFormSubtitle(): string {
    return (this.getData()['formSubtitle'] as string) || 'Enter your email to get started.';
  }

  getEmailPlaceholder(): string {
    return (this.getData()['emailPlaceholder'] as string) || 'Enter your email';
  }

  getButtonText(): string {
    return (this.getData()['buttonText'] as string) || 'Subscribe';
  }

  getCheckIconClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `h-6 w-5 flex-none text-${primary} dark:text-${primaryBase}-400`;
  }

  getBenefitClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-700';
    return `text-sm font-medium text-${textMuted} dark:text-gray-300`;
  }

  getFormClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const surfaceBase = surfaceDark.split('-')[0];
    return `rounded-2xl bg-white p-8 shadow-sm ring-1 ring-${surfaceBase}-900/5 dark:bg-${surfaceMutedDark} dark:ring-white/10`;
  }

  getFormTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-base font-semibold leading-7 text-${text} dark:text-white`;
  }

  getFormSubtitleClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-sm leading-6 text-${textMuted} dark:text-gray-400`;
  }

  getInputClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    const borderMuted = t.colors?.borderMuted ?? 'gray-300';
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-400';
    const primary = t.colors?.primary ?? 'indigo-600';
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-700';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-600';
    return `min-w-0 flex-auto rounded-md border-0 bg-${surfaceMuted} px-3.5 py-2 text-${text} shadow-sm ring-1 ring-inset ring-${borderMuted} placeholder:text-${textMutedLight} focus:ring-2 focus:ring-inset focus:ring-${primary} dark:bg-${surfaceMutedDark} dark:text-white dark:ring-${borderMutedDark} sm:text-sm sm:leading-6`;
  }

  getButtonClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryHover = t.colors?.primaryHover ?? 'indigo-500';
    return `shrink-0 rounded-md bg-${primary} px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-${primaryHover} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${primary}`;
  }
}
