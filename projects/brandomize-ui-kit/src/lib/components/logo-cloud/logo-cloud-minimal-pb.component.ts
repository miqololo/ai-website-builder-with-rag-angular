import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-logo-cloud-minimal-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 lg:gap-x-16">
        @for (logo of getLogos(); track $index) {
          <div class="flex items-center justify-center">
            @if (logo.link) {
              <a [href]="logo.link" target="_blank" rel="noopener noreferrer" class="block opacity-60 transition-opacity hover:opacity-100">
                <img [src]="logo.src" [alt]="logo.alt || ''" class="h-8 w-auto max-w-[120px] object-contain" />
              </a>
            } @else {
              <img [src]="logo.src" [alt]="logo.alt || ''" class="h-8 w-auto max-w-[120px] object-contain opacity-60" />
            }
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class LogoCloudMinimalPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'white') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'md') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: ['border-y', ...this.getSectionBorderClasses(), ...(this.config?.classes ?? [])] as string[]
    };
  }

  getSectionBorderClasses(): string[] {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-800';
    return [`border-${border}`, `dark:border-${borderMutedDark}`];
  }

  getLogos(): Array<{ src: string; alt?: string; link?: string }> {
    return (this.getData()['logos'] as Array<{ src: string; alt?: string; link?: string }>) || [
      { src: 'https://via.placeholder.com/120x40/6366f1/ffffff?text=Acme', alt: 'Acme', link: '#' },
      { src: 'https://via.placeholder.com/120x40/8b5cf6/ffffff?text=Gamma', alt: 'Gamma', link: '#' },
      { src: 'https://via.placeholder.com/120x40/ec4899/ffffff?text=Delta', alt: 'Delta', link: '#' }
    ];
  }
}
