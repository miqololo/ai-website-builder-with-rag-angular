import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PBreadcrumbItem {
  label: string;
  href?: string;
}

export interface PBreadcrumbConfig {
  items?: PBreadcrumbItem[];
  separator?: string;
  class?: string[];
}

@Component({
  selector: 'bkit-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav aria-label="Breadcrumb" [class]="getNavClasses()">
      <ol class="flex items-center gap-2 flex-wrap">
        @for (item of getItems(); track $index; let last = $last) {
          <li class="flex items-center gap-2">
            @if (item.href && !last) {
              <a [href]="item.href" [class]="getLinkClasses()">{{ item.label }}</a>
            } @else {
              <span [class]="getCurrentClasses(last)">{{ item.label }}</span>
            }
            @if (!last) {
              <span [class]="getSeparatorClasses()">{{ getSeparator() }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: []
})
export class PBreadcrumbComponent {
  @Input() config?: PBreadcrumbConfig;
  @Input() items: PBreadcrumbItem[] = [];
  @Input() separator = '/';

  constructor(public theme: ThemeService) {}

  getItems(): PBreadcrumbItem[] {
    return this.config?.items ?? this.items ?? [];
  }

  getSeparator(): string {
    return this.config?.separator ?? this.separator ?? '/';
  }

  getNavClasses(): string {
    return (this.config?.class ?? []).join(' ');
  }

  getLinkClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    return `text-${primary} hover:text-${primary}/80 transition-colors`;
  }

  getCurrentClasses(isLast: boolean): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const text = colors.text ?? 'gray-900';
    const textMutedLight = colors.textMutedLight ?? 'gray-500';
    return isLast
      ? `font-medium text-${text} dark:text-gray-100`
      : `text-${textMutedLight} dark:text-gray-400`;
  }

  getSeparatorClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-400';
    return `text-sm text-${textMutedLight} dark:text-gray-500`;
  }
}
