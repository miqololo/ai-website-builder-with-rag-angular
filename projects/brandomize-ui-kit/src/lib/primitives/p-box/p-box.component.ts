import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PBoxConfig {
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'default' | 'muted' | 'white' | 'dark' | string;
  border?: boolean | 'default';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  overflow?: 'visible' | 'hidden' | 'auto' | 'scroll';
  class?: string[];
}

@Component({
  selector: 'bkit-box',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getBoxClasses()">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class PBoxComponent {
  @Input() config?: PBoxConfig;
  @Input() padding?: PBoxConfig['padding'];
  @Input() background?: PBoxConfig['background'];

  constructor(public theme: ThemeService) {}

  getBoxClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const pad = this.config?.padding ?? this.padding ?? 'md';
    const margin = this.config?.margin ?? 'none';
    const bg = this.config?.background ?? this.background ?? 'transparent';
    const border = this.config?.border ?? false;
    const radius = this.config?.borderRadius ?? 'md';
    const shadow = this.config?.shadow ?? 'none';
    const overflow = this.config?.overflow ?? 'visible';

    // Get classes from theme
    const padClass = this.theme.getPrimitiveClass(`box.padding.${pad}`, '');
    const marginClass = this.theme.getPrimitiveClass(`box.margin.${margin}`, '');
    const radiusClass = this.theme.getPrimitiveClass(`box.borderRadius.${radius}`, '');
    const shadowClass = this.theme.getPrimitiveClass(`box.shadow.${shadow}`, '');
    const overflowClass = this.theme.getPrimitiveClass(`box.overflow.${overflow}`, '');

    // Background class - check theme first, then fallback
    let bgClass = this.theme.getPrimitiveClass(`box.background.${bg}`, '');
    if (!bgClass && bg in ['transparent', 'default', 'muted', 'white', 'dark']) {
      const surfaceDark = colors.surfaceDark ?? 'gray-900';
      const bgMap: Record<string, string> = {
        transparent: 'bg-transparent',
        default: `bg-${colors.background ?? 'white'}`,
        muted: `bg-${colors.backgroundMuted ?? 'gray-50'} dark:bg-gray-950`,
        white: 'bg-white dark:bg-' + surfaceDark,
        dark: `bg-${surfaceDark} dark:bg-gray-950`
      };
      bgClass = bgMap[bg] ?? `bg-${bg}`;
    } else if (!bgClass) {
      bgClass = `bg-${bg}`;
    } else {
      // Resolve placeholders in bgClass using theme service
      bgClass = this.theme.resolveThemePlaceholders(bgClass);
    }

    // Border class
    const borderClass = border ? this.theme.getPrimitiveClass('box.border', '') : '';
    const resolvedBorderClass = borderClass 
      ? this.theme.resolveThemePlaceholders(borderClass)
      : (border ? `border border-${colors.border ?? 'gray-200'} dark:border-${colors.borderMutedDark ?? 'gray-700'}` : '');

    // Parent component classes come first (can override theme classes)
    const classes = [
      ...(this.config?.class ?? []),
      padClass,
      marginClass,
      bgClass,
      resolvedBorderClass,
      radiusClass,
      shadowClass,
      overflowClass
    ].filter(Boolean);

    return classes.join(' ');
  }
}
