import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { RouterLink } from '@angular/router';import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-not-found-minimal-pb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div [class]="getContainerClasses()">
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
  `,
  styles: []
})
export class NotFoundMinimalPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Page not found';
  }

  getDescription(): string {
    return (this.getData()['description'] as string) || 'The page you are looking for does not exist.';
  }

  getHomeLabel(): string {
    return (this.getData()['homeLabel'] as string) || 'Go home';
  }

  getHomeLink(): string {
    return (this.getData()['homeLink'] as string) || '/';
  }

  getContainerClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    return `flex min-h-screen flex-col items-center justify-center bg-white px-6 dark:bg-${surfaceDark}`;
  }

  getCodeClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `text-6xl font-bold text-${border} dark:text-${borderMutedDark}`;
  }

  getTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `mt-4 text-xl font-semibold text-${text} dark:text-white`;
  }

  getDescClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-center text-${textMuted} dark:text-gray-300`;
  }

  getButtonClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const text = t.colors?.text ?? 'gray-900';
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-100';
    return `mt-8 inline-flex rounded-md bg-${surfaceDark} px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-${surfaceMutedDark} dark:bg-${surfaceMuted} dark:text-${text} dark:hover:bg-gray-200`;
  }
}
