import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-footer-with-newsletter-pb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer [class]="getFooterClasses()">
      <div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div class="lg:grid lg:grid-cols-3 lg:gap-12">
          <div class="lg:col-span-2">
            <div class="flex flex-col gap-8 md:flex-row md:justify-between">
              <div>
                @if (getBrand()) {
                  <a [href]="getBrandLink()" [class]="getBrandClasses()">
                    {{ getBrand() }}
                  </a>
                }
                @if (getDescription()) {
                  <p [class]="getDescriptionClasses()">{{ getDescription() }}</p>
                }
              </div>
              @if (getLinkGroups().length) {
                <div class="flex gap-12">
                  @for (group of getLinkGroups(); track group.title || $index) {
                    <div>
                      <h3 [class]="getGroupTitleClasses()">
                        {{ group.title }}
                      </h3>
                      <ul class="mt-4 space-y-2">
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
              }
            </div>
          </div>
          <div class="mt-12 lg:mt-0">
            <h3 [class]="getGroupTitleClasses()">
              {{ getNewsletterTitle() }}
            </h3>
            <p [class]="getNewsletterDescriptionClasses()">Get the latest news and updates.</p>
            <form class="mt-4 flex gap-3" (submit)="$event.preventDefault()">
              <input
                type="email"
                [placeholder]="getNewsletterPlaceholder()"
                [class]="getInputClasses()"
              />
              <button
                type="submit"
                [class]="getButtonClasses()"
              >
                {{ getNewsletterButtonText() }}
              </button>
            </form>
          </div>
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
export class FooterWithNewsletterPbComponent {
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

  getNewsletterTitle(): string {
    return (this.getData()['newsletterTitle'] as string) || 'Subscribe to our newsletter';
  }

  getNewsletterPlaceholder(): string {
    return (this.getData()['newsletterPlaceholder'] as string) || 'Enter your email';
  }

  getNewsletterButtonText(): string {
    return (this.getData()['newsletterButtonText'] as string) || 'Subscribe';
  }

  getFooterClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-800';
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    return `border-t border-${border} bg-${surfaceMuted} dark:border-${borderMutedDark} dark:bg-${surfaceDark}`;
  }

  getBrandClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-2xl font-bold text-${text} dark:text-white`;
  }

  getDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-sm text-${textMuted} dark:text-gray-400`;
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

  getNewsletterDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-sm text-${textMuted} dark:text-gray-400`;
  }

  getInputClasses(): string {
    const t = this.theme.themeResolved();
    const borderMuted = t.colors?.borderMuted ?? 'gray-300';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-600';
    const surface = t.colors?.surface ?? 'white';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const text = t.colors?.text ?? 'gray-900';
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `min-w-0 flex-1 rounded-md border border-${borderMuted} bg-${surface} px-4 py-2 text-sm text-${text} placeholder-${textMutedLight} focus:border-${primary} focus:outline-none focus:ring-1 focus:ring-${primary} dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark} dark:text-white dark:placeholder-gray-400`;
  }

  getButtonClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryHover = t.colors?.primaryHover ?? 'indigo-500';
    const primaryBase = primary.split('-')[0];
    return `rounded-md bg-${primary} px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-${primaryHover} dark:bg-${primaryBase}-500 dark:hover:bg-${primaryBase}-400`;
  }

  getCopyrightWrapperClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `mt-12 border-t border-${border} pt-8 dark:border-${borderMutedDark}`;
  }

  getCopyrightClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `text-center text-sm text-${textMutedLight} dark:text-gray-400`;
  }

  getLinkGroups(): Array<{ title?: string; links: Array<{ label: string; url: string }> }> {
    return (this.getData()['linkGroups'] as Array<{ title?: string; links: Array<{ label: string; url: string }> }>) || [
      { title: 'Product', links: [{ label: 'Features', url: '#' }, { label: 'Pricing', url: '#' }] },
      { title: 'Company', links: [{ label: 'About', url: '#' }, { label: 'Blog', url: '#' }] }
    ];
  }
}
