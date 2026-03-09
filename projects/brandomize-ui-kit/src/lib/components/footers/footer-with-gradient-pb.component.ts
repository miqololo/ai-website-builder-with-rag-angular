import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-footer-with-gradient-pb',
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
export class FooterWithGradientPbComponent {
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
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `bg-gradient-to-br from-${surfaceDark} via-${surfaceDark} to-${primaryBase}-950 py-16`;
  }

  getBrandClasses(): string {
    return 'text-xl font-bold text-white';
  }

  getDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-400';
    return `mt-4 text-sm text-${textMutedLight}`;
  }

  getGroupTitleClasses(): string {
    return 'text-sm font-semibold uppercase tracking-wider text-white';
  }

  getLinkClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-400';
    return `text-sm text-${textMutedLight} transition-colors hover:text-white`;
  }

  getCopyrightWrapperClasses(): string {
    const t = this.theme.themeResolved();
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `mt-12 border-t border-${borderMutedDark}/50 pt-8`;
  }

  getCopyrightClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `text-center text-sm text-${textMutedLight}`;
  }

  getLinkGroups(): Array<{ title?: string; links: Array<{ label: string; url: string }> }> {
    return (this.getData()['linkGroups'] as Array<{ title?: string; links: Array<{ label: string; url: string }> }>) || [
      { title: 'Product', links: [{ label: 'Features', url: '#' }, { label: 'Pricing', url: '#' }, { label: 'Documentation', url: '#' }] },
      { title: 'Company', links: [{ label: 'About', url: '#' }, { label: 'Blog', url: '#' }, { label: 'Careers', url: '#' }] },
      { title: 'Support', links: [{ label: 'Help Center', url: '#' }, { label: 'Contact', url: '#' }] }
    ];
  }
}
