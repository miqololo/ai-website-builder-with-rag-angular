import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PRowComponent } from '@brandomize/primitives/p-row/p-row.component';
import { PButtonComponent } from '@brandomize/primitives/p-button/p-button.component';
import { PLinkComponent } from '@brandomize/primitives/p-link/p-link.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-hero-simple-centered-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PRowComponent,
    PButtonComponent,
    PLinkComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 relative z-10 opacity-0 animate-fade-in">
        @if (getAnnouncement()) {
          <div class="hidden sm:mb-8 sm:flex sm:justify-center">
            <div [class]="getAnnouncementClasses()">
              {{ getAnnouncement() }}
              <a [href]="getAnnouncementLink()" [class]="getAnnouncementLinkClasses()"><span aria-hidden="true" class="absolute inset-0"></span>{{ getAnnouncementLinkText() }} <span aria-hidden="true">&rarr;</span></a>
            </div>
          </div>
        }
        <div class="text-center">
          <bkit-stack [config]="getStackConfig()">
            <bkit-text
              [config]="{
                tag: 'h1',
                content: getTitle(),
                size: '5xl',
                weight: 'semibold',
                align: 'center',
                color: getTitleColor()
              }"
            ></bkit-text>
            <bkit-text
              [config]="{
                tag: 'p',
                content: getSubtitle(),
                size: 'lg',
                align: 'center',
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
    </bkit-section>
  `,
  styles: []
})
export class HeroSimpleCenteredPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'white') as 'default' | 'muted' | 'white' | 'dark',
      backgroundImage: (d['backgroundImage'] as string) || undefined,
      backgroundVideo: (d['backgroundVideo'] as string) || undefined,
      backgroundOverlay: d['backgroundOverlay'] !== undefined ? (d['backgroundOverlay'] as boolean) : undefined,
      backgroundOverlayOpacity: d['backgroundOverlayOpacity'] !== undefined ? (d['backgroundOverlayOpacity'] as number) : undefined,
      padding: 'none' as const,
      class: ['relative isolate overflow-hidden', ...(this.config?.classes ?? [])] as string[]
    };
  }

  getStackConfig() {
    return {
      gap: 'lg' as const,
      alignItems: 'center' as const,
      class: [] as string[]
    };
  }

  getButtonsRowConfig() {
    return {
      gap: 'lg' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      wrap: false,
      class: [] as string[]
    };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Data to enrich your online business';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.';
  }

  getTitleColor(): string {
    const d = this.getData();
    // If titleColor is explicitly set, use it
    if (d['titleColor']) {
      return d['titleColor'] as string;
    }
    // If there's a background image or video, default to white for readability
    if (d['backgroundImage'] || d['backgroundVideo']) {
      return 'white';
    }
    const t = this.theme.themeResolved();
    return t.colors?.text ?? 'gray-900';
  }

  getSubtitleColor(): string {
    const d = this.getData();
    // If subtitleColor is explicitly set, use it
    if (d['subtitleColor']) {
      return d['subtitleColor'] as string;
    }
    // If there's a background image or video, default to white for readability
    if (d['backgroundImage'] || d['backgroundVideo']) {
      return 'white';
    }
    const t = this.theme.themeResolved();
    return t.colors?.textMuted ?? 'gray-500';
  }

  getAnnouncement(): string {
    return (this.getData()['announcement'] as string) || '';
  }

  getAnnouncementLink(): string {
    return (this.getData()['announcementLink'] as string) || '#';
  }

  getAnnouncementLinkText(): string {
    return (this.getData()['announcementLinkText'] as string) || 'Read more';
  }

  getAnnouncementClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return (this.getData()['announcementColor'] as string) === 'white'
      ? 'relative rounded-full px-3 py-1 text-sm/6 ring-1 ring-white/20 text-white'
      : `relative rounded-full px-3 py-1 text-sm/6 ring-1 ring-${surfaceDark}/10 hover:ring-${surfaceDark}/20 text-${textMuted}`;
  }

  getAnnouncementLinkClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    return `font-semibold text-${primary}`;
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
}
