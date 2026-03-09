import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { RouterLink } from '@angular/router';import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-not-found-centered-pb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div [class]="getContainerClasses()">
      <div class="text-center">
        <h1 [class]="getCodeClasses()">404</h1>
        <h2 [class]="getTitleClasses()">
          {{ getTitle() }}
        </h2>
        <p [class]="getDescClasses()">
          {{ getDescription() }}
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            [routerLink]="getHomeLink()"
            [class]="getPrimaryButtonClasses()"
          >
            {{ getHomeLabel() }}
          </a>
          <button
            type="button"
            (click)="goBack()"
            [class]="getSecondaryButtonClasses()"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class NotFoundCenteredPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Page not found';
  }

  getDescription(): string {
    return (this.getData()['description'] as string) || "Sorry, we couldn't find the page you're looking for.";
  }

  getHomeLabel(): string {
    return (this.getData()['homeLabel'] as string) || 'Go home';
  }

  getHomeLink(): string {
    return (this.getData()['homeLink'] as string) || '/';
  }

  goBack(): void {
    window.history.back();
  }

  getContainerClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceBase = surfaceMuted.split('-')[0];
    return `flex min-h-screen flex-col items-center justify-center bg-${surfaceMuted} px-6 dark:bg-${surfaceBase}-950`;
  }

  getCodeClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-9xl font-bold tracking-tighter text-${primary} dark:text-${primaryBase}-500`;
  }

  getTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `mt-4 text-2xl font-semibold text-${text} dark:text-white`;
  }

  getDescClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mx-auto mt-3 max-w-md text-${textMuted} dark:text-gray-300`;
  }

  getPrimaryButtonClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryHover = t.colors?.primaryHover ?? 'indigo-500';
    return `inline-flex w-full justify-center rounded-md bg-${primary} px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-${primaryHover} sm:w-auto`;
  }

  getSecondaryButtonClasses(): string {
    const t = this.theme.themeResolved();
    const borderMuted = t.colors?.borderMuted ?? 'gray-300';
    const text = t.colors?.text ?? 'gray-900';
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-600';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `inline-flex w-full justify-center rounded-md border border-${borderMuted} bg-white px-6 py-3 text-sm font-semibold text-${text} transition-colors hover:bg-${surfaceMuted} dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark} dark:text-white dark:hover:bg-gray-700 sm:w-auto`;
  }
}
