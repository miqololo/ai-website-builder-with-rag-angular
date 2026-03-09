import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-logo-cloud-with-gradient-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PTextComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      @if (getTitle()) {
        <bkit-text
          [config]="{ tag: 'p', content: getTitle(), size: 'sm', weight: 'medium', align: 'center', color: getTitleColor() }"
        ></bkit-text>
      }
      <div class="mx-auto mt-12 flex flex-wrap items-center justify-center gap-x-16 gap-y-12 lg:gap-x-24">
        @for (logo of getLogos(); track $index) {
          <div class="flex items-center justify-center">
            @if (logo.link) {
              <a [href]="logo.link" target="_blank" rel="noopener noreferrer" class="block opacity-70 transition-opacity hover:opacity-100">
                <img [src]="logo.src" [alt]="logo.alt || ''" class="h-10 w-auto max-w-[130px] object-contain brightness-0 invert opacity-90" />
              </a>
            } @else {
              <img [src]="logo.src" [alt]="logo.alt || ''" class="h-10 w-auto max-w-[130px] object-contain brightness-0 invert opacity-90" />
            }
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class LogoCloudWithGradientPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: 'default' as const,
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: [
        ...this.theme.getGradientClass('logoCloud').split(' ').map(c => '!' + c),
        ...(this.config?.classes ?? [])
      ] as string[]
    };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Trusted by innovative teams';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.secondary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `${primaryBase}-300`;
  }

  getLogos(): Array<{ src: string; alt?: string; link?: string }> {
    return (this.getData()['logos'] as Array<{ src: string; alt?: string; link?: string }>) || [
      { src: 'https://via.placeholder.com/130x40/ffffff/374151?text=Acme', alt: 'Acme', link: '#' },
      { src: 'https://via.placeholder.com/130x40/ffffff/374151?text=Gamma', alt: 'Gamma', link: '#' },
      { src: 'https://via.placeholder.com/130x40/ffffff/374151?text=Delta', alt: 'Delta', link: '#' },
      { src: 'https://via.placeholder.com/130x40/ffffff/374151?text=Omega', alt: 'Omega', link: '#' },
      { src: 'https://via.placeholder.com/130x40/ffffff/374151?text=Sigma', alt: 'Sigma', link: '#' }
    ];
  }
}
