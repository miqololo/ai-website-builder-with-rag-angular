import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PButtonComponent } from '@brandomize/primitives/p-button/p-button.component';
import { PIconComponent } from '@brandomize/primitives/p-icon/p-icon.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import type { HeaderConfigData, HeaderNavLink } from './header.types';

@Component({
  selector: 'bkit-header-transparent-pb',
  standalone: true,
  imports: [CommonModule, PButtonComponent, PIconComponent],
  template: `
    <header [class]="getHeaderClasses()" data-theme-header>
      <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <a [href]="getBrandLink()" class="flex shrink-0 items-center gap-2">
          @if (getLogo()) {
            <img [src]="getLogo()" [alt]="getBrand()" class="h-8 w-auto" />
          }
          @if (getBrand()) {
            <span [class]="getBrandClasses()">{{ getBrand() }}</span>
          }
        </a>

        <div class="hidden items-center gap-8 lg:flex">
          @for (link of getLinks(); track link.label) {
            <a [href]="link.url || '#'" [attr.target]="link.target" [class]="getNavLinkClasses()">
              @if (link.icon) {
                <bkit-icon [config]="{ name: link.icon, size: 18, color: 'muted' }"></bkit-icon>
              }
              <span>{{ link.label }}</span>
            </a>
          }
        </div>

        <div class="flex shrink-0 items-center gap-3">
          @if (hasSearchBar()) {
            <button type="button" [class]="getSearchButtonClasses()" aria-label="Search">
              <bkit-icon [config]="{ name: 'search', size: 20, color: 'muted' }"></bkit-icon>
            </button>
          }
          @for (action of getActions(); track action.label) {
            <bkit-button
              [config]="{
                href: action.href || '#',
                variant: action.variant || 'primary',
                size: theme.getHeaderActionSize(),
                text: action.label,
                ariaLabel: action.ariaLabel || action.label
              }"
            ></bkit-button>
          }
          <button type="button" [class]="getMobileMenuButtonClasses()" (click)="mobileOpen.set(true)" aria-label="Open menu" class="lg:hidden">
            <bkit-icon [config]="{ name: 'menu', size: 24, color: 'muted' }"></bkit-icon>
          </button>
        </div>
      </nav>

      @if (mobileOpen()) {
        <div [class]="getOverlayClasses()" (click)="mobileOpen.set(false)" role="button" tabindex="-1" aria-label="Close menu"></div>
        <aside [class]="getDrawerClasses()" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div class="flex h-14 items-center justify-between border-b px-4" [ngClass]="getDrawerHeaderClasses()">
            <span class="font-semibold">{{ getBrand() }}</span>
            <button type="button" (click)="mobileOpen.set(false)" [class]="getCloseButtonClasses()" aria-label="Close menu">
              <bkit-icon [config]="{ name: 'x', size: 24 }"></bkit-icon>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            @for (link of getLinks(); track link.label) {
              <a [href]="link.url || '#'" [class]="getMobileLinkClasses()" (click)="mobileOpen.set(false)">
                @if (link.icon) {
                  <bkit-icon [config]="{ name: link.icon, size: 20, color: 'muted' }"></bkit-icon>
                }
                <span>{{ link.label }}</span>
              </a>
            }
            @for (action of getActions(); track action.label) {
              <a [href]="action.href || '#'" [class]="getMobileActionClasses()" (click)="mobileOpen.set(false)">
                {{ action.label }}
              </a>
            }
          </div>
        </aside>
      }
    </header>
  `,
  styles: [`
    .mobile-drawer { transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
    .mobile-drawer.open { transform: translateX(0); }
    .mobile-overlay { opacity: 0; transition: opacity 0.3s ease; }
    .mobile-overlay.visible { opacity: 1; }
  `]
})
export class HeaderTransparentPbComponent {
  @Input() config?: ComponentConfig;
  mobileOpen = signal(false);

  constructor(public theme: ThemeService) {}

  private getData(): HeaderConfigData {
    return (this.config?.data ?? {}) as HeaderConfigData;
  }

