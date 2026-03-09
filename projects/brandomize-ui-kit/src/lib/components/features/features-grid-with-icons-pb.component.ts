import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PIconComponent } from '@brandomize/primitives/p-icon/p-icon.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-features-grid-with-icons-pb',
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
      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          @for (feature of getFeatures(); track $index) {
            <div class="group flex flex-col">
              <dt [class]="getFeatureTitleClasses()">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" [ngClass]="getIconBackgroundClasses()">
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
export class FeaturesGridWithIconsPbComponent {
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
    return (this.getData()['title'] as string) || 'All-in-one platform';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Everything you need to build modern web applications.';
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
      { title: 'Deploy instantly', description: 'Deploy your application with a single click. No configuration needed.' },
      { title: 'Scale automatically', description: 'Your application scales automatically based on traffic.' },
      { title: 'Built-in security', description: 'Enterprise-grade security built-in. SSL certificates, DDoS protection.' },
      { title: 'Global CDN', description: 'Content delivered from edge locations worldwide.' }
    ];
  }

  getBadgeColor(): string {
    const t = this.theme.themeResolved();
    return t.colors?.primary ?? 'indigo-600';
  }

  getFeatureTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `flex items-center gap-x-3 text-base font-semibold leading-7 text-${text} dark:text-white`;
  }

  getFeatureDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-4 flex flex-auto flex-col text-base leading-7 text-${textMuted} dark:text-gray-300`;
  }

  getIconBackgroundClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryHover = t.colors?.primaryHover ?? 'indigo-500';
    const primaryBase = primary.split('-')[0];
    return `bg-${primary} text-white dark:bg-${primaryHover} dark:text-white`;
  }
}
