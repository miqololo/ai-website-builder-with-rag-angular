import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PRowComponent } from '@brandomize/primitives/p-row/p-row.component';
import { PButtonComponent } from '@brandomize/primitives/p-button/p-button.component';
import { PLinkComponent } from '@brandomize/primitives/p-link/p-link.component';
import { PImageComponent } from '@brandomize/primitives/p-image/p-image.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-hero-with-image-tiles-pb',
  standalone: true,
  imports: [
    CommonModule,
    PStackComponent,
    PTextComponent,
    PRowComponent,
    PButtonComponent,
    PLinkComponent,
    PImageComponent
  ],
  template: `
    <div class="relative isolate overflow-hidden">
      <div class="overflow-hidden">
        <div class="mx-auto max-w-7xl px-6 pt-36 pb-32 sm:pt-60 lg:px-8 lg:pt-32">
          <div class="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <div class="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl opacity-0 animate-fade-in">
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
            <div class="mt-14 flex flex-wrap justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
              @for (img of getImages(); track $index) {
                <div class="relative w-44 flex-none">
                  <bkit-image
                    [config]="{
                      src: img.src,
                      alt: img.alt || '',
                      objectFit: 'cover',
                      rounded: 'xl',
                      class: getImageClasses()
                    }"
                  ></bkit-image>
                  <div [class]="getImageRingClasses()"></div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HeroWithImageTilesPbComponent {
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
    return (this.getData()['title'] as string) || "We're changing the way people connect";
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
    return (this.getData()['secondaryButtonText'] as string) || 'Live demo';
  }

  getSecondaryButtonLink(): string {
    return (this.getData()['secondaryButtonLink'] as string) || '#';
  }

  getImageClasses(): string[] {
    const t = this.theme.themeResolved();
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-700';
    return [`aspect-2/3 w-full bg-${surfaceDark}/5 object-cover shadow-lg dark:bg-${surfaceMutedDark}/5`];
  }

  getImageRingClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    return `pointer-events-none absolute inset-0 rounded-xl ring-1 ring-${surfaceDark}/10 ring-inset dark:ring-white/10`;
  }

  getImages(): Array<{ src: string; alt?: string }> {
    const images = this.getData()['images'] as Array<{ src: string; alt?: string }> | undefined;
    return images ?? [
      { src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80' },
      { src: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80' },
      { src: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-x=.4&w=396&h=528&q=80' },
      { src: 'https://images.unsplash.com/photo-1670272504528-790c24957dda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=left&w=400&h=528&q=80' },
      { src: 'https://images.unsplash.com/photo-1670272505284-8faba1c31f7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=528&q=80' }
    ];
  }

}
