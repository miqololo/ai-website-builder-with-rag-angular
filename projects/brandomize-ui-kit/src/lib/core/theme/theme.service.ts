import { Injectable, signal, computed, effect, inject, PLATFORM_ID, Injector } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GlobalThemeConfig, DEFAULT_THEME } from './theme.config';
import { generateThemeStyles } from './theme-style-generator';
import { ComponentConfig } from '../types/component-config.types';

/**
 * Global theme service for applying theme config across primitive-based components.
 * Inject this service to access and merge theme values.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSignal = signal<GlobalThemeConfig>(DEFAULT_THEME);
  private platformId = inject(PLATFORM_ID);
  private injector = inject(Injector);
  private http: HttpClient | null = null;

  theme = this.themeSignal.asReadonly();

  /** Merged theme (defaults + overrides) */
  themeResolved = computed(() => this.deepMerge(DEFAULT_THEME, this.themeSignal()));

  constructor() {
    effect(() => {
      this.themeResolved();
      this.applyThemeStyles();
    });
  }

  /**
   * Get HttpClient instance (lazy injection to avoid circular dependencies)
   */
  private getHttpClient(): HttpClient {
    if (!this.http) {
      this.http = this.injector.get(HttpClient);
    }
    return this.http!; // Non-null assertion since we just assigned it above
  }

  setTheme(config: Partial<GlobalThemeConfig>): void {
    this.themeSignal.update(current => this.deepMerge(current, config));
    this.applyThemeStyles();
  }

  /**
   * Load theme from a URL and apply it
   * @param themeUrl URL to the theme JSON file
   * @returns Observable that completes when theme is loaded and applied
   */
  loadThemeFromUrl(themeUrl: string): Observable<GlobalThemeConfig> {
    return this.getHttpClient().get<GlobalThemeConfig>(themeUrl).pipe(
      map((themeConfig) => {
        this.setTheme(themeConfig);
        return themeConfig;
      }),
      catchError((error) => {
        console.error('Failed to load theme from URL:', themeUrl, error);
        throw error;
      })
    );
  }

  /**
   * Load page config from a URL. If the page config includes a themeFile, also load and apply that theme.
   * @param pageUrl URL to the page JSON file
   * @returns Observable that emits the page config (without themeFile property)
   */
  loadPageFromUrl(pageUrl: string): Observable<ComponentConfig> {
    interface PageDataWithTheme extends ComponentConfig {
      themeFile?: string;
    }

    return this.getHttpClient().get<PageDataWithTheme>(pageUrl).pipe(
      map((data) => {
        const themeFile = data.themeFile;
        
        // Load theme if themeFile is specified
        if (themeFile) {
          // Load theme and apply it
          this.loadThemeFromUrl(themeFile).subscribe({
            error: (error) => {
              console.warn('Failed to load theme file:', themeFile, error);
            }
          });
        }
        
        // Return page config without themeFile property
        const { themeFile: _, ...configWithoutThemeFile } = data;
        return configWithoutThemeFile as ComponentConfig;
      }),
      catchError((error) => {
        console.error('Failed to load page from URL:', pageUrl, error);
        throw error;
      })
    );
  }

  /**
   * Load both theme and page from URLs
   * @param pageUrl URL to the page JSON file
   * @param themeUrl Optional URL to the theme JSON file (if not provided, will use themeFile from page config if available)
   * @returns Observable that emits the page config
   */
  loadPageAndTheme(pageUrl: string, themeUrl?: string): Observable<ComponentConfig> {
    interface PageDataWithTheme extends ComponentConfig {
      themeFile?: string;
    }

    return this.getHttpClient().get<PageDataWithTheme>(pageUrl).pipe(
      map((data) => {
        // Use provided themeUrl or themeFile from page config
        const finalThemeUrl = themeUrl || data.themeFile;
        
        if (finalThemeUrl) {
          // Load theme and apply it
          this.loadThemeFromUrl(finalThemeUrl).subscribe({
            error: (error) => {
              console.warn('Failed to load theme file:', finalThemeUrl, error);
            }
          });
        }
        
        // Return page config without themeFile property
        const { themeFile: _, ...configWithoutThemeFile } = data;
        return configWithoutThemeFile as ComponentConfig;
      }),
      catchError((error) => {
        console.error('Failed to load page from URL:', pageUrl, error);
        throw error;
      })
    );
  }

  private readonly THEME_FONT_LINK_ID = 'theme-font-link';

  /** Injects runtime CSS from theme so dynamic classes work after Tailwind purge */
  private applyThemeStyles(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const theme = this.themeResolved();
    
    // Apply font link first, then generate styles
    this.applyFontLink(theme.typography?.fontLink);
    
    const css = generateThemeStyles(theme);
    let el = document.getElementById('theme-runtime');
    if (!el) {
      el = document.createElement('style');
      el.id = 'theme-runtime';
      document.head.appendChild(el);
    }
    el.textContent = css;
    
    // Add theme-active class to root, html, and body for font application
    document.documentElement.classList.add('theme-active');
    document.body.classList.add('theme-active');
  }

  /** Injects or removes font link when theme has typography.fontLink */
  private applyFontLink(fontLink?: string): void {
    const existing = document.getElementById(this.THEME_FONT_LINK_ID);
    if (existing) existing.remove();
    if (fontLink && typeof fontLink === 'string') {
      // Add preconnect for Google Fonts to speed up loading
      if (fontLink.includes('fonts.googleapis.com')) {
        // Check if preconnect already exists
        const hasPreconnect = Array.from(document.head.querySelectorAll('link[rel="preconnect"]'))
          .some(link => (link as HTMLLinkElement).href === 'https://fonts.googleapis.com');
        
        if (!hasPreconnect) {
          const preconnect = document.createElement('link');
          preconnect.rel = 'preconnect';
          preconnect.href = 'https://fonts.googleapis.com';
          document.head.appendChild(preconnect);

          const preconnect2 = document.createElement('link');
          preconnect2.rel = 'preconnect';
          preconnect2.href = 'https://fonts.gstatic.com';
          preconnect2.crossOrigin = 'anonymous';
          document.head.appendChild(preconnect2);
        }
      }
      
      const link = document.createElement('link');
      link.id = this.THEME_FONT_LINK_ID;
      link.rel = 'stylesheet';
      link.href = fontLink;
      document.head.appendChild(link);
    }
  }

  resetTheme(): void {
    this.themeSignal.set(DEFAULT_THEME);
    this.applyThemeStyles();
  }

  /** Get CSS class for a theme color (e.g. 'bg-indigo-600' from colors.primary) */
  getColorClass(area: 'bg' | 'text' | 'border' | 'ring', key: string): string {
    const colors = this.themeResolved().colors ?? {};
    const color = colors[key as keyof typeof colors] ?? colors.primary ?? 'indigo-600';
    return color ? `${area}-${color}` : '';
  }

  /** Get gradient classes for a preset (hero, cta, card, mesh, logoCloud) or build from from/via/to */
  getGradientClass(preset?: 'hero' | 'cta' | 'card' | 'mesh' | 'logoCloud'): string {
    const g = this.themeResolved().gradients;
    if (!g) return 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600';

    const presetConfig = preset && g[preset] ? (g[preset] as { from: string; via?: string; to: string; direction?: string }) : null;
    const from = presetConfig?.from ?? g.from ?? 'indigo-600';
    const via = presetConfig?.via ?? g.via;
    const to = presetConfig?.to ?? g.to ?? 'pink-600';
    const dir = presetConfig?.direction ?? g.direction ?? 'to-br';
    const dirClass = dir.startsWith('to-') ? `bg-gradient-${dir}` : `bg-gradient-${dir}`;

    const parts = [`bg-gradient-${dir}`, `from-${from}`, via ? `via-${via}` : null, `to-${to}`].filter(Boolean);
    return parts.join(' ');
  }

  /** Get transition classes (e.g. 'transition-all duration-500 ease-out') */
  getTransitionClass(preset?: 'fast' | 'normal' | 'slow', properties = 'all'): string {
    const a = this.themeResolved().animation;
    const duration = preset ? (a?.duration?.[preset] ?? '300ms') : (a?.duration?.normal ?? '300ms');
    const easing = a?.easing?.default ?? 'ease';
    const durationClass = duration === '150ms' ? 'duration-150' : duration === '300ms' ? 'duration-300' : duration === '500ms' ? 'duration-500' : '';
    const easeClass = easing === 'ease-out' ? 'ease-out' : easing === 'ease-in' ? 'ease-in' : 'ease-in-out';
    return `transition-${properties} ${durationClass} ${easeClass}`;
  }

  /** Get overlay class (light, medium, dark) */
  getOverlayClass(variant: 'light' | 'medium' | 'dark' = 'light'): string {
    const o = this.themeResolved().effects?.overlay;
    const cls = o?.[variant] ?? (variant === 'light' ? 'bg-white/10' : variant === 'medium' ? 'bg-white/20' : 'bg-black/50');
    return cls;
  }

  /** Get backdrop blur class */
  getBackdropBlurClass(): string {
    return this.themeResolved().effects?.backdropBlur ?? 'backdrop-blur-sm';
  }

  /** Get glass-style classes (overlay + backdrop blur) */
  getGlassClass(overlayVariant: 'light' | 'medium' | 'dark' = 'light'): string {
    return `${this.getOverlayClass(overlayVariant)} ${this.getBackdropBlurClass()}`;
  }

  /** Get gradient-muted section class (from-primaryMuted via-surface to-surface) – theme-based, no via-white */
  getGradientMutedClass(): string {
    const t = this.themeResolved();
    const primaryMuted = t.colors?.primaryMuted ?? 'indigo-50';
    const surface = t.colors?.surface ?? 'white';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const surfaceBase = surfaceDark.split('-')[0];
    return `bg-gradient-to-b from-${primaryMuted} via-${surface} to-${surface} dark:from-${surfaceBase}-900 dark:via-${surfaceMutedDark} dark:to-${surfaceBase}-900`;
  }

  /** Get section background class by variant */
  getSectionBackgroundClass(variant: 'default' | 'muted' | 'white' | 'dark' | 'gradient' | 'gradientMuted' | 'pattern' = 'default'): string {
    const sb = this.themeResolved().page?.sectionBackgrounds;
    const raw = sb?.[variant];
    if (variant === 'gradientMuted') {
      return raw && !raw.includes('via-white') ? raw : this.getGradientMutedClass();
    }
    return raw ?? (variant === 'gradient' ? this.getGradientClass('hero') : `bg-${this.themeResolved().colors?.background ?? 'white'}`);
  }

  /** Get animation preset class */
  getAnimationPresetClass(preset: 'fadeIn' | 'slideUp' | 'scale'): string {
    return this.themeResolved().animation?.presets?.[preset] ?? '';
  }

  /** Get header action button size from theme */
  getHeaderActionSize(): 'sm' | 'md' | 'lg' {
    return (this.themeResolved().header?.actionButtonSize as 'sm' | 'md' | 'lg') ?? 'md';
  }

  /** Get header height class from theme */
  getHeaderHeightClass(): string {
    return this.themeResolved().header?.height ?? 'h-14';
  }

  /** Get mobile drawer width from theme */
  getHeaderDrawerWidth(): string {
    return this.themeResolved().header?.drawerWidth ?? 'min(320px,85vw)';
  }

  /** Get header color class (e.g. text-gray-900, bg-white) */
  getHeaderColorClass(area: 'bg' | 'text' | 'border', key: keyof import('./theme.config').ThemeHeaderColors): string {
    const color = this.getHeaderColor(key);
    return color ? `${area}-${color}` : '';
  }

  /** Get header color – uses header.colors with fallback to main theme colors */
  getHeaderColor(key: keyof import('./theme.config').ThemeHeaderColors): string {
    const hc = this.themeResolved().header?.colors;
    const bc = this.themeResolved().colors;
    const map: Record<string, string> = {
      brand: hc?.brand ?? bc?.text ?? 'gray-900',
      navLink: hc?.navLink ?? bc?.textMuted ?? 'gray-600',
      navLinkHover: hc?.navLinkHover ?? bc?.text ?? 'gray-900',
      navLinkMuted: hc?.navLinkMuted ?? bc?.textMutedLight ?? 'gray-500',
      surface: hc?.surface ?? bc?.surface ?? 'white',
      surfaceMuted: hc?.surfaceMuted ?? bc?.surfaceMuted ?? 'gray-100',
      surfaceMutedDark: hc?.surfaceMutedDark ?? bc?.surfaceMutedDark ?? 'gray-800',
      border: hc?.border ?? bc?.border ?? 'gray-200',
      borderMutedDark: hc?.borderMutedDark ?? bc?.borderMutedDark ?? 'gray-800',
      primary: hc?.primary ?? bc?.primary ?? 'indigo-600',
      primaryHover: hc?.primaryHover ?? bc?.primaryHover ?? 'indigo-500'
    };
    return map[key as string] ?? (bc as Record<string, string>)?.[key] ?? 'gray-900';
  }

  /**
   * Get primitive theme class(es) by path (e.g. 'button.base', 'text.sizes.xs')
   * Resolves theme color placeholders like {primary}, {text}, etc.
   */
  getPrimitiveClass(path: string, fallback = ''): string {
    const primitives = this.themeResolved().primitives;
    if (!primitives) return fallback;

    const parts = path.split('.');
    let value: any = primitives;
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return fallback;
      }
    }

    if (typeof value === 'string') {
      return this.resolveThemePlaceholders(value);
    }
    return fallback;
  }

  /**
   * Resolve theme placeholders in class strings (e.g. {primary} -> indigo-600)
   * Strips common prefixes (bg-, text-, border-) from color values to prevent double prefixes
   */
  resolveThemePlaceholders(classString: string): string {
    const colors = this.themeResolved().colors ?? {};
    const theme = this.themeResolved();

    // Helper to strip common Tailwind prefixes from color values
    const stripPrefix = (value: string): string => {
      // Remove common prefixes: bg-, text-, border-
      return value.replace(/^(bg-|text-|border-)/, '');
    };

    // Replace {key} placeholders with actual color values
    return classString.replace(/\{(\w+)\}/g, (match, key) => {
      // Check colors first
      if (key in colors) {
        const colorValue = colors[key as keyof typeof colors];
        if (colorValue && typeof colorValue === 'string') {
          // Strip prefixes to prevent double prefixes (e.g., bg-bg-blue-600)
          return stripPrefix(colorValue);
        }
        return colorValue ?? match;
      }
      // Check other theme areas (spacing, etc.)
      const value = (theme as any)[key];
      if (typeof value === 'string') {
        // Strip prefixes from other string values too
        return stripPrefix(value);
      }
      return match;
    });
  }

  private deepMerge<T extends object>(target: T, source: Partial<T>): T {
    const result = { ...target } as T;
    for (const key of Object.keys(source) as (keyof T)[]) {
      const src = source[key];
      const tgt = target[key];
      if (src && typeof src === 'object' && !Array.isArray(src) && tgt && typeof tgt === 'object') {
        (result as any)[key] = this.deepMerge(
          tgt as object,
          src as object
        );
      } else if (src !== undefined) {
        (result as any)[key] = src;
      }
    }
    return result;
  }
}
