import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { RouterLink } from '@angular/router';import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-not-found-humorous-pb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div [class]="getContainerClasses()">
      <div class="mx-auto max-w-lg text-center">
        <span class="text-8xl" aria-hidden="true">🔍</span>
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
export class NotFoundHumorousPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Oops! Something went missing';
  }

  getDescription(): string {
    return (this.getData()['description'] as string) || "We've looked everywhere but this page seems to have wandered off. Maybe it's chasing butterflies?";
  }

  getHomeLabel(): string {
    return (this.getData()['homeLabel'] as string) || 'Take me home';
  }

  getHomeLink(): string {
    return (this.getData()['homeLink'] as string) || '/';
  }

  getContainerClasses(): string {
    const t = this.theme.themeResolved();
    const warningMuted = t.colors?.warningMuted ?? 'amber-50';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    return `flex min-h-screen flex-col items-center justify-center bg-${warningMuted} px-6 dark:bg-${surfaceDark}`;
  }

  getCodeClasses(): string {
    const t = this.theme.themeResolved();
    const warning = t.colors?.warning ?? 'amber-600';
    const warningBase = warning.split('-')[0];
    return `mt-4 text-6xl font-bold text-${warning} dark:text-${warningBase}-500`;
  }

  getTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `mt-4 text-2xl font-bold text-${text} dark:text-white`;
  }

  getDescClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-3 text-${textMuted} dark:text-gray-300`;
  }

  getButtonClasses(): string {
    const t = this.theme.themeResolved();
    const warning = t.colors?.warning ?? 'amber-600';
    const warningBase = warning.split('-')[0];
    return `mt-8 inline-flex rounded-full bg-${warningBase}-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-${warningBase}-600 dark:bg-${warningBase}-600 dark:hover:bg-${warningBase}-700`;
  }
}
