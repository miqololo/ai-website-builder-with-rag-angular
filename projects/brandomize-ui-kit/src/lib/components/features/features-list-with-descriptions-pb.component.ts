import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PLinkComponent } from '@brandomize/primitives/p-link/p-link.component';
import { PIconComponent } from '@brandomize/primitives/p-icon/p-icon.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-features-list-with-descriptions-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PLinkComponent,
    PIconComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
        <div>
          <bkit-stack [config]="getHeaderStackConfig()">
            <bkit-text [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', color: getTitleColor() }"></bkit-text>
            <bkit-text [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', color: getSubtitleColor() }"></bkit-text>
            @if (getCtaText()) {
              <bkit-link
                [config]="{ href: getCtaLink(), text: getCtaText() + ' →', variant: 'primary', ariaLabel: getCtaText() }"
              ></bkit-link>
            }
          </bkit-stack>
        </div>
        <div class="mt-16 sm:mt-20 lg:mt-0">
          <dl class="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-1 lg:gap-x-8">
            @for (feature of getFeatures(); track $index) {
              <div class="relative">
                <dt [class]="getFeatureTitleClasses()">
                  <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg" [ngClass]="getIconBackgroundClasses()">
                    <bkit-icon [config]="{ name: 'check-circle', size: 24, color: 'white' }"></bkit-icon>
                  </div>
                  <p class="ml-16">{{ feature.title }}</p>
                </dt>
                <dd [class]="getFeatureDescriptionClasses()">
                  {{ feature.description }}
                </dd>
              </div>
            }
          </dl>
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class FeaturesListWithDescriptionsPbComponent {
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
    return {
      gap: 'lg' as const,
      alignItems: 'start' as const,
      class: [] as string[]
    };
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

  getCtaText(): string {
    return (this.getData()['ctaText'] as string) || '';
  }

  getCtaLink(): string {
    return (this.getData()['ctaLink'] as string) || '#';
  }

  getFeatureTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-base font-semibold leading-7 text-${text} dark:text-white`;
  }

  getFeatureDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 ml-16 text-base leading-7 text-${textMuted} dark:text-gray-300`;
  }

  getIconBackgroundClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryHover = t.colors?.primaryHover ?? 'indigo-500';
    return `bg-${primary} text-white dark:bg-${primaryHover} dark:text-white`;
  }

  getFeatures(): Array<{ title: string; description: string }> {
    return (this.getData()['features'] as Array<{ title: string; description: string }>) || [
      { title: 'No setup required', description: 'Get started in seconds. No configuration needed.' },
      { title: 'Scale infinitely', description: 'Grow from startup to enterprise without limits.' }
    ];
  }
}
