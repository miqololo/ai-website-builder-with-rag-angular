import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PImageComponent } from '@brandomize/primitives/p-image/p-image.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-features-split-image-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PImageComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        <div [class]="getContentOrderClasses()">
          <div class="lg:max-w-lg">
            <bkit-stack [config]="getHeaderStackConfig()">
              <bkit-text [config]="{ tag: 'h2', content: getBadge(), size: 'base', weight: 'semibold', color: getBadgeColor() }"></bkit-text>
              <bkit-text [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', color: getTitleColor() }"></bkit-text>
              <bkit-text [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', color: getSubtitleColor() }"></bkit-text>
            </bkit-stack>
            <dl [class]="getFeaturesListClasses()">
              @for (feature of getFeatures(); track $index) {
                <div class="relative pl-9">
                  <dt [class]="getFeatureTitleClasses()">
                    <div class="absolute left-1 top-1 h-5 w-5" [ngClass]="getCheckIconClasses()">
                      <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    {{ feature.title }}
                  </dt>
                  <dd class="inline mt-2">{{ feature.description }}</dd>
                </div>
              }
            </dl>
          </div>
        </div>
        <div [class]="getImageOrderClasses()" class="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[3/2] overflow-hidden rounded-2xl">
          <bkit-image
            [config]="{
              src: getImage(),
              alt: getImageAlt(),
              objectFit: 'cover',
              rounded: 'xl',
              class: getImageClasses()
            }"
          ></bkit-image>
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class FeaturesSplitImagePbComponent {
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

  getContentOrderClasses(): string {
    const pos = this.getImagePosition();
    return pos === 'right' ? 'lg:pr-8 xl:pr-0 lg:order-1' : 'lg:pr-8 xl:pr-0 lg:order-2';
  }

  getImageOrderClasses(): string {
    const pos = this.getImagePosition();
    return pos === 'left' ? 'lg:order-1' : 'lg:order-2';
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

  getImage(): string {
    return (this.getData()['image'] as string) || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80';
  }

  getImageAlt(): string {
    return (this.getData()['imageAlt'] as string) || 'Feature showcase';
  }

  getImagePosition(): 'left' | 'right' {
    return (this.getData()['imagePosition'] as 'left' | 'right') || 'right';
  }

  getBadgeColor(): string {
    const t = this.theme.themeResolved();
    return t.colors?.primary ?? 'indigo-600';
  }

  getFeaturesListClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-10 max-w-xl space-y-8 text-base leading-7 text-${textMuted} lg:max-w-none dark:text-gray-300`;
  }

  getFeatureTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `inline font-semibold text-${text} dark:text-white`;
  }

  getCheckIconClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-${primary} dark:text-${primaryBase}-400`;
  }

  getImageClasses(): string[] {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return [`absolute inset-0 h-full w-full bg-${surfaceMuted} object-cover shadow-2xl dark:bg-${surfaceMutedDark}`];
  }

  getFeatures(): Array<{ title: string; description: string }> {
    return (this.getData()['features'] as Array<{ title: string; description: string }>) || [
      { title: 'Deploy instantly', description: 'Deploy your application with a single click. No configuration needed.' },
      { title: 'Scale automatically', description: 'Your application scales automatically based on traffic.' },
      { title: 'Built-in security', description: 'Enterprise-grade security built-in. SSL certificates, DDoS protection.' },
      { title: 'Global CDN', description: 'Content delivered from edge locations worldwide.' }
    ];
  }
}
