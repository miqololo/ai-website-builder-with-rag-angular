import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '@brandomize/core/theme/theme.service';

/** Theme icon color keys – maps to theme.icon.colors */
export type IconColorKey = 'default' | 'primary' | 'muted' | 'success' | 'warning' | 'error';

/** Theme icon size keys – maps to theme.icon.sizes */
export type IconSizeKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface PIconConfig {
  /** Lucide icon name (kebab-case, e.g. circle-check, sparkles, check) */
  name?: string;
  /** Size in px, or theme preset: 'xs' | 'sm' | 'md' | 'lg' | 'xl' */
  size?: number | string | IconSizeKey;
  /** Color – theme key (primary, muted, default), Tailwind class (text-indigo-600), hex, or CSS variable */
  color?: string | IconColorKey;
  /** Stroke width (1–3 typical) */
  strokeWidth?: number;
  /** Additional CSS classes for styling */
  class?: string[];
}

/** Maps common aliases to Lucide icon names (kebab-case to kebab-case) */
const ICON_ALIASES: Record<string, string> = {
  'check-circle': 'circle-check',
  'check-circle-big': 'circle-check-big',
  'component': 'box', // Use Box icon as fallback for component
  'bar-chart': 'chart-bar', // Map bar-chart to chart-bar
  'align-center': 'text-align-center', // Lucide renamed AlignCenter to TextAlignCenter
  'help-circle': 'circle-question-mark', // Map deprecated help-circle to CircleQuestionMark
  'grid': 'layout-grid', // Map grid to layout-grid
  'layout': 'layout-template', // Map layout to layout-template
};

@Component({
  selector: 'bkit-icon',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <lucide-icon
      [name]="getLucideName()"
      [size]="getSize()"
      [color]="getColor()"
      [strokeWidth]="getStrokeWidth()"
      [class]="getIconClasses()"
    ></lucide-icon>
  `,
  styles: []
})
export class PIconComponent {
  @Input() config?: PIconConfig;
  @Input() name?: string;
  @Input() size?: number | string;
  @Input() color?: string;

  constructor(public theme: ThemeService) {}

  getLucideName(): string {
    const raw = this.config?.name ?? this.name ?? 'circle';
    return ICON_ALIASES[raw] ?? raw;
  }

  getSize(): number {
    const s = this.config?.size ?? this.size;
    if (s === undefined) {
      const t = this.theme.themeResolved();
      return t.icon?.sizes?.md ?? 24;
    }
    if (typeof s === 'number') return s;
    const sizeKey = s as IconSizeKey;
    if (['xs', 'sm', 'md', 'lg', 'xl'].includes(sizeKey)) {
      const t = this.theme.themeResolved();
      const px = t.icon?.sizes?.[sizeKey];
      return px ?? 24;
    }
    return parseInt(String(s), 10) || 24;
  }

  getColor(): string | undefined {
    const c = this.config?.color ?? this.color;
    if (c) {
      if (c.startsWith('#') || c.startsWith('rgb') || c.startsWith('var(') || c.startsWith('hsl')) {
        return c;
      }
      return undefined;
    }
    return undefined;
  }

  getStrokeWidth(): number {
    return this.config?.strokeWidth ?? (this.theme.themeResolved().icon?.strokeWidth as number) ?? 2;
  }

  getIconClasses(): string {
    const fromConfig = this.config?.class ?? [];
    const base = Array.isArray(fromConfig) ? fromConfig.join(' ') : String(fromConfig);
    const c = this.config?.color ?? this.color;
    if (c && (c.startsWith('#') || c.startsWith('rgb') || c.startsWith('var(') || c.startsWith('hsl'))) {
      return base;
    }
    if (c) {
      const colorKey = c as IconColorKey;
      if (['default', 'primary', 'muted', 'success', 'warning', 'error'].includes(colorKey)) {
        const t = this.theme.themeResolved();
        const themeColor = t.icon?.[colorKey];
        if (themeColor) {
          return base ? `${base} ${themeColor}` : themeColor;
        }
      }
      return base ? `${base} ${c}` : c;
    }
    const t = this.theme.themeResolved();
    const themeColor = t.icon?.primary ?? (t.colors?.primary ? `text-${t.colors.primary}` : undefined);
    if (themeColor) {
      return base ? `${base} ${themeColor}` : themeColor;
    }
    return base;
  }
}
