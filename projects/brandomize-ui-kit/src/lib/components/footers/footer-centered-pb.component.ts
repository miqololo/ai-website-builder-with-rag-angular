import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-footer-centered-pb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer [class]="getFooterClasses()">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          @if (getBrand()) {
            <a [href]="getBrandLink()" [class]="getBrandClasses()">
              {{ getBrand() }}
            </a>
          }
          @if (getDescription()) {
            <p [class]="getDescriptionClasses()">{{ getDescription() }}</p>
          }
          @if (getLinkGroups().length) {
            <nav class="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-4">
              @for (group of getLinkGroups(); track group.title || $index) {
                @for (link of group.links; track link.url) {
                  <a [href]="link.url" [class]="getLinkClasses()">
                    {{ link.label }}
                  </a>
                }
              }
            </nav>
          }
          @if (getCopyright()) {
            <p [class]="getCopyrightClasses()">
              {{ getCopyright() }}
            </p>
          }
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterCenteredPbComponent {
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
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    return `border-t border-${border} bg-${surfaceMuted} py-16 dark:border-${borderMutedDark} dark:bg-${surfaceDark}`;
  }

  getBrandClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-2xl font-bold text-${text} dark:text-white`;
  }

  getDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-3 text-sm text-${textMuted} dark:text-gray-300`;
  }

  getLinkClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    const text = t.colors?.text ?? 'gray-900';
    return `text-sm font-medium text-${textMuted} transition-colors hover:text-${text} dark:text-gray-400 dark:hover:text-white`;
  }

  getCopyrightClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `mt-12 border-t border-${border} pt-8 text-center text-sm text-${textMutedLight} dark:border-${borderMutedDark} dark:text-gray-400`;
  }

  getLinkGroups(): Array<{ title?: string; links: Array<{ label: string; url: string }> }> {
    const groups = this.getData()['linkGroups'] as Array<{ title?: string; links: Array<{ label: string; url: string }> }> | undefined;
    if (groups?.length) return groups;
    const links = this.getData()['links'] as Array<{ label: string; url: string }> | undefined;
    if (links?.length) return [{ links }];
    return [
      { links: [{ label: 'Privacy', url: '#' }, { label: 'Terms', url: '#' }, { label: 'Contact', url: '#' }] }
    ];
  }
}
