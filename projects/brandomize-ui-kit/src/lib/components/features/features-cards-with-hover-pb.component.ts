import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PIconComponent } from '@brandomize/primitives/p-icon/p-icon.component';
import { PLinkComponent } from '@brandomize/primitives/p-link/p-link.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-features-cards-with-hover-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PIconComponent,
    PLinkComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="mx-auto max-w-2xl lg:text-center">
        <bkit-stack [config]="getHeaderStackConfig()">
          <bkit-text [config]="{ tag: 'h2', content: getBadge(), size: 'base', weight: 'semibold', color: getBadgeColor() }"></bkit-text>
          <bkit-text [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', color: getTitleColor() }"></bkit-text>
          <bkit-text [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', color: getSubtitleColor() }"></bkit-text>
        </bkit-stack>
      </div>
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-8">
        @for (feature of getFeatures(); track $index) {
          <div [class]="getCardClasses()" [ngClass]="getCardHoverClasses()">
            <div>
              <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg" [ngClass]="getIconBackgroundClasses()">
                <bkit-icon [config]="{ name: 'sparkles', size: 24, color: 'white' }"></bkit-icon>
              </div>
              <h3 [class]="getFeatureTitleClasses()">{{ feature.title }}</h3>
              <p [class]="getFeatureDescriptionClasses()">{{ feature.description }}</p>
            </div>
            @if (feature.link) {
              <div class="mt-6">
                <bkit-link
                  [config]="{ href: feature.link, text: 'Learn more →', variant: 'primary', ariaLabel: 'Learn more' }"
                ></bkit-link>
              </div>
            }
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class FeaturesCardsWithHoverPbComponent {
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
      animateOnScroll: true,
      class: this.config?.classes ?? []
    };
  }

  getHeaderStackConfig() {
    return { gap: 'lg' as const, alignItems: 'center' as const, class: [] as string[] };
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

  getFeatures(): Array<{ title: string; description: string; link?: string }> {
    return (this.getData()['features'] as Array<{ title: string; description: string; link?: string }>) || [
      { title: 'Analytics', description: 'Get insights into your users with powerful analytics tools.', link: '#' },
      { title: 'Integrations', description: 'Connect with your favorite tools and services seamlessly.', link: '#' },
      { title: 'Security', description: 'Enterprise-grade security to keep your data safe.', link: '#' }
    ];
  }

  getBadgeColor(): string {
    const t = this.theme.themeResolved();
    return t.colors?.primary ?? 'indigo-600';
  }

  getIconBackgroundClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryHover = t.colors?.primaryHover ?? 'indigo-500';
    return `bg-${primary} text-white dark:bg-${primaryHover} dark:text-white`;
  }

  getCardClasses(): string {
    const t = this.theme.themeResolved();
    const surface = t.colors?.surface ?? 'white';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    return `flex flex-col justify-between rounded-xl bg-${surface} p-8 shadow-sm ring-1 ring-${surfaceDark}/5 transition-all duration-300 hover:shadow-xl dark:bg-${surfaceMutedDark} dark:ring-white/10`;
  }

  getFeatureTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-base font-semibold leading-7 text-${text} dark:text-white`;
  }

  getFeatureDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-sm leading-6 text-${textMuted} dark:text-gray-300`;
  }

  getCardHoverClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `hover:ring-${primaryBase}-500/50 dark:hover:ring-${primaryBase}-500/50`;
  }
}
