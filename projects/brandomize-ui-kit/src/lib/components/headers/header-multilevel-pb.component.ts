import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PButtonComponent } from '@brandomize/primitives/p-button/p-button.component';
import { PIconComponent } from '@brandomize/primitives/p-icon/p-icon.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import type { HeaderConfigData, HeaderNavItem, HeaderNavLinkWithChildren } from './header.types';

function hasChildren(item: HeaderNavItem): item is HeaderNavLinkWithChildren {
  return !!(item as HeaderNavLinkWithChildren).children?.length;
}

@Component({
  selector: 'bkit-header-multilevel-pb',
  standalone: true,
  imports: [CommonModule, PButtonComponent, PIconComponent],
  template: `
    <header [class]="getHeaderClasses()" data-theme-header>
      <nav class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <a [href]="getBrandLink()" class="flex shrink-0 items-center gap-2">
          @if (getLogo()) {
            <img [src]="getLogo()" [alt]="getBrand()" class="h-8 w-auto" />
          }
          @if (getBrand()) {
            <span [class]="getBrandClasses()">{{ getBrand() }}</span>
          }
        </a>

        <div class="hidden items-center gap-1 lg:flex">
          @for (item of getLinks(); track item.label) {
            @if (hasChildren(item)) {
              <div class="group relative" (mouseenter)="hoveredLabel.set(item.label)" (mouseleave)="hoveredLabel.set(null)">
                <button
                  type="button"
                  [class]="getNavLinkClasses()"
                  [attr.aria-expanded]="hoveredLabel() === item.label"
                  [attr.aria-haspopup]="true"
                >
                  @if (item.icon) {
                    <bkit-icon [config]="{ name: item.icon, size: 18, color: 'muted' }"></bkit-icon>
                  }
                  <span>{{ item.label }}</span>
                  <bkit-icon [config]="{ name: 'chevron-down', size: 16, color: 'muted', class: ['shrink-0', 'transition-transform', 'group-hover:rotate-180'] }"></bkit-icon>
                </button>
                @if (hoveredLabel() === item.label) {
                  <div [class]="getDropdownClasses()" (mouseenter)="hoveredLabel.set(item.label)" (mouseleave)="hoveredLabel.set(null)">
                    @for (child of item.children; track child.label) {
                      @if (hasChildren(child)) {
                        <div class="group/sub space-y-1">
                          <a [href]="child.url || '#'" [class]="getDropdownLinkClasses()">{{ child.label }}</a>
                          <div class="ml-4 border-l-2 pl-4" [ngClass]="getNestedBorderClasses()">
                            @for (sub of child.children; track sub.label) {
                              <a [href]="sub.url || '#'" [class]="getDropdownLinkClasses()">{{ sub.label }}</a>
                            }
                          </div>
                        </div>
                      } @else {
                        <a [href]="child.url || '#'" [class]="getDropdownLinkClasses()">{{ child.label }}</a>
                      }
                    }
                  </div>
                }
              </div>
            } @else {
              <a [href]="item.url || '#'" [attr.target]="item.target" [class]="getNavLinkClasses()">
                @if (item.icon) {
                  <bkit-icon [config]="{ name: item.icon, size: 18, color: 'muted' }"></bkit-icon>
                }
                <span>{{ item.label }}</span>
              </a>
            }
          }
        </div>

        <div class="flex shrink-0 items-center gap-2">
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
            @for (item of getLinks(); track item.label) {
              @if (hasChildren(item)) {
                <div class="mb-2">
                  <button
                    type="button"
                    [class]="getMobileParentClasses()"
                    (click)="expandedMobileLabel.set(expandedMobileLabel() === item.label ? null : item.label); expandedMobileSubLabel.set(null)"
                    [attr.aria-expanded]="expandedMobileLabel() === item.label"
                  >
                    {{ item.label }}
                    <bkit-icon
                      [config]="{
                        name: 'chevron-down',
                        size: 18,
                        color: 'muted',
                        class: ['shrink-0', 'transition-transform', expandedMobileLabel() === item.label ? 'rotate-180' : '']
                      }"
                    ></bkit-icon>
                  </button>
                  @if (expandedMobileLabel() === item.label) {
                    <div class="ml-4 mt-1 space-y-1">
                      @for (child of item.children; track child.label) {
                        @if (hasChildren(child)) {
                          <div class="mb-2">
                            <button
                              type="button"
                              [class]="getMobileParentClasses()"
                              (click)="expandedMobileSubLabel.set(expandedMobileSubLabel() === child.label ? null : child.label)"
                            >
                              {{ child.label }}
                              <bkit-icon [config]="{ name: 'chevron-down', size: 16, color: 'muted' }"></bkit-icon>
                            </button>
                            @if (expandedMobileSubLabel() === child.label) {
                              <div class="ml-4 mt-1">
                                @for (sub of child.children; track sub.label) {
                                  <a [href]="sub.url || '#'" [class]="getMobileLinkClasses()" (click)="mobileOpen.set(false)">{{ sub.label }}</a>
                                }
                              </div>
                            }
                          </div>
                        } @else {
                          <a [href]="child.url || '#'" [class]="getMobileLinkClasses()" (click)="mobileOpen.set(false)">{{ child.label }}</a>
                        }
                      }
                    </div>
                  }
                </div>
              } @else {
                <a [href]="item.url || '#'" [class]="getMobileLinkClasses()" (click)="mobileOpen.set(false)">{{ item.label }}</a>
              }
            }
            @for (action of getActions(); track action.label) {
              <a [href]="action.href || '#'" [class]="getMobileActionClasses()" (click)="mobileOpen.set(false)">{{ action.label }}</a>
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
export class HeaderMultilevelPbComponent {
  @Input() config?: ComponentConfig;
  mobileOpen = signal(false);
  hoveredLabel = signal<string | null>(null);
  expandedMobileLabel = signal<string | null>(null);
  expandedMobileSubLabel = signal<string | null>(null);

  constructor(public theme: ThemeService) {}

  hasChildren = hasChildren;

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

  private _defaultLinks: HeaderNavItem[] | null = null;

  getLinks(): HeaderNavItem[] {
    const data = this.getData().links;
    if (data?.length) return data;
    if (!this._defaultLinks) {
      this._defaultLinks = [
        { label: 'Products', icon: 'box', children: [
          { label: 'Overview', url: '#' },
          { label: 'Pricing', url: '#', children: [{ label: 'Monthly', url: '#' }, { label: 'Annual', url: '#' }] }
        ]},
        { label: 'Resources', icon: 'book-open', children: [
          { label: 'Docs', url: '#' },
          { label: 'Blog', url: '#' }
        ]},
        { label: 'Company', url: '#about' },
        { label: 'Contact', url: '#contact' }
      ];
    }
    return this._defaultLinks;
  }

  getActions(): HeaderConfigData['actions'] {
    return this.getData().actions ?? [
      { label: 'Sign in', href: '#', variant: 'ghost' },
      { label: 'Sign up', href: '#', variant: 'primary' }
    ];
  }

  getHeaderClasses(): string {
    const border = this.theme.getHeaderColor('border');
    const borderDark = this.theme.getHeaderColor('borderMutedDark');
    const base = `relative z-50 border-b border-${border} bg-white/95 backdrop-blur dark:border-${borderDark} dark:bg-gray-900/95`;
    return this.isSticky() ? `${base} sticky top-0` : base;
  }

  getBrandClasses(): string {
    const brand = this.theme.getHeaderColor('brand');
    return `text-lg font-bold text-${brand} dark:text-white`;
  }

  getNavLinkClasses(): string {
    const navLink = this.theme.getHeaderColor('navLink');
    const navLinkHover = this.theme.getHeaderColor('navLinkHover');
    const surfaceMuted = this.theme.getHeaderColor('surfaceMuted');
    const surfaceMutedDark = this.theme.getHeaderColor('surfaceMutedDark');
    return `flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-${navLink} transition-colors hover:bg-${surfaceMuted} hover:text-${navLinkHover} dark:hover:bg-${surfaceMutedDark} dark:hover:text-white`;
  }

  getDropdownClasses(): string {
    const border = this.theme.getHeaderColor('border');
    const borderDark = this.theme.getHeaderColor('borderMutedDark');
    return `absolute left-0 top-full z-50 mt-0 min-w-[200px] rounded-xl border border-${border} bg-white p-2 shadow-xl dark:border-${borderDark} dark:bg-gray-900`;
  }

  getDropdownLinkClasses(): string {
    const navLinkHover = this.theme.getHeaderColor('navLinkHover');
    const surfaceMuted = this.theme.getHeaderColor('surfaceMuted');
    const surfaceMutedDark = this.theme.getHeaderColor('surfaceMutedDark');
    return `block rounded-lg px-3 py-2 text-sm font-medium text-${navLinkHover} hover:bg-${surfaceMuted} dark:hover:bg-${surfaceMutedDark} dark:text-white`;
  }

  getNestedBorderClasses(): string {
    const border = this.theme.getHeaderColor('border');
    const borderDark = this.theme.getHeaderColor('borderMutedDark');
    return `border-${border} dark:border-${borderDark}`;
  }

  getSearchButtonClasses(): string {
    const surfaceMuted = this.theme.getHeaderColor('surfaceMuted');
    const surfaceMutedDark = this.theme.getHeaderColor('surfaceMutedDark');
    return `rounded-lg p-2 hover:bg-${surfaceMuted} dark:hover:bg-${surfaceMutedDark}`;
  }

  getMobileMenuButtonClasses(): string {
    const surfaceMuted = this.theme.getHeaderColor('surfaceMuted');
    const surfaceMutedDark = this.theme.getHeaderColor('surfaceMutedDark');
    return `rounded-lg p-2 hover:bg-${surfaceMuted} dark:hover:bg-${surfaceMutedDark}`;
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

  getMobileParentClasses(): string {
    const navLinkHover = this.theme.getHeaderColor('navLinkHover');
    const surfaceMuted = this.theme.getHeaderColor('surfaceMuted');
    const surfaceMutedDark = this.theme.getHeaderColor('surfaceMutedDark');
    return `flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-${navLinkHover} hover:bg-${surfaceMuted} dark:text-white dark:hover:bg-${surfaceMutedDark}`;
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
