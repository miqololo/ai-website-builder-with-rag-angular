/**
 * Primitive-based components - built from reusable primitives with global theme support.
 * Use ThemeService.setTheme() to customize templates, cards, buttons, typography, etc.
 */

export { ThemeService } from '@brandomize/core/theme/theme.service';
export { loadThemeFromUrl, initializeThemeLoader } from '@brandomize/core/theme/theme-loader';
export type { GlobalThemeConfig, ThemeColors, ThemeCard, ThemeButton, ThemeTypography, ThemeRadius, ThemeShadow, ThemePrimitives } from '@brandomize/core/theme/theme.config';
export { DEFAULT_THEME } from '@brandomize/core/theme/theme.config';

export { PComponentRendererComponent } from '@brandomize/core/p-component-renderer/p-component-renderer.component';
export { ComponentRendererComponent } from '@brandomize/core/components/component-renderer/component-renderer.component';

export { lucideIconsProvider } from '@brandomize/core/config/lucide-icons.config';

export * from './primitives';
export * from './components';
