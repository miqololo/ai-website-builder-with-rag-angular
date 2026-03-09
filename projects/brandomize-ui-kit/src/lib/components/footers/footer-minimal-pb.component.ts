import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-footer-minimal-pb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer [class]="getFooterClasses()">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div class="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
            @if (getBrand()) {
              <a [href]="getBrandLink()" [class]="getBrandClasses()">
                {{ getBrand() }}
              </a>
            }
            @if (getDescription()) {
              <p [class]="getDescriptionClasses()">{{ getDescription() }}</p>
            }
          </div>
          @if (getLinks().length) {
            <nav class="flex flex-wrap justify-center gap-x-6 gap-y-1">
              @for (link of getLinks(); track link.url) {
                <a [href]="link.url" [class]="getLinkClasses()">
                  {{ link.label }}
                </a>
              }
            </nav>
          }
        </div>
        @if (getCopyright()) {
          <p [class]="getCopyrightClasses()">
            {{ getCopyright() }}
          </p>
        }
      </div>
    </footer>
  `,
  styles: []
})
export class FooterMinimalPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getBrand(): string {
    return (this.getData()['brand'] as string) || 'Your Brand';
  }

  getBrandLink(): string {
    return (this.getData()['brandLink'] as string) || '/';
  }

  getDescription(): string {
    return (this.getData()['description'] as string) || '';
  }

  getCopyright(): string {
    return (this.getData()['copyright'] as string) || '© ' + new Date().getFullYear() + ' All rights reserved.';
  }

  getFooterClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-800';
    const surface = t.colors?.surface ?? 'white';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    return `border-t border-${border} bg-${surface} py-12 dark:border-${borderMutedDark} dark:bg-${surfaceDark}`;
  }

  getBrandClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-lg font-semibold text-${text} dark:text-white`;
  }

  getDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `max-w-xs text-sm text-${textMutedLight} dark:text-gray-400`;
  }

  getLinkClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    const text = t.colors?.text ?? 'gray-900';
    return `text-sm text-${textMutedLight} transition-colors hover:text-${text} dark:text-gray-400 dark:hover:text-white`;
  }

  getCopyrightClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-800';
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `mt-8 border-t border-${border} pt-8 text-center text-sm text-${textMutedLight} dark:border-${borderMutedDark} dark:text-gray-400`;
  }

  getLinks(): Array<{ label: string; url: string }> {
    const links = this.getData()['links'] as Array<{ label: string; url: string }> | undefined;
    if (links?.length) return links;
    const linkGroups = this.getData()['linkGroups'] as Array<{ links: Array<{ label: string; url: string }> }> | undefined;
    if (linkGroups?.length) return linkGroups.flatMap(g => g.links || []);
    return [
      { label: 'Privacy', url: '#' },
      { label: 'Terms', url: '#' },
      { label: 'Contact', url: '#' }
    ];
  }
}
