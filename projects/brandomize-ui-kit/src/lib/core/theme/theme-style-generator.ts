/**
 * Generates runtime CSS from theme config. Injected by ThemeService when theme is set.
 * Covers colors, gradients, and other theme-driven utilities so Tailwind purging is not an issue.
 */
import type { GlobalThemeConfig } from './theme.config';
import { resolveColor } from './theme-token-maps';

/** Extract color tokens from a string (handles class names like bg-indigo-600) */
function extractColorTokensFromString(str: string, colors?: Record<string, string | undefined>): Set<string> {
  const found = new Set<string>();
  
  // First resolve placeholders if colors are available
  let resolved = str;
  if (str.includes('{') && colors) {
    resolved = str.replace(/\{(\w+)\}/g, (match, key) => {
      return colors[key] ?? match;
    });
  }
  
  // Extract color tokens from class names (e.g., bg-indigo-600, text-gray-900, border-red-500/50, bg-white)
  // Pattern: word-color-shade or word-color-shade/opacity, or word-specialColor (white, black, transparent)
  // Also handle dark:bg-gray-800/75, ring-gray-900/5, !from-indigo-600, bg-white, etc.
  // Note: ! prefix (important modifier) is handled - matches ! before utility class
  const classTokenPattern = /(?:^|\s|:)(!)?(?:bg|text|border|ring|placeholder|from|via|to|hover:bg|hover:text|hover:border|dark:bg|dark:text|dark:border|dark:hover:bg)-((?:[a-z]+-\d{2,3}|white|black|transparent)(?:\/\d+)?)/g;
  let match;
  while ((match = classTokenPattern.exec(resolved)) !== null) {
    const token = match[2]; // token is now in match[2] since match[1] is the ! prefix
    // Extract base token (without opacity) for opacity variant generation
    const baseToken = token.split('/')[0];
    // Match color-number pattern OR special colors (white, black, transparent)
    if (baseToken.match(/^[a-z]+-\d{2,3}$/) || ['white', 'black', 'transparent'].includes(baseToken)) {
      found.add(baseToken);
    }
    // Also add the full token if it has opacity
    if (token.includes('/') && (token.match(/^[a-z]+-\d{2,3}\/\d+$/) || ['white', 'black', 'transparent'].some(c => token.startsWith(c + '/')))) {
      found.add(token);
    }
  }
  
  // Also extract standalone tokens (base tokens without opacity)
  // This handles cases where tokens appear without utility prefix
  const standalonePattern = /\b((?:[a-z]+-\d{2,3}|white|black|transparent))(?:\/\d+)?\b/g;
  while ((match = standalonePattern.exec(resolved)) !== null) {
    const token = match[1];
    if (token.match(/^[a-z]+-\d{2,3}$/) || ['white', 'black', 'transparent'].includes(token)) {
      found.add(token);
    }
  }
  
  // Extract hex colors
  const hexPattern = /#[a-fA-F0-9]{3,8}/g;
  while ((match = hexPattern.exec(resolved)) !== null) {
    found.add(match[0]);
  }
  
  // Check for transparent
  if (resolved.includes('transparent')) {
    found.add('transparent');
  }
  
  return found;
}

/** Collect all color tokens from theme (recursively) */
function collectColorTokens(obj: unknown, tokens: Set<string>, colors?: Record<string, string | undefined>): void {
  if (obj == null) return;
  if (typeof obj === 'string') {
    const extracted = extractColorTokensFromString(obj, colors);
    extracted.forEach(token => tokens.add(token));
    return;
  }
  if (typeof obj !== 'object') return;
  
  // Extract colors from colors section if available
  const themeColors = (obj as any).colors ?? colors;
  
  for (const v of Object.values(obj)) {
    if (typeof v === 'string') {
      const extracted = extractColorTokensFromString(v, themeColors);
      extracted.forEach(token => tokens.add(token));
    } else if (v && typeof v === 'object') {
      collectColorTokens(v, tokens, themeColors);
    }
  }
}

