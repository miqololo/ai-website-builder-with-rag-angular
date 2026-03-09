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
  selector: 'bkit-hero-split-with-image-pb',
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
      <div class="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div class="px-6 pt-10 pb-24 sm:pb-32 lg:col-span-7 lg:px-0 lg:pt-40 lg:pb-48 xl:col-span-6 opacity-0 animate-fade-in">
          <div class="mx-auto max-w-lg lg:mx-0">
            @if (getLogo()) {
              <img [src]="getLogo()" alt="Logo" class="h-11 dark:hidden" />
            }
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
        <div class="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
          <bkit-image
            [config]="{
              src: getImage(),
              alt: getImageAlt(),
              objectFit: 'cover',
              rounded: 'none',
              class: getImageClasses()
            }"
          ></bkit-image>
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class HeroSplitWithImagePbComponent {
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
      class: this.config?.classes ?? []
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

  getLogo(): string {
    return (this.getData()['logo'] as string) || '';
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
    return (this.getData()['image'] as string) || 'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2102&q=80';
  }

  getImageAlt(): string {
    return (this.getData()['imageAlt'] as string) || '';
  }

  getImageClasses(): string[] {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return [`aspect-3/2 w-full bg-${surfaceMuted} object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full dark:bg-${surfaceMutedDark}`];
  }
}
