import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { RouterLink } from '@angular/router';import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-not-found-with-gradient-pb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div [class]="getContainerClasses()">
      <div class="text-center">
        <p class="text-8xl font-bold text-white/20">404</p>
        <h1 class="-mt-4 text-3xl font-bold text-white">
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
export class NotFoundWithGradientPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Page not found';
  }

  getDescription(): string {
    return (this.getData()['description'] as string) || "The page you're looking for doesn't exist or has been moved.";
  }

  getHomeLabel(): string {
    return (this.getData()['homeLabel'] as string) || 'Return home';
  }

  getHomeLink(): string {
    return (this.getData()['homeLink'] as string) || '/';
  }

  getContainerClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    const surfaceBase = surfaceDark.split('-')[0];
    return `flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-${surfaceBase}-900 via-${primaryBase}-950 to-${surfaceBase}-900 px-6`;
  }

  getDescClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-4 max-w-md text-${primaryBase}-200`;
  }

  getButtonClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryMuted = t.colors?.primaryMuted ?? 'indigo-50';
    return `mt-10 inline-flex rounded-lg bg-white px-6 py-3 text-sm font-semibold text-${primary} shadow-lg transition-all hover:-translate-y-0.5 hover:bg-${primaryMuted}`;
  }
}
