import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-footer-multi-column-pb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer [class]="getFooterClasses()">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          <div class="col-span-2 md:col-span-1">
            @if (getBrand()) {
              <a [href]="getBrandLink()" [class]="getBrandClasses()">
                {{ getBrand() }}
              </a>
            }
            @if (getDescription()) {
              <p [class]="getDescriptionClasses()">{{ getDescription() }}</p>
            }
          </div>
          @for (group of getLinkGroups(); track group.title || $index) {
            <div>
              <h3 [class]="getGroupTitleClasses()">
                {{ group.title }}
              </h3>
              <ul class="mt-4 space-y-3">
                @for (link of group.links; track link.url) {
                  <li>
                    <a [href]="link.url" [class]="getLinkClasses()">
                      {{ link.label }}
                    </a>
                  </li>
                }
              </ul>
            </div>
          }
        </div>
        @if (getCopyright()) {
          <div [class]="getCopyrightWrapperClasses()">
            <p [class]="getCopyrightClasses()">{{ getCopyright() }}</p>
          </div>
        }
      </div>
    </footer>
  `,
  styles: []
})
export class FooterMultiColumnPbComponent {
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
    return `border-t border-${border} bg-${surface} py-16 dark:border-${borderMutedDark} dark:bg-${surfaceDark}`;
  }

  getBrandClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-xl font-bold text-${text} dark:text-white`;
  }

  getDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-4 text-sm text-${textMuted} dark:text-gray-400`;
  }

  getGroupTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-sm font-semibold uppercase tracking-wider text-${text} dark:text-white`;
  }

  getLinkClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    const text = t.colors?.text ?? 'gray-900';
    return `text-sm text-${textMuted} transition-colors hover:text-${text} dark:text-gray-400 dark:hover:text-white`;
  }

  getCopyrightWrapperClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-800';
    return `mt-12 border-t border-${border} pt-8 dark:border-${borderMutedDark}`;
  }

  getCopyrightClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `text-center text-sm text-${textMutedLight} dark:text-gray-400`;
  }

  getLinkGroups(): Array<{ title?: string; links: Array<{ label: string; url: string }> }> {
    return (this.getData()['linkGroups'] as Array<{ title?: string; links: Array<{ label: string; url: string }> }>) || [
      { title: 'Product', links: [{ label: 'Features', url: '#' }, { label: 'Pricing', url: '#' }, { label: 'Documentation', url: '#' }] },
      { title: 'Company', links: [{ label: 'About', url: '#' }, { label: 'Blog', url: '#' }, { label: 'Careers', url: '#' }] },
      { title: 'Support', links: [{ label: 'Help Center', url: '#' }, { label: 'Contact', url: '#' }, { label: 'Status', url: '#' }] }
    ];
  }
}
