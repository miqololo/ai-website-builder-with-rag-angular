import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PRowComponent } from '@brandomize/primitives/p-row/p-row.component';
import { PButtonComponent } from '@brandomize/primitives/p-button/p-button.component';
import { PLinkComponent } from '@brandomize/primitives/p-link/p-link.component';
import { PImageComponent } from '@brandomize/primitives/p-image/p-image.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';

@Component({
  selector: 'bkit-hero-split-with-screenshot-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PRowComponent,
    PButtonComponent,
    PLinkComponent,
    PImageComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="mx-auto max-w-7xl lg:flex lg:px-8 lg:py-40">
        <div class="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:pt-8 opacity-0 animate-fade-in">
          @if (getLogo()) {
            <img [src]="getLogo()" alt="Logo" class="h-11" />
          }
          <bkit-stack [config]="getStackConfig()">
            @if (getBadge()) {
              <a [href]="getBadgeLink()" class="inline-flex space-x-6">
                <span [class]="getBadgeClasses()">{{ getBadge() }}</span>
                <span [class]="getBadgeSubtextClasses()">
                  <span>{{ getBadgeSubtext() }}</span>
                  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" [class]="getBadgeIconClasses()">
                    <path d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" fill-rule="evenodd" />
                  </svg>
                </span>
              </a>
            }
            <bkit-text
              [config]="{
                tag: 'h1',
                content: getTitle(),
                size: '5xl',
                weight: 'semibold',
                color: getTitleColor()
              }"
            ></bkit-text>
            <bkit-text
              [config]="{
                tag: 'p',
                content: getSubtitle(),
                size: 'lg',
                color: getSubtitleColor()
              }"
            ></bkit-text>
            <bkit-row [config]="getButtonsRowConfig()">
              @if (getPrimaryButtonText()) {
                <bkit-button
                  [config]="{
                    href: getPrimaryButtonLink(),
                    variant: 'primary',
                    size: 'md',
                    text: getPrimaryButtonText(),
                    ariaLabel: getPrimaryButtonText(),
                    class: ['shrink-0']
                  }"
                ></bkit-button>
              }
              @if (getSecondaryButtonText()) {
                <bkit-link
                  [config]="{
                    href: getSecondaryButtonLink(),
                    text: getSecondaryButtonText() + ' →',
                    variant: 'primary',
                    ariaLabel: getSecondaryButtonText(),
                    class: ['shrink-0', 'whitespace-nowrap']
                  }"
                ></bkit-link>
              }
            </bkit-row>
          </bkit-stack>
        </div>
        <div class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32">
          <div [class]="getImageWrapperClasses()">
            <bkit-image
              [config]="{
                src: getScreenshot(),
                alt: getScreenshotAlt(),
                objectFit: 'cover',
                rounded: 'md',
                class: getImageClasses()
              }"
            ></bkit-image>
          </div>
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class HeroSplitWithScreenshotPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'white') as 'default' | 'muted' | 'white' | 'dark',
      padding: 'none' as const,
      maxWidth: 'full' as const,
      class: ['relative isolate overflow-hidden', ...(this.config?.classes ?? [])] as string[]
    };
  }

  getStackConfig() {
    return {
      gap: 'lg' as const,
      alignItems: 'start' as const,
      class: [] as string[]
    };
  }

  getButtonsRowConfig() {
    return {
      gap: 'lg' as const,
      justifyContent: 'start' as const,
      alignItems: 'center' as const,
      wrap: false,
      class: [] as string[]
    };
  }

  getImageWrapperClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const withBorder = this.getData()['withBorder'];
    return withBorder ? `-m-2 rounded-xl bg-${surfaceDark}/5 p-2 ring-1 ring-${surfaceDark}/10 ring-inset lg:-m-4 lg:rounded-2xl lg:p-4` : 'max-w-3xl flex-none sm:max-w-5xl lg:max-w-none';
  }

  getImageClasses(): string[] {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    return [`w-full rounded-md bg-${surfaceMuted} shadow-xl ring-1 ring-${surfaceDark}/10`];
  }

  getBadgeClasses(): string {
    const t = this.theme.themeResolved();
    const primaryMuted = t.colors?.primaryMuted ?? 'indigo-50';
    const primary = t.colors?.primary ?? 'indigo-600';
    return `rounded-full bg-${primaryMuted} px-3 py-1 text-sm/6 font-semibold text-${primary} ring-1 ring-${primary}/20 ring-inset`;
  }

  getBadgeSubtextClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `inline-flex items-center space-x-2 text-sm/6 font-medium text-${textMuted}`;
  }

  getBadgeIconClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-400';
    return `size-5 text-${textMutedLight}`;
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Deploy to the cloud with confidence';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-500');
  }

  getLogo(): string {
    return (this.getData()['logo'] as string) || '';
  }

  getBadge(): string {
    return (this.getData()['badge'] as string) || '';
  }

  getBadgeLink(): string {
    return (this.getData()['badgeLink'] as string) || '#';
  }

  getBadgeSubtext(): string {
    return (this.getData()['badgeSubtext'] as string) || 'Just shipped v1.0';
  }

  getPrimaryButtonText(): string {
    return (this.getData()['primaryButtonText'] as string) || 'Get started';
  }

  getPrimaryButtonLink(): string {
    return (this.getData()['primaryButtonLink'] as string) || '#';
  }

  getSecondaryButtonText(): string {
    return (this.getData()['secondaryButtonText'] as string) || 'Learn more';
  }

  getSecondaryButtonLink(): string {
    return (this.getData()['secondaryButtonLink'] as string) || '#';
  }

  getScreenshot(): string {
    return (this.getData()['screenshot'] as string) || 'https://tailwindcss.com/plus-assets/img/component-images/project-bkit-screenshot.png';
  }

  getScreenshotAlt(): string {
    return (this.getData()['screenshotAlt'] as string) || 'App screenshot';
  }
}
