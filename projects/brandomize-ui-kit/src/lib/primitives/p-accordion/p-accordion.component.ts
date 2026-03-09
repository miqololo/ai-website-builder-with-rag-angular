import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PAccordionItem {
  title: string;
  content?: string;
  expanded?: boolean;
  children?: unknown[];
}

export interface PAccordionConfig {
  items?: PAccordionItem[];
  allowMultiple?: boolean;
  variant?: 'default' | 'bordered' | 'minimal';
  class?: string[];
}

@Component({
  selector: 'bkit-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getAccordionClasses()">
      @for (item of getItems(); track $index) {
        <div [class]="getItemClasses()">
          <button
            type="button"
            [class]="getHeaderClasses()"
            (click)="toggle($index)"
            [attr.aria-expanded]="isExpanded($index)"
          >
            <span>{{ item.title }}</span>
            <span [class]="isExpanded($index) ? 'rotate-180' : ''" class="transition-transform">▼</span>
          </button>
          @if (isExpanded($index)) {
            <div [class]="getContentClasses()">
              @if (item.content) {
                <p [class]="getContentTextClasses()">{{ item.content }}</p>
              }
              <ng-content></ng-content>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class PAccordionComponent {
  @Input() config?: PAccordionConfig;
  @Input() items: PAccordionItem[] = [];
  @Input() allowMultiple = false;

  private expandedIndices = new Set<number>();

  constructor(public theme: ThemeService) {}

  getItems(): PAccordionItem[] {
    const items = this.config?.items ?? this.items ?? [];
    items.forEach((item, i) => {
      if (item.expanded && !this.expandedIndices.has(i)) {
        this.expandedIndices.add(i);
      }
    });
    return items;
  }

  isExpanded(index: number): boolean {
    return this.expandedIndices.has(index);
  }

  toggle(index: number): void {
    if (this.config?.allowMultiple ?? this.allowMultiple) {
      if (this.expandedIndices.has(index)) {
        this.expandedIndices.delete(index);
      } else {
        this.expandedIndices.add(index);
      }
    } else {
      if (this.expandedIndices.has(index)) {
        this.expandedIndices.clear();
      } else {
        this.expandedIndices.clear();
        this.expandedIndices.add(index);
      }
    }
  }

  getAccordionClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const border = colors.border ?? 'gray-200';
    const borderMutedDark = colors.borderMutedDark ?? 'gray-700';
    const variant = this.config?.variant ?? 'default';
    const base = `divide-y divide-${border} dark:divide-${borderMutedDark}`;
    const variantMap: Record<string, string> = {
      default: `border border-${border} dark:border-${borderMutedDark} rounded-lg overflow-hidden`,
      bordered: `border border-${border} dark:border-${borderMutedDark} rounded-lg`,
      minimal: ''
    };
    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} ${base} ${variantMap[variant]}`.trim();
  }

  getItemClasses(): string {
    return '';
  }

  getHeaderClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const primary = colors.primary ?? 'indigo-600';
    const text = colors.text ?? 'gray-900';
    const surfaceMuted = colors.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = colors.surfaceMutedDark ?? 'gray-800';
    return `w-full flex items-center justify-between px-4 py-3 text-left font-medium text-${text} dark:text-gray-100 hover:bg-${surfaceMuted} dark:hover:bg-${surfaceMutedDark} transition-colors focus:outline-none focus:ring-2 focus:ring-${primary}/20`;
  }

  getContentTextClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `text-${textMuted} dark:text-gray-400`;
  }

  getContentClasses(): string {
    return 'px-4 py-3 bg-gray-50/50 dark:bg-gray-900/50';
  }
}