  getBrand(): string {
    return this.getData().brand ?? 'Brand';
  }

  getBrandLink(): string {
    return this.getData().brandLink ?? '/';
  }

  getLogo(): string {
    return this.getData().logo ?? '';
  }

  isSticky(): boolean {
    return this.getData().sticky ?? true;
  }

  hasSearchBar(): boolean {
    return this.getData().searchBar ?? false;
  }

  getLinks(): HeaderNavLink[] {
    return this.getData().links ?? [
      { label: 'Features', url: '#features', icon: 'sparkles' },
      { label: 'Pricing', url: '#pricing', icon: 'dollar-sign' },
      { label: 'About', url: '#about', icon: 'info' },
      { label: 'Contact', url: '#contact', icon: 'mail' }
    ];
  }

  getActions(): HeaderConfigData['actions'] {
    return this.getData().actions ?? [
      { label: 'Sign in', href: '#', variant: 'ghost' },
      { label: 'Sign up', href: '#', variant: 'primary' }
    ];
  }

  getHeaderClasses(): string {
    const brand = this.theme.getHeaderColor('brand');
    const base = `relative z-50 bg-transparent text-${brand} dark:text-white`;
    return this.isSticky() ? `${base} sticky top-0` : base;
  }

  getBrandClasses(): string {
    return 'text-lg font-bold';
  }

  getNavLinkClasses(): string {
    const navLink = this.theme.getHeaderColor('navLink');
    return `flex items-center justify-center gap-2 text-sm font-medium text-${navLink} transition-colors hover:text-white dark:text-gray-300 dark:hover:text-white`;
  }

  getSearchButtonClasses(): string {
    const navLink = this.theme.getHeaderColor('navLink');
    return `rounded-lg p-2 text-${navLink} transition-colors hover:bg-white/10 hover:text-white dark:hover:bg-white/10`;
  }

  getMobileMenuButtonClasses(): string {
    return 'rounded-lg p-2 transition-colors hover:bg-white/10';
  }

  getOverlayClasses(): string {
    return 'mobile-overlay visible fixed inset-0 z-[60] bg-black/40';
  }

  getDrawerClasses(): string {
    const border = this.theme.getHeaderColor('border');
    const borderDark = this.theme.getHeaderColor('borderMutedDark');
    return `mobile-drawer open fixed right-0 top-0 z-[70] flex h-full w-[min(320px,85vw)] flex-col border-l border-${border} bg-white shadow-2xl dark:border-${borderDark} dark:bg-gray-900`;
  }

  getDrawerHeaderClasses(): string {
    const border = this.theme.getHeaderColor('border');
    const borderDark = this.theme.getHeaderColor('borderMutedDark');
    const brand = this.theme.getHeaderColor('brand');
    return `border-${border} text-${brand} dark:border-${borderDark} dark:text-white`;
  }

  getCloseButtonClasses(): string {
    const surfaceMuted = this.theme.getHeaderColor('surfaceMuted');
    const surfaceMutedDark = this.theme.getHeaderColor('surfaceMutedDark');
    return `rounded-lg p-2 hover:bg-${surfaceMuted} dark:hover:bg-${surfaceMutedDark}`;
  }

  getMobileLinkClasses(): string {
    const navLinkHover = this.theme.getHeaderColor('navLinkHover');
    const surfaceMuted = this.theme.getHeaderColor('surfaceMuted');
    const surfaceMutedDark = this.theme.getHeaderColor('surfaceMutedDark');
    return `flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-${navLinkHover} hover:bg-${surfaceMuted} dark:text-white dark:hover:bg-${surfaceMutedDark}`;
  }

  getMobileActionClasses(): string {
    const primary = this.theme.getHeaderColor('primary');
    const primaryHover = this.theme.getHeaderColor('primaryHover');
    return `mt-4 block w-full rounded-lg bg-${primary} px-4 py-3 text-center font-semibold text-white hover:bg-${primaryHover}`;
  }
}
