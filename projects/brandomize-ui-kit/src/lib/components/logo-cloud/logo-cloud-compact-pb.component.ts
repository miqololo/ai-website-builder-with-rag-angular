import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-logo-cloud-compact-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PTextComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        @if (getTitle()) {
          <p [class]="getTitleClasses()">{{ getTitle() }}</p>
        }
        <div class="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-12">
          @for (logo of getLogos(); track $index) {
            <div class="flex items-center">
              @if (logo.link) {
                <a [href]="logo.link" target="_blank" rel="noopener noreferrer" class="block opacity-50 transition-opacity hover:opacity-100">
                  <img [src]="logo.src" [alt]="logo.alt || ''" class="h-6 w-auto max-w-[100px] object-contain" />
                </a>
              } @else {
                <img [src]="logo.src" [alt]="logo.alt || ''" class="h-6 w-auto max-w-[100px] object-contain opacity-50" />
              }
            </div>
          }
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class LogoCloudCompactPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'white') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'sm') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: ['border-t', ...this.getSectionBorderClasses(), ...(this.config?.classes ?? [])] as string[]
    };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'As seen in';
  }

  getTitleClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `text-sm font-medium text-${textMutedLight} dark:text-gray-400`;
  }

  getSectionBorderClasses(): string[] {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-800';
    return [`border-${border}`, `dark:border-${borderMutedDark}`];
  }

  getLogos(): Array<{ src: string; alt?: string; link?: string }> {
    return (this.getData()['logos'] as Array<{ src: string; alt?: string; link?: string }>) || [
      { src: 'https://via.placeholder.com/100x24/4f46e5/ffffff?text=Acme', alt: 'Acme', link: '#' },
      { src: 'https://via.placeholder.com/100x24/7c3aed/ffffff?text=Gamma', alt: 'Gamma', link: '#' },
      { src: 'https://via.placeholder.com/100x24/db2777/ffffff?text=Delta', alt: 'Delta', link: '#' },
      { src: 'https://via.placeholder.com/100x24/d97706/ffffff?text=Omega', alt: 'Omega', link: '#' }
    ];
  }
}
