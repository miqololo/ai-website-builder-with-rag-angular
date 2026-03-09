import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { RouterLink } from '@angular/router';import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-not-found-with-illustration-pb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div [class]="getContainerClasses()">
      <div class="mx-auto max-w-md text-center">
        <div class="mx-auto flex h-48 w-48 items-center justify-center" aria-hidden="true">
          <svg [class]="getSvgClasses()" fill="none" viewBox="0 0 200 200" stroke="currentColor" stroke-width="1.5">
            <path d="M100 30c-38.66 0-70 31.34-70 70s31.34 70 70 70 70-31.34 70-70-31.34-70-70-70z" stroke-linecap="round"/>
            <path d="M100 50v50M100 110v10" stroke-linecap="round" stroke-width="2"/>
            <circle cx="100" cy="75" r="4" fill="currentColor"/>
          </svg>
        </div>
        <p [class]="getCodeClasses()">404</p>
        <h1 [class]="getTitleClasses()">
          {{ getTitle() }}
        </h1>
        <p [class]="getDescClasses()">
          {{ getDescription() }}
        </p>
        <a
          [routerLink]="getHomeLink()"
          [class]="getButtonClasses()"
        >
          {{ getHomeLabel() }}
        </a>
      </div>
    </div>
  `,
  styles: []
})
export class NotFoundWithIllustrationPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Page not found';
  }

  getDescription(): string {
    return (this.getData()['description'] as string) || 'Looks like this page took a wrong turn.';
  }

  getHomeLabel(): string {
    return (this.getData()['homeLabel'] as string) || 'Back to home';
  }

  getHomeLink(): string {
    return (this.getData()['homeLink'] as string) || '/';
  }

  getContainerClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    return `flex min-h-screen flex-col items-center justify-center bg-white px-6 dark:bg-${surfaceDark}`;
  }

  getSvgClasses(): string {
    const t = this.theme.themeResolved();
    const borderMuted = t.colors?.borderMuted ?? 'gray-300';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-600';
    return `h-full w-full text-${borderMuted} dark:text-${borderMutedDark}`;
  }

  getCodeClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `mt-6 text-7xl font-bold text-${text} dark:text-white`;
  }

  getTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `mt-2 text-xl font-semibold text-${text} dark:text-white`;
  }

  getDescClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-${textMuted} dark:text-gray-300`;
  }

  getButtonClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryHover = t.colors?.primaryHover ?? 'indigo-500';
    return `mt-8 inline-flex rounded-lg bg-${primary} px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-${primaryHover}`;
  }
}
