import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-logo-cloud-bordered-pb',
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
          [config]="{ tag: 'h2', content: getTitle(), size: 'lg', weight: 'semibold', align: 'center', color: getTitleColor() }"
        ></bkit-text>
      }
      <div class="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        @for (logo of getLogos(); track $index) {
          <div [class]="getLogoCardClasses()">
            @if (logo.link) {
              <a [href]="logo.link" target="_blank" rel="noopener noreferrer" class="block w-full">
                <img [src]="logo.src" [alt]="logo.alt || ''" class="h-10 w-auto max-w-full object-contain opacity-80" />
              </a>
            } @else {
              <img [src]="logo.src" [alt]="logo.alt || ''" class="h-10 w-auto max-w-full object-contain opacity-80" />
            }
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class LogoCloudBorderedPbComponent {
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

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Proudly used by';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getLogoCardClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `flex items-center justify-center rounded-xl border border-${border} bg-white p-6 transition-all duration-300 hover:border-${primaryBase}-200 hover:shadow-md dark:border-${borderMutedDark} dark:bg-${surfaceDark} dark:hover:border-${primaryBase}-500/30`;
  }

  getLogos(): Array<{ src: string; alt?: string; link?: string }> {
    return (this.getData()['logos'] as Array<{ src: string; alt?: string; link?: string }>) || [
      { src: 'https://via.placeholder.com/160x40/6366f1/ffffff?text=Acme', alt: 'Acme', link: '#' },
      { src: 'https://via.placeholder.com/160x40/8b5cf6/ffffff?text=Gamma', alt: 'Gamma', link: '#' },
      { src: 'https://via.placeholder.com/160x40/ec4899/ffffff?text=Delta', alt: 'Delta', link: '#' },
      { src: 'https://via.placeholder.com/160x40/f59e0b/ffffff?text=Omega', alt: 'Omega', link: '#' },
      { src: 'https://via.placeholder.com/160x40/10b981/ffffff?text=Sigma', alt: 'Sigma', link: '#' }
    ];
  }
}
