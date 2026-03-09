import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PTabsItem {
  id: string;
  label: string;
  content?: string;
  /** Child components rendered when tab is active */
  children?: unknown[];
}

export interface PTabsConfig {
  items?: PTabsItem[];
  variant?: 'default' | 'pills' | 'underline';
  class?: string[];
}

@Component({
  selector: 'bkit-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getTabsClasses()">
      <div [class]="getTabListClasses()">
        @for (item of getItems(); track item.id) {
          <button
            type="button"
            [class]="getTabButtonClasses(item.id)"
            (click)="activeTab.set(item.id)"
          >
            {{ item.label }}
          </button>
        }
      </div>
      <div [class]="getPanelClasses()">
        @for (item of getItems(); track item.id) {
          @if (activeTab() === item.id) {
            <div>
              @if (item.content) {
                <p [class]="getContentTextClasses()">{{ item.content }}</p>
              }
              <ng-content></ng-content>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: []
})
export class PTabsComponent {
  @Input() config?: PTabsConfig;
  @Input() items: PTabsItem[] = [];

  activeTab = signal<string>('');

  constructor(public theme: ThemeService) {}

  getItems(): PTabsItem[] {
    const items = this.config?.items ?? this.items ?? [];
    if (items.length > 0 && !this.activeTab()) {
      this.activeTab.set(items[0].id);
    }
    return items;
  }

  getTabsClasses(): string {
    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} w-full`.trim();
  }

  getTabListClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const border = colors.border ?? 'gray-200';
    const borderMutedDark = colors.borderMutedDark ?? 'gray-700';
    const surfaceMuted = colors.surfaceMuted ?? 'gray-100';
    const surfaceMutedDark = colors.surfaceMutedDark ?? 'gray-800';
    const variant = this.config?.variant ?? 'default';
    const variantMap: Record<string, string> = {
      default: `flex border-b border-${border} dark:border-${borderMutedDark} gap-1`,
      pills: `flex gap-2 p-1 bg-${surfaceMuted} dark:bg-${surfaceMutedDark} rounded-lg`,
      underline: `flex border-b border-${border} dark:border-${borderMutedDark}`
    };
    return variantMap[variant] ?? variantMap['default'];
  }

  getTabButtonClasses(id: string): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const primary = colors.primary ?? 'indigo-600';
    const textMutedLight = colors.textMutedLight ?? 'gray-500';
    const text = colors.text ?? 'gray-700';
    const isActive = this.activeTab() === id;
    const base = 'px-4 py-2 font-medium transition-colors focus:outline-none';

    const activeClasses = `text-${primary} border-b-2 border-${primary}`;
    const inactiveClasses = `text-${textMutedLight} hover:text-${text} dark:text-gray-400 dark:hover:text-gray-200`;

    return `${base} ${isActive ? activeClasses : inactiveClasses}`;
  }

  getContentTextClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `text-${textMuted} dark:text-gray-400`;
  }

  getPanelClasses(): string {
    return 'py-4';
  }
}
