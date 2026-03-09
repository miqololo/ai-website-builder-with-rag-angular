import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PIconComponent } from '@brandomize/primitives/p-icon/p-icon.component';
import { PImageComponent } from '@brandomize/primitives/p-image/p-image.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-features-split-with-images-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PIconComponent,
    PImageComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <bkit-stack [config]="getHeaderStackConfig()">
          <bkit-text [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', color: getTitleColor() }"></bkit-text>
          <bkit-text [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', color: getSubtitleColor() }"></bkit-text>
        </bkit-stack>
      </div>
      <div class="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
        <div class="-mt-8 sm:-mx-4 sm:columns-1 sm:text-[0] lg:columns-2">
          @for (feature of getFeatures(); track $index) {
            <div class="pt-8 sm:inline-block sm:w-full sm:px-4">
              <figure [class]="getCardClasses()">
                <div [class]="getCardHeaderClasses()">
                  <div class="h-8 w-8 rounded-lg flex items-center justify-center" [ngClass]="getIconBackgroundClasses()">
                    <bkit-icon [config]="{ name: 'sparkles', size: 20, color: 'white' }"></bkit-icon>
                  </div>
                  <span [class]="getCategoryClasses()">{{ feature.category }}</span>
                </div>
                <blockquote [class]="getBlockquoteClasses()">
                  <p [class]="getFeatureTitleClasses()">{{ feature.title }}</p>
                  <p [class]="getFeatureDescriptionClasses()">{{ feature.description }}</p>
                </blockquote>
                @if (feature.image) {
                  <figcaption class="mt-6 flex gap-x-4">
                    <bkit-image
                      [config]="{ src: feature.image, alt: feature.title, rounded: 'full', class: ['h-10 w-10 flex-none object-cover'] }"
                    ></bkit-image>
                    <div class="text-sm leading-6">
                      <div [class]="getCaptionTitleClasses()">{{ feature.title }}</div>
                      @if (feature.subtitle) {
                        <div [class]="getCaptionSubtitleClasses()">{{ feature.subtitle }}</div>
                      }
                    </div>
                  </figcaption>
                }
              </figure>
            </div>
          }
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class FeaturesSplitWithImagesPbComponent {
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
    return { gap: 'lg' as const, alignItems: 'start' as const, class: [] as string[] };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Everything you need to get started';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'All the features you need to build amazing products.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getFeatures(): Array<{ title: string; description: string; category: string; image?: string; subtitle?: string }> {
    return (this.getData()['features'] as Array<{ title: string; description: string; category: string; image?: string; subtitle?: string }>) || [
      { title: 'Real-time collaboration', description: 'Work together with your team in real-time.', category: 'Collaboration', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', subtitle: 'Team Lead' },
      { title: 'Advanced analytics', description: 'Get deep insights into your data.', category: 'Analytics', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', subtitle: 'Data Analyst' },
      { title: 'Secure by default', description: 'Enterprise-grade security built into every feature.', category: 'Security', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', subtitle: 'Security Expert' },
      { title: 'Custom integrations', description: 'Connect with your favorite tools and services.', category: 'Integrations', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', subtitle: 'Integration Specialist' }
    ];
  }

  getCardClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `rounded-2xl bg-${surfaceMuted} p-8 text-sm leading-6 dark:bg-${surfaceMutedDark}`;
  }

  getCardHeaderClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `mb-4 flex items-center gap-x-4 text-xs text-${textMutedLight} dark:text-gray-400`;
  }

  getCategoryClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `font-semibold text-${text} dark:text-white`;
  }

  getBlockquoteClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-${text} dark:text-white`;
  }

  getFeatureTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-base font-semibold mb-2 text-${text} dark:text-white`;
  }

  getFeatureDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `text-sm text-${textMuted} dark:text-gray-300`;
  }

  getCaptionTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `font-semibold text-${text} dark:text-white`;
  }

  getCaptionSubtitleClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `text-${textMuted} dark:text-gray-400`;
  }

  getIconBackgroundClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryHover = t.colors?.primaryHover ?? 'indigo-500';
    return `bg-${primary} text-white dark:bg-${primaryHover} dark:text-white`;
  }
}
