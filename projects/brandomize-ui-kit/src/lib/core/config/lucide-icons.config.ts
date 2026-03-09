import { LucideAngularModule, icons } from 'lucide-angular';

/**
 * Icon aliases for common name variations used in JSON configs
 * Maps alternative kebab-case names to existing icon names in the icons object
 * The icons object from lucide-angular uses kebab-case keys
 * Note: bar-chart-2 maps to chart-no-axes-column in lucide-angular
 */
const ICON_ALIASES: Record<string, string> = {
  // Map common aliases to actual icon names
  'bar-chart-2': 'chart-no-axes-column', // bar-chart-2 is actually chart-no-axes-column
  'bar-chart': 'chart-no-axes-column', // Alias bar-chart to chart-no-axes-column
  'chart-bar': 'chart-no-axes-column',
  'check-circle': 'circle-check',
  'check-circle-big': 'circle-check-big',
  'component': 'box',
  'help-circle': 'circle-question-mark',
  'grid': 'layout-grid',
  'layout': 'layout-template',
};

/**
 * Creates icon provider with all icons plus aliases
 * The icons object already contains all icons with kebab-case keys
 */
function createIconProvider() {
  const iconMap: Record<string, any> = { ...icons };
  
  // Add aliases by referencing the actual icon from the icons object
  Object.keys(ICON_ALIASES).forEach((alias) => {
    const actualIconName = ICON_ALIASES[alias];
    if (iconMap[actualIconName]) {
      iconMap[alias] = iconMap[actualIconName];
    }
  });
  
  return LucideAngularModule.pick(iconMap);
}

/**
 * Provides all Lucide icons for brandomize-ui-kit
 * Includes all icons from lucide-angular plus common aliases
 * This ensures icons used by brandomize-ui-kit components are available
 * 
 * Import this provider in your app.config.ts:
 * ```typescript
 * import { lucideIconsProvider } from '@brandomize/core/config/lucide-icons.config';
 * import { importProvidersFrom } from '@angular/core';
 * 
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     importProvidersFrom(lucideIconsProvider)
 *   ]
 * };
 * ```
 */
export const lucideIconsProvider = createIconProvider();
