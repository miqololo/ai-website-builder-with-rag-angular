import { Component, Input, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PButtonComponent } from '@brandomize/primitives/p-button/p-button.component';
import { PIconComponent } from '@brandomize/primitives/p-icon/p-icon.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import type { HeaderConfigData, HeaderMegamenuCategory } from './header.types';

@Component({
  selector: 'bkit-header-megamenu-pb',
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

        <div class="hidden flex-1 items-center justify-center lg:flex">
          @for (cat of getCategories(); track cat.label) {
            <div class="group relative" (mouseenter)="onCategoryEnter(cat.label)" (mouseleave)="onCategoryLeave()">
              <button
                type="button"
                [class]="getCategoryButtonClasses()"
                [attr.aria-expanded]="hoveredCategoryLabel() === cat.label"
                [attr.aria-haspopup]="true"
              >
                @if (cat.icon) {
                  <bkit-icon [config]="{ name: cat.icon, size: 18, color: 'muted' }"></bkit-icon>
                }
                <span>{{ cat.label }}</span>
                <bkit-icon [config]="{ name: 'chevron-down', size: 16, color: 'muted', class: ['shrink-0', 'transition-transform', 'group-hover:rotate-180'] }"></bkit-icon>
              </button>
              @if (hoveredCategoryLabel() === cat.label) {
                <div [class]="getMegaPanelClasses()" (mouseenter)="onPanelEnter(cat.label)" (mouseleave)="onPanelLeave()">
                  <div class="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 sm:px-6 sm:grid-cols-3 lg:px-8 lg:grid-cols-4">
                    @for (item of cat.items; track item.label) {
                      @if (item.items?.length) {
                        <div class="space-y-3">
                          <div [class]="getMegaSubcategoryLabelClasses()">{{ item.label }}</div>
                          @for (sub of item.items; track sub.url ?? sub.label) {
                            <a [href]="sub.url ?? '#'" [class]="getMegaItemClasses()" (click)="hoveredCategoryLabel.set(null)">
                              @if (sub.icon) {
                                <bkit-icon [config]="{ name: sub.icon, size: 20, color: 'primary' }"></bkit-icon>
                              }
                              <div class="min-w-0">
                                <span class="font-medium">{{ sub.label }}</span>
                                @if (sub.description) {
                                  <p class="mt-0.5 text-sm opacity-80">{{ sub.description }}</p>
                                }
                              </div>
                            </a>
                          }
                        </div>
                      } @else {
                        <a [href]="item.url ?? '#'" [class]="getMegaItemClasses()" (click)="hoveredCategoryLabel.set(null)">
                          @if (item.icon) {
                            <bkit-icon [config]="{ name: item.icon, size: 20, color: 'primary' }"></bkit-icon>
                          }
                          <div class="min-w-0">
                            <span class="font-medium">{{ item.label }}</span>
                            @if (item.description) {
                              <p class="mt-0.5 text-sm opacity-80">{{ item.description }}</p>
                            }
                          </div>
                        </a>
                      }
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <div class="flex shrink-0 items-center gap-2">
          @if (hasSearchBar()) {
            <div class="hidden w-64 sm:block">
              <div [class]="getSearchWrapperClasses()">
                <bkit-icon [config]="{ name: 'search', size: 18, color: 'muted' }"></bkit-icon>
                <input
                  type="search"
                  [placeholder]="getSearchPlaceholder()"
                  [class]="getSearchInputClasses()"
                  aria-label="Search"
                />
              </div>
            </div>
          }
          @for (action of getActions(); track action.label) {
            <bkit-button
              [config]="{
                href: action.href || '#',
                variant: action.variant || 'primary',
                size: theme.getHeaderActionSize(),
                text: action.label,
                ariaLabel: action.ariaLabel || action.label,
                class: action.icon ? ['gap-1.5'] : []
              }"
            >
              @if (action.icon) {
                <bkit-icon [config]="{ name: action.icon, size: 16 }"></bkit-icon>
              }
            </bkit-button>
          }
          <button
            type="button"
            [class]="getMobileMenuButtonClasses()"
            (click)="mobileOpen.set(true)"
            aria-label="Open menu"
            class="lg:hidden"
          >
            <bkit-icon [config]="{ name: 'menu', size: 24, color: 'muted' }"></bkit-icon>
          </button>
        </div>
      </nav>

      <!-- Mobile drawer (right-side, native-like) -->
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
            @if (hasSearchBar()) {
              <div class="mb-4">
                <div [class]="getSearchWrapperClasses()">
                  <bkit-icon [config]="{ name: 'search', size: 18, color: 'muted' }"></bkit-icon>
                  <input type="search" [placeholder]="getSearchPlaceholder()" [class]="getSearchInputClasses()" aria-label="Search" />
                </div>
              </div>
            }
            @for (cat of getCategories(); track cat.label) {
              <div class="mb-4">
                <div [class]="getMobileCategoryLabelClasses()">
                  @if (cat.icon) {
                    <bkit-icon [config]="{ name: cat.icon, size: 18, color: 'muted' }"></bkit-icon>
                  }
                  {{ cat.label }}
                </div>
                <div class="mt-2 space-y-1">
                  @for (item of cat.items; track item.label) {
                    @if (item.items?.length) {
                      <div class="mt-3 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
                        <div [class]="getMobileSubcategoryLabelClasses()">{{ item.label }}</div>
                        <div class="mt-2 space-y-1">
                          @for (sub of item.items; track sub.url ?? sub.label) {
                            <a [href]="sub.url ?? '#'" [class]="getMobileLinkClasses()" (click)="mobileOpen.set(false)">
                              @if (sub.icon) {
                                <bkit-icon [config]="{ name: sub.icon, size: 18, color: 'muted' }"></bkit-icon>
                              }
                              {{ sub.label }}
                            </a>
                          }
                        </div>
                      </div>
                    } @else {
                      <a [href]="item.url ?? '#'" [class]="getMobileLinkClasses()" (click)="mobileOpen.set(false)">
                        @if (item.icon) {
                          <bkit-icon [config]="{ name: item.icon, size: 18, color: 'muted' }"></bkit-icon>
                        }
                        {{ item.label }}
                      </a>
                    }
                  }
                </div>
              </div>
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
    .mobile-drawer {
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .mobile-drawer.open {
      transform: translateX(0);
    }
    .mobile-overlay {
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .mobile-overlay.visible {
      opacity: 1;
    }
  `]
})
export class HeaderMegamenuPbComponent implements OnDestroy {
  @Input() config?: ComponentConfig;
  mobileOpen = signal(false);
  hoveredCategoryLabel = signal<string | null>(null);
  private closeTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(public theme: ThemeService) {}

  ngOnDestroy(): void {
    if (this.closeTimeout) clearTimeout(this.closeTimeout);
  }

  onCategoryEnter(label: string): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
    this.hoveredCategoryLabel.set(label);
  }

  onCategoryLeave(): void {
    this.closeTimeout = setTimeout(() => {
      this.hoveredCategoryLabel.set(null);
      this.closeTimeout = null;
    }, 150);
  }

  onPanelEnter(label: string): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
    this.hoveredCategoryLabel.set(label);
  }

  onPanelLeave(): void {
    this.hoveredCategoryLabel.set(null);
  }

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

  getSearchPlaceholder(): string {
    return this.getData().searchPlaceholder ?? 'Search...';
  }

  private _defaultCategories: HeaderMegamenuCategory[] | null = null;

  getCategories(): HeaderMegamenuCategory[] {
    const data = this.getData().megamenuCategories;
    if (data?.length) return data;
    if (!this._defaultCategories) {
      this._defaultCategories = [
        {
          label: 'Products',
          icon: 'box',
          items: [
            {
              label: 'Getting started',
              items: [
                { label: 'Overview', url: '#', icon: 'layout-grid', description: 'See all features' },
                { label: 'Quick start', url: '#', icon: 'zap', description: 'Get up and running' }
              ]
            },
            {
              label: 'Billing',
              items: [
                { label: 'Pricing', url: '#', icon: 'dollar-sign', description: 'Plans & pricing' },
                { label: 'Enterprise', url: '#', icon: 'layers', description: 'For large teams' }
              ]
            },
            { label: 'Features', url: '#features', icon: 'sparkles', description: 'Explore capabilities' }
          ]
        },
        {
          label: 'Resources',
          icon: 'book-open',
          items: [
            {
              label: 'Learn',
              items: [
                { label: 'Docs', url: '#', icon: 'file-text', description: 'Documentation' },
                { label: 'Blog', url: '#', icon: 'newspaper', description: 'Latest updates' }
              ]
            },
            { label: 'Support', url: '#support', icon: 'help-circle', description: 'Get help' }
          ]
        }
      ];
    }
    return this._defaultCategories;
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

  getCategoryButtonClasses(): string {
    const navLink = this.theme.getHeaderColor('navLink');
    const navLinkHover = this.theme.getHeaderColor('navLinkHover');
    return `flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-${navLink} transition-colors hover:bg-black/5 hover:text-${navLinkHover} dark:hover:bg-white/5 dark:hover:text-white`;
  }

  getMegaPanelClasses(): string {
    const border = this.theme.getHeaderColor('border');
    const borderDark = this.theme.getHeaderColor('borderMutedDark');
    return `fixed inset-x-0 top-14 z-40 mt-0 rounded-b-xl border-b border-${border} bg-white shadow-xl dark:border-${borderDark} dark:bg-gray-900`;
  }

  getMegaSubcategoryLabelClasses(): string {
    const navLink = this.theme.getHeaderColor('navLink');
    return `text-xs font-semibold uppercase tracking-wider text-${navLink} dark:text-gray-400`;
  }

  getMegaItemClasses(): string {
    const text = this.theme.getHeaderColor('navLinkHover');
    const surfaceMuted = this.theme.getHeaderColor('surfaceMuted');
    const surfaceMutedDark = this.theme.getHeaderColor('surfaceMutedDark');
    return `flex items-center gap-3 rounded-lg p-3 text-${text} transition-colors hover:bg-${surfaceMuted} dark:hover:bg-${surfaceMutedDark}`;
  }

  getSearchWrapperClasses(): string {
    const t = this.theme.themeResolved();
    const borderMuted = t.colors?.borderMuted ?? 'gray-300';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-600';
    const surfaceMutedDark = this.theme.getHeaderColor('surfaceMutedDark');
    return `flex items-center gap-2 rounded-lg border border-${borderMuted} bg-white px-3 py-2 dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark}`;
  }

  getSearchInputClasses(): string {
    const text = this.theme.getHeaderColor('navLinkHover');
    const textMuted = this.theme.getHeaderColor('navLinkMuted');
    return `flex-1 min-w-0 border-0 bg-transparent text-sm text-${text} placeholder-${textMuted} focus:outline-none focus:ring-0 dark:text-white`;
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
    const text = this.theme.getHeaderColor('brand');
    return `border-${border} text-${text} dark:border-${borderDark} dark:text-white`;
  }

  getCloseButtonClasses(): string {
    const surfaceMuted = this.theme.getHeaderColor('surfaceMuted');
    const surfaceMutedDark = this.theme.getHeaderColor('surfaceMutedDark');
    return `rounded-lg p-2 hover:bg-${surfaceMuted} dark:hover:bg-${surfaceMutedDark}`;
  }

  getMobileSubcategoryLabelClasses(): string {
    const navLink = this.theme.getHeaderColor('navLink');
    return `text-xs font-semibold uppercase tracking-wider text-${navLink} dark:text-gray-400`;
  }

  getMobileCategoryLabelClasses(): string {
    const navLink = this.theme.getHeaderColor('navLink');
    return `flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-${navLink} dark:text-gray-400`;
  }

  getMobileLinkClasses(): string {
    const text = this.theme.getHeaderColor('navLinkHover');
    const surfaceMuted = this.theme.getHeaderColor('surfaceMuted');
    const surfaceMutedDark = this.theme.getHeaderColor('surfaceMutedDark');
    return `flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-${text} hover:bg-${surfaceMuted} dark:text-white dark:hover:bg-${surfaceMutedDark}`;
  }

  getMobileActionClasses(): string {
    const primary = this.theme.getHeaderColor('primary');
    const primaryHover = this.theme.getHeaderColor('primaryHover');
    return `mt-4 block w-full rounded-lg bg-${primary} px-4 py-3 text-center font-semibold text-white hover:bg-${primaryHover}`;
  }
}