/** Generate CSS for color utilities (text, bg, border, ring) */
function generateColorRules(tokens: Set<string>): string {
  const lines: string[] = [];
  for (const token of tokens) {
    const hex = resolveColor(token);
    const esc = token.replace(/\//g, '\\/');
    // Generate base classes
    lines.push(`  .text-${esc}{color:${hex}}`);
    lines.push(`  .bg-${esc}{background-color:${hex}}`);
    lines.push(`  .border-${esc}{border-color:${hex}}`);
    lines.push(`  .ring-${esc}{--tw-ring-color:${hex}}`);
    lines.push(`  .placeholder-${esc}::placeholder{color:${hex}}`);
    // Generate important modifier classes (!)
    lines.push(`  .\\!text-${esc}{color:${hex}!important}`);
    lines.push(`  .\\!bg-${esc}{background-color:${hex}!important}`);
    lines.push(`  .\\!border-${esc}{border-color:${hex}!important}`);
    // Generate hover classes
    lines.push(`  .hover\\:text-${esc}:hover{color:${hex}}`);
    lines.push(`  .hover\\:bg-${esc}:hover{background-color:${hex}}`);
    lines.push(`  .hover\\:border-${esc}:hover{border-color:${hex}}`);
    // Generate dark mode classes
    lines.push(`  .dark .dark\\:text-${esc}{color:${hex}}`);
    lines.push(`  .dark .dark\\:bg-${esc}{background-color:${hex}}`);
    lines.push(`  .dark .dark\\:border-${esc}{border-color:${hex}}`);
    lines.push(`  .dark .dark\\:ring-${esc}{--tw-ring-color:${hex}}`);
    lines.push(`  .dark .dark\\:hover\\:bg-${esc}:hover{background-color:${hex}}`);
  }
  return lines.join('\n');
}

/** Extract default gradient colors from theme for fallback when --tw-gradient-stops is empty */
function getDefaultGradientFallback(theme: GlobalThemeConfig): string {
  const g = theme.gradients;
  const preset = g?.hero ?? g;
  const from = (preset as { from?: string })?.from ?? g?.from ?? 'indigo-600';
  const via = (preset as { via?: string })?.via ?? g?.via;
  const to = (preset as { to?: string })?.to ?? g?.to ?? 'pink-600';
  const parts = [
    resolveGradientColor(from),
    via ? resolveGradientColor(via) : null,
    resolveGradientColor(to)
  ].filter(Boolean);
  return parts.join(',');
}

/** Resolve color for gradient (handles black/80, indigo-600 style tokens) */
function resolveGradientColor(token: string): string {
  const slash = token.indexOf('/');
  if (slash >= 0) {
    const base = token.slice(0, slash);
    const alpha = parseInt(token.slice(slash + 1), 10) / 100;
    if (!isNaN(alpha)) {
      const hex = resolveColor(base);
      return hexToRgba(hex, alpha);
    }
  }
  return resolveColor(token);
}

/** Generate CSS for gradient utilities (from, via, to) - Tailwind uses CSS variables */
function generateGradientRules(tokens: Set<string>, theme: GlobalThemeConfig): string {
  const lines: string[] = [];
  const fallback = getDefaultGradientFallback(theme);
  for (const token of tokens) {
    const color = resolveGradientColor(token);
    const esc = token.replace(/\//g, '\\/');
    // from- sets initial vars; to- sets --tw-gradient-to; via- inserts middle stop
    lines.push(`  .from-${esc}{--tw-gradient-from:${color};--tw-gradient-to:rgb(255 255 255/0);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}`);
    lines.push(`  .via-${esc}{--tw-gradient-stops:var(--tw-gradient-from),${color},var(--tw-gradient-to)}`);
    lines.push(`  .to-${esc}{--tw-gradient-to:${color}}`);
    // Generate important modifier classes (!)
    lines.push(`  .\\!from-${esc}{--tw-gradient-from:${color}!important;--tw-gradient-to:rgb(255 255 255/0)!important;--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)!important}`);
    lines.push(`  .\\!via-${esc}{--tw-gradient-stops:var(--tw-gradient-from),${color},var(--tw-gradient-to)!important}`);
    lines.push(`  .\\!to-${esc}{--tw-gradient-to:${color}!important}`);
  }
  const dirs: [string, string][] = [
    ['to-r', 'to right'], ['to-l', 'to left'], ['to-t', 'to top'], ['to-b', 'to bottom'],
    ['to-tr', 'to top right'], ['to-tl', 'to top left'], ['to-br', 'to bottom right'], ['to-bl', 'to bottom left']
  ];
  for (const [dir, cssDir] of dirs) {
    lines.push(`  .bg-gradient-${dir}{background-image:linear-gradient(${cssDir},var(--tw-gradient-stops,${fallback}))}`);
    // Generate important modifier classes (!)
    lines.push(`  .\\!bg-gradient-${dir}{background-image:linear-gradient(${cssDir},var(--tw-gradient-stops,${fallback}))!important}`);
  }
  return lines.join('\n');
}

/** Convert hex to rgba with alpha */
function hexToRgba(hex: string, alpha: number): string {
  if (hex === 'transparent') return 'transparent';
  if (!hex.startsWith('#') || hex.length < 7) return hex;
  const h = hex.slice(1, 7);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Generate opacity variant rules (fixed) */
function generateOpacityVariantRules(tokens: Set<string>): string {
  const lines: string[] = [];
  const opacities: [string, number][] = [['5', 0.05], ['10', 0.1], ['20', 0.2], ['50', 0.5], ['75', 0.75], ['80', 0.8], ['95', 0.95]];
  for (const token of tokens) {
    // Skip tokens that already have opacity
    if (token.includes('/')) continue;
    
    const hex = resolveColor(token);
    const esc = token.replace(/\//g, '\\/');
    for (const [op, alpha] of opacities) {
      const color = hexToRgba(hex, alpha);
      // Generate base opacity variants for bg, text, border, ring
      lines.push(`  .bg-${esc}\\/${op}{background-color:${color}}`);
      lines.push(`  .text-${esc}\\/${op}{color:${color}}`);
      lines.push(`  .border-${esc}\\/${op}{border-color:${color}}`);
      lines.push(`  .ring-${esc}\\/${op}{--tw-ring-color:${color}}`);
      // Generate dark mode opacity variants
      lines.push(`  .dark\\:bg-${esc}\\/${op}.dark,.dark .dark\\:bg-${esc}\\/${op}{background-color:${color}}`);
      lines.push(`  .dark\\:text-${esc}\\/${op}.dark,.dark .dark\\:text-${esc}\\/${op}{color:${color}}`);
      lines.push(`  .dark\\:border-${esc}\\/${op}.dark,.dark .dark\\:border-${esc}\\/${op}{border-color:${color}}`);
      lines.push(`  .dark\\:ring-${esc}\\/${op}.dark,.dark .dark\\:ring-${esc}\\/${op}{--tw-ring-color:${color}}`);
    }
  }
  return lines.join('\n');
}

/** Generate typography styles with high specificity to override base styles */
function generateTypographyStyles(theme: GlobalThemeConfig): string {
  const fontFamily = theme.typography?.fontFamily;
  const fontFamilyHeading = theme.typography?.fontFamilyHeading || fontFamily;
  
  if (!fontFamily) return '';
  
  const styles: string[] = [];
  
  // Apply font-family globally with high specificity
  styles.push(`:root.theme-active{font-family:${fontFamily}!important}`);
  styles.push(`html.theme-active{font-family:${fontFamily}!important}`);
  styles.push(`body.theme-active{font-family:${fontFamily}!important}`);
  styles.push(`body.theme-active *{font-family:${fontFamily}!important}`);
  
  // Apply heading font if different
  if (fontFamilyHeading && fontFamilyHeading !== fontFamily) {
    styles.push(`body.theme-active h1,body.theme-active h2,body.theme-active h3,body.theme-active h4,body.theme-active h5,body.theme-active h6{font-family:${fontFamilyHeading}!important}`);
  } else if (fontFamily) {
    styles.push(`body.theme-active h1,body.theme-active h2,body.theme-active h3,body.theme-active h4,body.theme-active h5,body.theme-active h6{font-family:${fontFamily}!important}`);
  }
  
  // Apply to form elements
  styles.push(`body.theme-active button,body.theme-active input,body.theme-active textarea,body.theme-active select{font-family:${fontFamily}!important}`);
  
  return styles.join('\n');
}

/** Generate body styles from page.background and typography.fontFamily */
function generatePageBodyStyles(theme: GlobalThemeConfig): string {
  const parts: string[] = [];
  const page = theme.page;
  if (page?.background) {
    const bg = page.background;
    if (!bg.startsWith('bg-gradient-') && !bg.startsWith('from-')) {
      const token = bg.replace(/^bg-/, '').trim();
      parts.push(`background-color:${resolveColor(token)}`);
    }
  }
  if (parts.length === 0) return '';
  return `body.theme-active{${parts.join(';')}}`;
}

/** Generate header styles from theme.header - CSS variables for header elements */
function generateHeaderStyles(theme: GlobalThemeConfig): string {
  const h = theme.header?.colors;
  if (!h) return '';
  const vars: string[] = [];
  if (h.surface) vars.push(`--theme-header-bg:${resolveColor(h.surface)}`);
  if (h.brand) vars.push(`--theme-header-brand:${resolveColor(h.brand)}`);
  if (h.navLink) vars.push(`--theme-header-nav:${resolveColor(h.navLink)}`);
  if (h.navLinkHover) vars.push(`--theme-header-nav-hover:${resolveColor(h.navLinkHover)}`);
  if (h.border) vars.push(`--theme-header-border:${resolveColor(h.border)}`);
  if (vars.length === 0) return '';
  return `body.theme-active header[data-theme-header]{${vars.join(';')}}`;
}

/** Initialize Tailwind CSS variables at root level */
function generateTailwindVariables(): string {
  return `  :root{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-gradient-from:rgb(99 102 241);--tw-gradient-to:rgb(236 72 153);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to);--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }`;
}

/** Generate full stylesheet from theme config */
export function generateThemeStyles(theme: GlobalThemeConfig): string {
  const tokens = new Set<string>();
  
  // Dynamically collect all color tokens from the entire theme configuration
  // This includes colors, gradients, primitives, and any other sections with color classes
  collectColorTokens(theme, tokens, theme.colors as Record<string, string | undefined> | undefined);
  
  // Ensure common base colors are always available (used in many components)
  // These are extracted from classes found throughout the codebase
  const commonColors = ['white', 'black', 'transparent'];
  commonColors.forEach(color => tokens.add(color));
  
  // Ensure common gray shades are available (commonly used in dark mode and backgrounds)
  // Extract from theme.colors values if present, otherwise add defaults
  if (theme.colors) {
    Object.values(theme.colors).forEach(color => {
      if (typeof color === 'string' && color.match(/^[a-z]+-\d{2,3}$/)) {
        tokens.add(color);
        // Also add common shades of the same color family for dark mode variants
        const [colorName, shade] = color.split('-');
        if (colorName && shade) {
          // Add darker shades commonly used (900, 950 for dark mode)
          if (parseInt(shade) < 900) {
            tokens.add(`${colorName}-900`);
            tokens.add(`${colorName}-950`);
          }
        }
      }
    });
  }

  const sections: string[] = [
    '/* Theme runtime - generated from theme config */',
    '/* Initialize Tailwind CSS variables */',
    generateTailwindVariables(),
    '',
    '/* Typography - apply fonts globally with high specificity */',
    generateTypographyStyles(theme),
    '',
    '/* Colors */',
    generateColorRules(tokens),
    '',
    '/* Opacity variants */',
    generateOpacityVariantRules(tokens),
    '',
    '/* Gradients (from, via, to) */',
    generateGradientRules(tokens, theme),
    '',
    '/* Shadows */',
    generateShadowUtilities(),
    '',
    '/* Backdrop blur */',
    generateBackdropBlurUtilities(),
    '',
    '/* Page body */',
    generatePageBodyStyles(theme),
    '',
    '/* Header styling */',
    generateHeaderStyles(theme)
  ];

  return sections.filter(Boolean).join('\n');
}

/** Generate shadow utility classes */
function generateShadowUtilities(): string {
  return `  .shadow-sm{box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05)}
  .shadow{box-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1),0 1px 2px -1px rgb(0 0 0 / 0.1)}
  .shadow-md{box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1),0 2px 4px -2px rgb(0 0 0 / 0.1)}
  .shadow-lg{box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1),0 4px 6px -4px rgb(0 0 0 / 0.1)}
  .shadow-xl{box-shadow:0 20px 25px -5px rgb(0 0 0 / 0.1),0 8px 10px -6px rgb(0 0 0 / 0.1)}
  .shadow-2xl{box-shadow:0 25px 50px -12px rgb(0 0 0 / 0.25)}
  .shadow-none{box-shadow:0 0 #0000}
  .dark\\:shadow-sm.dark,.dark .dark\\:shadow-sm{box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05)}
  .dark\\:shadow.dark,.dark .dark\\:shadow{box-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1),0 1px 2px -1px rgb(0 0 0 / 0.1)}
  .dark\\:shadow-md.dark,.dark .dark\\:shadow-md{box-shadow:0 4px 6px -1px rgb(0 0 0 / 0.1),0 2px 4px -2px rgb(0 0 0 / 0.1)}
  .dark\\:shadow-lg.dark,.dark .dark\\:shadow-lg{box-shadow:0 10px 15px -3px rgb(0 0 0 / 0.1),0 4px 6px -4px rgb(0 0 0 / 0.1)}
  .dark\\:shadow-xl.dark,.dark .dark\\:shadow-xl{box-shadow:0 20px 25px -5px rgb(0 0 0 / 0.1),0 8px 10px -6px rgb(0 0 0 / 0.1)}
  .dark\\:shadow-2xl.dark,.dark .dark\\:shadow-2xl{box-shadow:0 25px 50px -12px rgb(0 0 0 / 0.25)}
  .dark\\:shadow-none.dark,.dark .dark\\:shadow-none{box-shadow:0 0 #0000}`;
}

/** Generate backdrop blur utility classes */
function generateBackdropBlurUtilities(): string {
  // Use simplified backdrop-filter that only applies blur (other variables are optional)
  // Empty CSS variables are ignored by browsers, so this is safe
  return `  .backdrop-blur-sm{backdrop-filter:blur(4px)}
  .backdrop-blur{backdrop-filter:blur(8px)}
  .backdrop-blur-md{backdrop-filter:blur(12px)}
  .backdrop-blur-lg{backdrop-filter:blur(16px)}
  .backdrop-blur-xl{backdrop-filter:blur(24px)}
  .backdrop-blur-2xl{backdrop-filter:blur(40px)}
  .backdrop-blur-3xl{backdrop-filter:blur(64px)}
  .dark\\:backdrop-blur-sm.dark,.dark .dark\\:backdrop-blur-sm{backdrop-filter:blur(4px)}
  .dark\\:backdrop-blur.dark,.dark .dark\\:backdrop-blur{backdrop-filter:blur(8px)}
  .dark\\:backdrop-blur-md.dark,.dark .dark\\:backdrop-blur-md{backdrop-filter:blur(12px)}
  .dark\\:backdrop-blur-lg.dark,.dark .dark\\:backdrop-blur-lg{backdrop-filter:blur(16px)}
  .dark\\:backdrop-blur-xl.dark,.dark .dark\\:backdrop-blur-xl{backdrop-filter:blur(24px)}
  .dark\\:backdrop-blur-2xl.dark,.dark .dark\\:backdrop-blur-2xl{backdrop-filter:blur(40px)}`;
}
