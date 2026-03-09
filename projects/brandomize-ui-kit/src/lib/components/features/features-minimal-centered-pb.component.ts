import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PIconComponent } from '@brandomize/primitives/p-icon/p-icon.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-features-minimal-centered-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PIconComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="mx-auto max-w-2xl lg:text-center">
        <bkit-stack [config]="getHeaderStackConfig()">
          <bkit-text
            [config]="{ tag: 'h2', content: getBadge(), size: 'base', weight: 'semibold', color: getBadgeColor() }"
          ></bkit-text>
          <bkit-text
            [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', color: getTitleColor() }"
          ></bkit-text>
          <bkit-text
            [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', color: getSubtitleColor() }"
          ></bkit-text>
        </bkit-stack>
      </div>
      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          @for (feature of getFeatures(); track $index) {
            <div class="flex flex-col">
              <dt [class]="getFeatureTitleClasses()">
                <div class="mb-6 flex h-10 w-10 items-center justify-center rounded-lg" [ngClass]="getIconBackgroundClasses()">
                  <bkit-icon [config]="{ name: 'check-circle', size: 24, color: 'white' }"></bkit-icon>
                </div>
                {{ feature.title }}
              </dt>
              <dd [class]="getFeatureDescriptionClasses()">
                <p class="flex-auto">{{ feature.description }}</p>
              </dd>
            </div>
          }
        </dl>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class FeaturesMinimalCenteredPbComponent {
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
    return {
      gap: 'lg' as const,
      alignItems: 'center' as const,
      class: [] as string[]
    };
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

  getFeatures(): Array<{ title: string; description: string }> {
    return (this.getData()['features'] as Array<{ title: string; description: string }>) || [
      { title: 'No setup required', description: 'Get started in seconds. No configuration needed.' },
      { title: 'Scale infinitely', description: 'Grow from startup to enterprise without limits.' },
      { title: 'Always available', description: '99.9% uptime guarantee with global infrastructure.' }
    ];
  }

  getBadgeColor(): string {
    const t = this.theme.themeResolved();
    return t.colors?.primary ?? 'indigo-600';
  }

  getFeatureTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-base font-semibold leading-7 text-${text} dark:text-white`;
  }

  getFeatureDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 flex flex-auto flex-col text-base leading-7 text-${textMuted} dark:text-gray-300`;
  }

  getIconBackgroundClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryHover = t.colors?.primaryHover ?? 'indigo-500';
    return `bg-${primary} text-white dark:bg-${primaryHover} dark:text-white`;
  }
}
