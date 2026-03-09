/**
 * Standalone utility functions for loading themes from URLs.
 * These functions can be used without directly injecting ThemeService.
 */

import { inject, Injector } from '@angular/core';
import { ThemeService } from './theme.service';
import { Observable } from 'rxjs';
import { GlobalThemeConfig } from './theme.config';

let themeServiceInstance: ThemeService | null = null;
let injectorInstance: Injector | null = null;

/**
 * Initialize the theme loader with an injector (optional).
 * Call this once in your app initialization if you want to use loadThemeFromUrl
 * outside of Angular's injection context.
 * 
 * @param injector Angular injector instance
 * 
 * @example
 * ```typescript
 * import { initializeThemeLoader } from '@brandomize/core/theme/theme-loader';
 * 
 * // In app initialization:
 * initializeThemeLoader(injector);
 * ```
 */
export function initializeThemeLoader(injector: Injector): void {
  injectorInstance = injector;
  themeServiceInstance = injector.get(ThemeService);
}

/**
 * Get ThemeService instance - tries inject() first, then falls back to stored instance
 */
function getThemeService(): ThemeService {
  // Try to use inject() if in injection context (Angular 14+)
  try {
    return inject(ThemeService);
  } catch {
    // Not in injection context, use stored instance
    if (themeServiceInstance) {
      return themeServiceInstance;
    }
    if (injectorInstance) {
      themeServiceInstance = injectorInstance.get(ThemeService);
      return themeServiceInstance;
    }
    throw new Error(
      'ThemeService not available. Either:\n' +
      '1. Call loadThemeFromUrl() from an Angular injection context (component/service constructor, ngOnInit, etc.), or\n' +
      '2. Call initializeThemeLoader(injector) once in your app initialization.'
    );
  }
}

/**
 * Load theme from a URL and apply it.
 * 
 * This is a standalone utility function that internally uses ThemeService.
 * The function automatically:
 * - Fetches the theme JSON from the provided URL
 * - Validates and applies the theme configuration
 * - Distributes theme styles, fonts, and CSS to the document
 * - Updates all components using the theme
 * 
 * @param themeUrl URL to the theme JSON file (e.g., '/assets/esports.theme.json')
 * @returns Observable that emits the loaded theme config when theme is loaded and applied
 * 
 * @example
 * ```typescript
 * import { loadThemeFromUrl } from '@brandomize/core/theme/theme-loader';
 * 
 * // In a component/service (injection context):
 * ngOnInit() {
 *   loadThemeFromUrl('/assets/esports.theme.json').subscribe({
 *     next: (theme) => console.log('Theme loaded:', theme),
 *     error: (error) => console.error('Failed to load theme:', error)
 *   });
 * }
 * 
 * // Or with initialization (for use outside injection context):
 * import { initializeThemeLoader, loadThemeFromUrl } from '@brandomize/core/theme/theme-loader';
 * initializeThemeLoader(injector);
 * loadThemeFromUrl('/assets/esports.theme.json').subscribe();
 * ```
 */
export function loadThemeFromUrl(themeUrl: string): Observable<GlobalThemeConfig> {
  const themeService = getThemeService();
  return themeService.loadThemeFromUrl(themeUrl);
}
