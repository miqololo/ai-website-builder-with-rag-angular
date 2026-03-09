import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-logo-cloud-centered-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="mx-auto max-w-2xl text-center">
        <bkit-stack [config]="getHeaderStackConfig()">
          <bkit-text
            [config]="{ tag: 'h2', content: getTitle(), size: 'lg', weight: 'semibold', align: 'center', color: getSubtitleColor() }"
          ></bkit-text>
          @if (getSubtitle()) {
            <bkit-text
              [config]="{ tag: 'p', content: getSubtitle(), size: 'sm', align: 'center', color: getSubtitleColor() }"
            ></bkit-text>
          }
        </bkit-stack>
      </div>
      <div class="mx-auto mt-10 grid max-w-5xl grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-5">
        @for (logo of getLogos(); track $index) {
          <div class="flex items-center justify-center">
            @if (logo.link) {
              <a [href]="logo.link" target="_blank" rel="noopener noreferrer" class="block opacity-70 transition-opacity hover:opacity-100">
                <img [src]="logo.src" [alt]="logo.alt || ''" class="h-12 w-auto max-w-[140px] object-contain" />
              </a>
            } @else {
              <img [src]="logo.src" [alt]="logo.alt || ''" class="h-12 w-auto max-w-[140px] object-contain opacity-70" />
            }
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class LogoCloudCenteredPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'muted') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'md') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: this.config?.classes ?? []
    };
  }

  getHeaderStackConfig() {
    return { gap: 'sm' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Trusted by companies worldwide';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || '';
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getLogos(): Array<{ src: string; alt?: string; link?: string }> {
    return (this.getData()['logos'] as Array<{ src: string; alt?: string; link?: string }>) || [
      { src: 'https://via.placeholder.com/140x48/6366f1/ffffff?text=Acme', alt: 'Acme', link: '#' },
      { src: 'https://via.placeholder.com/140x48/8b5cf6/ffffff?text=Gamma', alt: 'Gamma', link: '#' },
      { src: 'https://via.placeholder.com/140x48/ec4899/ffffff?text=Delta', alt: 'Delta', link: '#' },
      { src: 'https://via.placeholder.com/140x48/14b8a6/ffffff?text=Epsilon', alt: 'Epsilon', link: '#' }
    ];
  }
}
