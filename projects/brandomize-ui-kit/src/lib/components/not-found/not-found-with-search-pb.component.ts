import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { RouterLink } from '@angular/router';import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-not-found-with-search-pb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div [class]="getContainerClasses()">
      <div class="mx-auto w-full max-w-xl">
        <div class="text-center">
          <p [class]="getCodeClasses()">404</p>
          <h1 [class]="getTitleClasses()">
            {{ getTitle() }}
          </h1>
          <p [class]="getDescClasses()">
            {{ getDescription() }}
          </p>
        </div>
        <form class="mt-10" (submit)="onSearch($event)">
          <div class="flex gap-2">
            <input
              type="text"
              [placeholder]="getSearchPlaceholder()"
              [class]="getInputClasses()"
              [value]="searchQuery()"
              (input)="searchQuery.set($any($event.target).value)"
              name="search"
            />
            <button
              type="submit"
              [class]="getSearchButtonClasses()"
            >
              {{ getSearchButtonText() }}
            </button>
          </div>
        </form>
        <p class="mt-6 text-center">
          <a
            [routerLink]="getHomeLink()"
            [class]="getHomeLinkClasses()"
          >
            {{ getHomeLabel() }} →
          </a>
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class NotFoundWithSearchPbComponent {
  @Input() config?: ComponentConfig;
  searchQuery = signal('');

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Page not found';
  }

  getDescription(): string {
    return (this.getData()['description'] as string) || 'Try searching for what you need, or head back home.';
  }

  getHomeLabel(): string {
    return (this.getData()['homeLabel'] as string) || 'Go home';
  }

  getHomeLink(): string {
    return (this.getData()['homeLink'] as string) || '/';
  }

  getSearchPlaceholder(): string {
    return (this.getData()['searchPlaceholder'] as string) || 'Search...';
  }

  getSearchButtonText(): string {
    return (this.getData()['searchButtonText'] as string) || 'Search';
  }

  onSearch(e: Event): void {
    e.preventDefault();
    const q = this.searchQuery().trim();
    if (q) {
      window.location.href = '/?q=' + encodeURIComponent(q);
    }
  }

  getContainerClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceBase = surfaceMuted.split('-')[0];
    return `flex min-h-screen flex-col items-center justify-center bg-${surfaceMuted} px-6 dark:bg-${surfaceBase}-950`;
  }

  getCodeClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `text-8xl font-bold text-${border} dark:text-${borderMutedDark}`;
  }

  getTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `mt-2 text-2xl font-semibold text-${text} dark:text-white`;
  }

  getDescClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-${textMuted} dark:text-gray-300`;
  }

  getInputClasses(): string {
    const t = this.theme.themeResolved();
    const borderMuted = t.colors?.borderMuted ?? 'gray-300';
    const text = t.colors?.text ?? 'gray-900';
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    const primary = t.colors?.primary ?? 'indigo-600';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-600';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `min-w-0 flex-1 rounded-lg border border-${borderMuted} bg-white px-4 py-3 text-${text} placeholder-${textMutedLight} focus:border-${primary} focus:outline-none focus:ring-2 focus:ring-${primary} dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark} dark:text-white dark:placeholder-gray-400`;
  }

  getSearchButtonClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryHover = t.colors?.primaryHover ?? 'indigo-500';
    return `rounded-lg bg-${primary} px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-${primaryHover}`;
  }

  getHomeLinkClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryHover = t.colors?.primaryHover ?? 'indigo-500';
    const primaryBase = primary.split('-')[0];
    return `text-sm font-medium text-${primary} hover:text-${primaryHover} dark:text-${primaryBase}-400 dark:hover:text-${primaryBase}-300`;
  }
}
