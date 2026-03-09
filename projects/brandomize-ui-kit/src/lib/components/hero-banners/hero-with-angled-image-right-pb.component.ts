import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PRowComponent } from '@brandomize/primitives/p-row/p-row.component';
import { PButtonComponent } from '@brandomize/primitives/p-button/p-button.component';
import { PLinkComponent } from '@brandomize/primitives/p-link/p-link.component';
import { PImageComponent } from '@brandomize/primitives/p-image/p-image.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-hero-with-angled-image-right-pb',
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
    <div class="relative">
      <div class="mx-auto max-w-7xl">
        <div class="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" [class]="getSvgClasses()">
            <polygon points="0,0 90,0 50,100 0,100" />
          </svg>
          <div class="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56 lg:pr-0 opacity-0 animate-fade-in">
            <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
              <bkit-stack [config]="getStackConfig()">
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
          </div>
        </div>
      </div>
      <div [class]="getImageWrapperClasses()">
        <bkit-image
          [config]="{
            src: getImage(),
            alt: getImageAlt(),
            objectFit: 'cover',
            rounded: 'none',
            class: ['aspect-3/2 object-cover lg:aspect-auto lg:size-full']
          }"
        ></bkit-image>
      </div>
    </div>
  `,
  styles: []
})
export class HeroWithAngledImageRightPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
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

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Data to enrich your business';
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

  getImage(): string {
    return (this.getData()['image'] as string) || 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80';
  }

  getImageAlt(): string {
    return (this.getData()['imageAlt'] as string) || '';
  }

  getSvgClasses(): string {
    const t = this.theme.themeResolved();
    const background = t.colors?.background ?? 'white';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    return `absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-${background} lg:block dark:fill-${surfaceDark}`;
  }

  getImageWrapperClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `bg-${surfaceMuted} lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 dark:bg-${surfaceMutedDark}`;
  }
}
