import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-header-minimal-pb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header [class]="getHeaderClasses()" data-theme-header>
      <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Main navigation">
        <div class="flex items-center">
          <a [href]="getBrandLink()" class="flex items-center gap-2">
            @if (getLogo()) {
              <img [src]="getLogo()" [alt]="getBrand()" class="h-8 w-auto" />
            }
            @if (getBrand()) {
              <span [class]="getBrandClasses()">{{ getBrand() }}</span>
            }
          </a>
        </div>
        <div class="hidden items-center gap-8 md:flex">
          @for (link of getLinks(); track link.url) {
            <a [href]="link.url" [attr.target]="link.target || '_self'" [class]="getNavLinkClasses()">
              {{ link.label }}
            </a>
          }
        </div>
        <button
          type="button"
          [class]="getMobileMenuButtonClasses()"
          (click)="mobileMenuOpen.set(!mobileMenuOpen())"
          [attr.aria-expanded]="mobileMenuOpen()"
          aria-label="Toggle menu"
        >
          @if (mobileMenuOpen()) {
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          } @else {
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          }
        </button>
      </nav>
      @if (mobileMenuOpen()) {
        <div [class]="getMobileMenuClasses()">
          <div class="space-y-1">
            @for (link of getLinks(); track link.url) {
              <a [href]="link.url" [attr.target]="link.target || '_self'" [class]="getMobileLinkClasses()" (click)="mobileMenuOpen.set(false)">
                {{ link.label }}
              </a>
            }
          </div>
        </div>
      }
    </header>
  `,
  styles: []
})
export class HeaderMinimalPbComponent {
  @Input() config?: ComponentConfig;
  mobileMenuOpen = signal(false);

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getBrand(): string {
    return (this.getData()['brand'] as string) || 'Brand';
  }

  getBrandLink(): string {
    return (this.getData()['brandLink'] as string) || '/';
  }

  getLogo(): string {
    return (this.getData()['logo'] as string) || '';
  }

  getHeaderClasses(): string {
    const border = this.theme.getHeaderColor('border');
    const borderDark = this.theme.getHeaderColor('borderMutedDark');
    return `sticky top-0 z-50 border-b border-${border} bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-${borderDark} dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80`;
  }

  getBrandClasses(): string {
    const brand = this.theme.getHeaderColor('brand');
    return `text-xl font-bold text-${brand} dark:text-white`;
  }

  getNavLinkClasses(): string {
    const navLink = this.theme.getHeaderColor('navLink');
    const navLinkHover = this.theme.getHeaderColor('navLinkHover');
    return `text-sm font-medium text-${navLink} transition-colors hover:text-${navLinkHover} dark:text-gray-300 dark:hover:text-white`;
  }

  getMobileMenuButtonClasses(): string {
    const navLink = this.theme.getHeaderColor('navLink');
    const navLinkHover = this.theme.getHeaderColor('navLinkHover');
    const surfaceMuted = this.theme.getHeaderColor('surfaceMuted');
    const surfaceMutedDark = this.theme.getHeaderColor('surfaceMutedDark');
    return `md:hidden rounded-md p-2 text-${navLink} hover:bg-${surfaceMuted} hover:text-${navLinkHover} dark:text-gray-300 dark:hover:bg-${surfaceMutedDark}`;
  }

  getMobileMenuClasses(): string {
    const border = this.theme.getHeaderColor('border');
    const borderDark = this.theme.getHeaderColor('borderMutedDark');
    return `border-t border-${border} bg-white px-6 py-4 dark:border-${borderDark} dark:bg-gray-900 md:hidden`;
  }

  getMobileLinkClasses(): string {
    const navLink = this.theme.getHeaderColor('navLink');
    const navLinkHover = this.theme.getHeaderColor('navLinkHover');
    const surfaceMuted = this.theme.getHeaderColor('surfaceMuted');
    const surfaceMutedDark = this.theme.getHeaderColor('surfaceMutedDark');
    return `block rounded-md px-3 py-2 text-base font-medium text-${navLink} hover:bg-${surfaceMuted} hover:text-${navLinkHover} dark:text-gray-300 dark:hover:bg-${surfaceMutedDark} dark:hover:text-white`;
  }

  getLinks(): Array<{ label: string; url: string; target?: string }> {
    return (this.getData()['links'] as Array<{ label: string; url: string; target?: string }>) || [
      { label: 'Features', url: '#features' },
      { label: 'Pricing', url: '#pricing' },
      { label: 'About', url: '#about' },
      { label: 'Contact', url: '#contact' }
    ];
  }
}
