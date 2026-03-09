import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-newsletter-minimal-pb',
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
            [config]="{ tag: 'h2', content: getTitle(), size: '2xl', weight: 'semibold', align: 'center', color: getTitleColor() }"
          ></bkit-text>
          <bkit-text
            [config]="{ tag: 'p', content: getSubtitle(), size: 'base', align: 'center', color: getSubtitleColor() }"
          ></bkit-text>
        </bkit-stack>
        <form class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center" (ngSubmit)="onSubmit($event)">
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
        </form>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class NewsletterMinimalPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'white') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'md') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: this.config?.classes ?? []
    };
  }

  getHeaderStackConfig() {
    return { gap: 'sm' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  onSubmit(e: Event): void {
    e.preventDefault();
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Subscribe to our newsletter';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Get the latest news and updates.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getEmailPlaceholder(): string {
    return (this.getData()['emailPlaceholder'] as string) || 'Enter your email';
  }

  getButtonText(): string {
    return (this.getData()['buttonText'] as string) || 'Subscribe';
  }

  getInputClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    const borderMuted = t.colors?.borderMuted ?? 'gray-300';
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-400';
    const primary = t.colors?.primary ?? 'indigo-600';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-600';
    return `min-w-0 flex-auto rounded-md border border-${borderMuted} px-3 py-2 text-${text} placeholder:text-${textMutedLight} focus:border-${primary} focus:ring-1 focus:ring-${primary} dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark} dark:text-white dark:placeholder:text-gray-400 sm:text-sm`;
  }

  getButtonClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryHover = t.colors?.primaryHover ?? 'indigo-500';
    return `shrink-0 rounded-md bg-${primary} px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-${primaryHover} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${primary}`;
  }
}
