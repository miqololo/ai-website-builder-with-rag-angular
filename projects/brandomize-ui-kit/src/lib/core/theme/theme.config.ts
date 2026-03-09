/**
 * Global theme configuration for Tailwind-based theming.
 * Enables full template, card, button, and typography customization.
 *
 * NOTE: Color values (e.g. 'gray-900', 'indigo-600') are resolved at runtime.
 * ThemeService injects runtime CSS for theme classes so dynamic classes work
 * even when Tailwind purges them (see theme-style-generator.ts).
 */

export interface ThemeColors {
  primary?: string;
  primaryHover?: string;
  primaryMuted?: string;  // e.g. indigo-50 for hover backgrounds
  secondary?: string;
  background?: string;
  backgroundMuted?: string;
  surface?: string;
  surfaceHover?: string;
  surfaceMuted?: string;   // e.g. gray-100
  surfaceMutedDark?: string; // e.g. gray-800 for dark mode
  surfaceDark?: string;     // e.g. gray-900 for dark mode
  text?: string;
  textMuted?: string;
  textMutedLight?: string;  // e.g. gray-500
  border?: string;
  borderMuted?: string;     // e.g. gray-300 for inputs
  borderMutedDark?: string; // e.g. gray-600/700 for dark mode
  borderHover?: string;
  accent?: string;
  success?: string;
  successMuted?: string;   // e.g. green-100
  warning?: string;
  warningMuted?: string;   // e.g. yellow-100
  error?: string;
  errorMuted?: string;     // e.g. red-100
  info?: string;
  infoMuted?: string;      // e.g. blue-100
  [key: string]: string | undefined;
}

export interface ThemeTypography {
  /** Font family value (e.g. "'Orbitron', sans-serif") */
  fontFamily?: string;
  fontFamilyHeading?: string;
  /** URL to import font (e.g. Google Fonts link) – injected when theme is applied */
  fontLink?: string;
  fontSize?: {
    xs?: string;
    sm?: string;
    base?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    '3xl'?: string;
    '4xl'?: string;
    '5xl'?: string;
  };
  fontWeight?: {
    normal?: string | number;
    medium?: string | number;
    semibold?: string | number;
    bold?: string | number;
  };
  lineHeight?: {
    tight?: string | number;
    normal?: string | number;
    relaxed?: string | number;
  };
  [key: string]: unknown;
}

export interface ThemeRadius {
  none?: string;
  sm?: string;
  DEFAULT?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
  full?: string;
  [key: string]: string | undefined;
}

export interface ThemeShadow {
  sm?: string;
  DEFAULT?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
  [key: string]: string | undefined;
}

export interface ThemeCard {
  background?: string;
  backgroundHover?: string;
  border?: string;
  borderHover?: string;
  radius?: string;
  shadow?: string;
  shadowHover?: string;
  padding?: string;
  transition?: string;
}

export interface ThemeButton {
  primary?: {
    background?: string;
    backgroundHover?: string;
    text?: string;
    radius?: string;
    shadow?: string;
  };
  secondary?: {
    background?: string;
    backgroundHover?: string;
    text?: string;
    border?: string;
    radius?: string;
  };
  outline?: {
    border?: string;
    text?: string;
    backgroundHover?: string;
    radius?: string;
  };
  radius?: string;
  padding?: string;
  [key: string]: unknown;
}

export interface ThemeSpacing {
  section?: string;
  card?: string;
  element?: string;
  [key: string]: string | number | undefined;
}

export interface ThemeIcon {
  /** Default icon color (Tailwind class, e.g. text-gray-500) */
  default?: string;
  /** Primary/accent color (e.g. text-indigo-600) */
  primary?: string;
  /** Muted color (e.g. text-gray-400) */
  muted?: string;
  /** Success color (e.g. text-green-600) */
  success?: string;
  /** Warning color (e.g. text-amber-600) */
  warning?: string;
  /** Error color (e.g. text-red-600) */
  error?: string;
  /** Size presets in px */
  sizes?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Default stroke width */
  strokeWidth?: number;
  [key: string]: string | number | { [k: string]: number } | undefined;
}

/** Page-level background (main page, section variants) */
export interface ThemePage {
  /** Main page background (Tailwind class e.g. 'gray-50', 'white') */
  background?: string;
  /** Section background variants */
  sectionBackgrounds?: {
    default?: string;
    muted?: string;
    white?: string;
    dark?: string;
    gradient?: string;
    gradientMuted?: string;
    pattern?: string;
  };
  [key: string]: unknown;
}

/** Gradient presets for hero, CTA, cards, mesh blurs, logo cloud */
export interface ThemeGradient {
  /** Direction: to-r, to-br, to-b, to-bl, to-t, to-tl, to-tr */
  direction?: string;
  /** Gradient color stops (Tailwind colors e.g. indigo-600) */
  from?: string;
  via?: string;
  to?: string;
  /** Named presets */
  hero?: { from: string; via?: string; to: string; direction?: string };
  cta?: { from: string; via?: string; to: string; direction?: string };
  card?: { from: string; via?: string; to: string; direction?: string };
  mesh?: { from: string; to: string; direction?: string };
  /** Dark gradient for logo cloud / section backgrounds */
  logoCloud?: { from: string; via?: string; to: string; direction?: string };
  [key: string]: unknown;
}

/** Animation durations, easing, presets */
export interface ThemeAnimation {
  duration?: {
    fast?: string;
    normal?: string;
    slow?: string;
  };
  easing?: {
    default?: string;
    in?: string;
    out?: string;
    bounce?: string;
  };
  presets?: {
    fadeIn?: string;
    slideUp?: string;
    scale?: string;
  };
  [key: string]: unknown;
}

/** Header-specific theme (height, colors, nav link, dropdown, mobile drawer) */
export interface ThemeHeaderColors {
  brand?: string;
  navLink?: string;
  navLinkHover?: string;
  navLinkMuted?: string;
  surface?: string;
  surfaceMuted?: string;
  surfaceMutedDark?: string;
  border?: string;
  borderMutedDark?: string;
  primary?: string;
  primaryHover?: string;
  [key: string]: string | undefined;
}

export interface ThemeHeader {
  height?: string;
  heightMobile?: string;
  navLinkGap?: string;
  actionButtonSize?: 'sm' | 'md' | 'lg';
  dropdownRadius?: string;
  drawerWidth?: string;
  colors?: ThemeHeaderColors;
  [key: string]: unknown;
}

/** Blur, overlay, patterns, glow effects */
export interface ThemeEffects {
  blur?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  backdropBlur?: string;
  overlay?: {
    light?: string;
    medium?: string;
    dark?: string;
  };
  patterns?: {
    grid?: string;
    dots?: string;
    noise?: string;
    [key: string]: string | undefined;
  };
  glow?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  [key: string]: unknown;
}

/** Static CSS classes for primitive components */
export interface ThemePrimitives {
  button?: {
    base?: string;
    sizes?: {
      sm?: string;
      md?: string;
      lg?: string;
    };
    variants?: {
      primary?: string;
      secondary?: string;
      outline?: string;
      ghost?: string;
    };
  };
  card?: {
    base?: string;
    variants?: {
      default?: string;
      elevated?: string;
      bordered?: string;
      ghost?: string;
    };
  };
  text?: {
    sizes?: Record<string, string>;
    weights?: Record<string, string>;
    aligns?: Record<string, string>;
    highlight?: string;
  };
  box?: {
    padding?: Record<string, string>;
    margin?: Record<string, string>;
    background?: Record<string, string>;
    borderRadius?: Record<string, string>;
    shadow?: Record<string, string>;
    overflow?: Record<string, string>;
    border?: string;
  };
  input?: {
    wrapper?: string;
    base?: string;
    label?: string;
    disabled?: string;
    required?: string;
  };
  textarea?: {
    wrapper?: string;
    base?: string;
    label?: string;
    disabled?: string;
    required?: string;
  };
  dropdown?: {
    wrapper?: string;
    base?: string;
    label?: string;
    required?: string;
  };
  checkbox?: {
    wrapper?: string;
    base?: string;
    label?: string;
    required?: string;
  };
  radio?: {
    wrapper?: string;
    base?: string;
    label?: string;
    required?: string;
  };
  chip?: {
    base?: string;
    variants?: Record<string, string>;
    sizes?: Record<string, string>;
    closeButton?: string;
  };
  toggle?: {
    wrapper?: string;
    base?: string;
    label?: string;
    required?: string;
  };
  slider?: {
    wrapper?: string;
    base?: string;
    label?: string;
    required?: string;
  };
  spacer?: Record<string, string>;
  divider?: {
    base?: string;
    horizontal?: string;
    vertical?: string;
  };
  link?: {
    base?: string;
    variants?: Record<string, string>;
    sizes?: Record<string, string>;
  };
  badge?: {
    base?: string;
    variants?: Record<string, string>;
    sizes?: Record<string, string>;
  };
  avatar?: {
    base?: string;
    sizes?: Record<string, string>;
    shapes?: Record<string, string>;
  };
  icon?: {
    base?: string;
  };
  progress?: {
    wrapper?: string;
    bar?: string;
  };
  alert?: {
    base?: string;
    variants?: Record<string, string>;
    dismissButton?: string;
    message?: string;
  };
  video?: {
    wrapper?: string;
    base?: string;
  };
  embed?: {
    wrapper?: string;
    base?: string;
  };
  accordion?: {
    base?: string;
    item?: string;
    header?: string;
    content?: string;
  };
  tabs?: {
    base?: string;
    list?: string;
    tab?: string;
    active?: string;
    inactive?: string;
    panel?: string;
  };
  modal?: {
    overlay?: string;
    base?: string;
    sizes?: Record<string, string>;
    closeButton?: string;
  };
  breadcrumb?: {
    base?: string;
    item?: string;
    separator?: string;
  };
  section?: {
    base?: string;
    backgrounds?: Record<string, string>;
  };
  container?: {
    base?: string;
    maxWidths?: Record<string, string>;
  };
  stack?: {
    base?: string;
    gaps?: Record<string, string>;
    alignItems?: Record<string, string>;
    justifyContent?: Record<string, string>;
  };
  row?: {
    base?: string;
    gaps?: Record<string, string>;
    alignItems?: Record<string, string>;
    justifyContent?: Record<string, string>;
  };
  grid?: {
    base?: string;
    gaps?: Record<string, string>;
    columns?: Record<string, string>;
  };
  form?: {
    base?: string;
    layouts?: Record<string, string>;
    gaps?: Record<string, string>;
  };
  image?: {
    base?: string;
    objectFit?: Record<string, string>;
    rounded?: Record<string, string>;
  };
  [key: string]: unknown;
}

export interface GlobalThemeConfig {
  colors?: ThemeColors;
  typography?: ThemeTypography;
  radius?: ThemeRadius;
  shadows?: ThemeShadow;
  card?: ThemeCard;
  button?: ThemeButton;
  spacing?: ThemeSpacing;
  icon?: ThemeIcon;
  page?: ThemePage;
  gradients?: ThemeGradient;
  animation?: ThemeAnimation;
  effects?: ThemeEffects;
  header?: ThemeHeader;
  primitives?: ThemePrimitives;
  /** Raw CSS variable overrides applied to :root */
  variables?: Record<string, string | number>;
  [key: string]: unknown;
}

/** Default theme values (Tailwind tokens) */
export const DEFAULT_THEME: GlobalThemeConfig = {
  colors: {
    primary: 'indigo-600',
    primaryHover: 'indigo-500',
    primaryMuted: 'indigo-50',
    secondary: 'gray-600',
    background: 'white',
    backgroundMuted: 'gray-50',
    surface: 'white',
    surfaceHover: 'gray-50',
    surfaceMuted: 'gray-100',
    surfaceMutedDark: 'gray-800',
    surfaceDark: 'gray-900',
    text: 'gray-900',
    textMuted: 'gray-600',
    textMutedLight: 'gray-500',
    border: 'gray-200',
    borderMuted: 'gray-300',
    borderMutedDark: 'gray-600',
    borderHover: 'indigo-500',
    accent: 'indigo-600',
    success: 'green-600',
    successMuted: 'green-100',
    warning: 'yellow-600',
    warningMuted: 'yellow-100',
    error: 'red-600',
    errorMuted: 'red-100',
    info: 'blue-600',
    infoMuted: 'blue-100'
  },
  typography: {
    fontFamily: 'sans-serif',
    fontFamilyHeading: 'sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    }
  },
  radius: {
    sm: '0.25rem',
    DEFAULT: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
  },
  card: {
    background: 'white',
    backgroundHover: 'white',
    border: 'gray-200',
    borderHover: 'indigo-500',
    radius: '1rem',
    shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    shadowHover: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    padding: '2rem',
    transition: 'all 0.3s ease'
  },
  button: {
    primary: {
      background: 'indigo-600',
      backgroundHover: 'indigo-500',
      text: 'white',
      radius: '0.375rem',
      shadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
    },
    secondary: {
      background: 'transparent',
      backgroundHover: 'indigo-50',
      text: 'indigo-600',
      border: 'indigo-600',
      radius: '0.375rem'
    },
    radius: '0.375rem',
    padding: '0.5rem 1rem'
  },
  spacing: {
    section: '6rem',
    card: '1.5rem',
    element: '1rem'
  },
  icon: {
    default: 'text-gray-500',
    primary: 'text-indigo-600',
    muted: 'text-gray-400',
    success: 'text-green-600',
    warning: 'text-amber-600',
    error: 'text-red-600',
    sizes: {
      xs: 12,
      sm: 16,
      md: 24,
      lg: 32,
      xl: 40
    },
    strokeWidth: 2
  },
  page: {
    background: 'gray-50',
    sectionBackgrounds: {
      default: 'bg-white dark:bg-gray-900',
      muted: 'bg-gray-50 dark:bg-gray-950',
      white: 'bg-white dark:bg-gray-900',
      dark: 'bg-gray-900 dark:bg-gray-950',
      gradient: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600',
      gradientMuted: 'bg-gradient-to-b from-indigo-50 via-white to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
      pattern: ''
    }
  },
  gradients: {
    direction: 'to-br',
    from: 'indigo-600',
    via: 'purple-600',
    to: 'pink-600',
    hero: { from: 'indigo-600', via: 'purple-600', to: 'pink-600', direction: 'to-br' },
    cta: { from: 'indigo-600', via: 'purple-600', to: 'pink-600', direction: 'to-b' },
    card: { from: 'indigo-400/20', via: 'purple-400/20', to: 'pink-400/20', direction: 'to-br' },
    mesh: { from: '#ff4694', to: '#776fff', direction: 'to-r' },
    logoCloud: { from: 'gray-900', via: 'indigo-950', to: 'gray-900', direction: 'to-br' }
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      default: 'ease',
      in: 'ease-in',
      out: 'ease-out',
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    },
    presets: {
      fadeIn: 'opacity-0 animate-fade-in',
      slideUp: 'animate-slide-up',
      scale: 'animate-scale-in'
    }
  },
  effects: {
    blur: {
      sm: 'blur-sm',
      md: 'blur-md',
      lg: 'blur-lg'
    },
    backdropBlur: 'backdrop-blur-sm',
    overlay: {
      light: 'bg-white/10',
      medium: 'bg-white/20',
      dark: 'bg-black/50'
    },
    patterns: {
      grid: 'grid-pattern',
      dots: 'dots-pattern',
      noise: 'noise-pattern'
    },
    glow: {
      sm: 'shadow-lg shadow-indigo-500/20',
      md: 'shadow-xl shadow-indigo-500/30',
      lg: 'shadow-2xl shadow-indigo-500/40'
    }
  },
  header: {
    height: 'h-14',
    heightMobile: 'h-14',
    navLinkGap: 'gap-2',
    actionButtonSize: 'md',
    dropdownRadius: '0.75rem',
    drawerWidth: 'min(320px,85vw)',
    colors: {
      brand: 'gray-900',
      navLink: 'gray-600',
      navLinkHover: 'gray-900',
      navLinkMuted: 'gray-500',
      surface: 'white',
      surfaceMuted: 'gray-100',
      surfaceMutedDark: 'gray-800',
      border: 'gray-200',
      borderMutedDark: 'gray-800',
      primary: 'indigo-600',
      primaryHover: 'indigo-500'
    }
  },
  primitives: {
    button: {
      base: 'inline-flex items-center justify-center rounded-md font-semibold transition-all duration-300',
      sizes: {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-3.5 py-2.5 text-sm',
        lg: 'px-4 py-3 text-base'
      },
      variants: {
        primary: 'text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md bg-{primary} hover:bg-{primaryHover} dark:bg-{primaryHover} dark:hover:bg-{primary} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{primary}',
        secondary: 'border border-{primary} text-{primary} hover:bg-{primaryMuted} dark:text-{primary} dark:hover:bg-{primary}/10',
        outline: 'border border-{borderMuted} bg-transparent text-{textMuted} hover:bg-{surfaceMuted} dark:border-{borderMutedDark} dark:text-{textMutedLight} dark:hover:bg-{surfaceMutedDark}',
        ghost: 'text-{text} hover:bg-{surfaceMuted} hover:text-{primary} dark:text-white dark:hover:bg-{surfaceMutedDark} dark:hover:text-{primary}'
      }
    },
    card: {
      base: 'flex flex-col transition-all duration-300',
      variants: {
        default: 'bg-{background}/95 backdrop-blur-sm shadow-lg ring-1 ring-{text}/5 dark:bg-{surfaceMutedDark}/95 dark:backdrop-blur-sm dark:ring-{background}/10 hover:shadow-xl hover:ring-{primary}/50 dark:hover:ring-{primary}/50',
        elevated: 'bg-{background}/95 backdrop-blur-sm shadow-xl dark:bg-{surfaceMutedDark}/95 dark:backdrop-blur-sm hover:shadow-2xl',
        bordered: 'bg-{background}/95 backdrop-blur-sm border border-{border} dark:border-{borderMutedDark} dark:bg-{surfaceMutedDark}/95 dark:backdrop-blur-sm shadow-md hover:border-{borderHover}',
        ghost: 'bg-{background}/80 backdrop-blur-sm dark:bg-{surfaceMutedDark}/80 dark:backdrop-blur-sm shadow-sm hover:bg-{background}/95 dark:hover:bg-{surfaceMutedDark}/95'
      }
    },
    text: {
      sizes: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '7xl': 'text-7xl'
      },
      weights: {
        thin: 'font-thin',
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold'
      },
      aligns: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify'
      },
      highlight: 'inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent bg-gradient-text animate-gradient-shift'
    },
    box: {
      padding: {
        none: '',
        xs: 'p-2',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
      },
      margin: {
        none: '',
        xs: 'm-2',
        sm: 'm-4',
        md: 'm-6',
        lg: 'm-8',
        xl: 'm-10'
      },
      background: {
        transparent: 'bg-transparent',
        default: 'bg-{background}',
        muted: 'bg-{backgroundMuted} dark:bg-{surfaceDark}',
        white: 'bg-{background} dark:bg-{surfaceDark}',
        dark: 'bg-{surfaceDark} dark:bg-{surfaceDark}'
      },
      borderRadius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg'
      },
      overflow: {
        visible: 'overflow-visible',
        hidden: 'overflow-hidden',
        auto: 'overflow-auto',
        scroll: 'overflow-scroll'
      },
      border: 'border border-{border} dark:border-{borderMutedDark}'
    },
    input: {
      wrapper: 'w-full',
      base: 'w-full px-3 py-2 border border-{borderMuted} dark:border-{borderMutedDark} rounded-lg focus:outline-none focus:ring-2 focus:ring-{primary} focus:border-transparent transition-colors bg-{background} dark:bg-{surfaceMutedDark} text-{text} dark:text-{background}',
      label: 'block text-sm font-medium text-{text} dark:text-{textMutedLight} mb-1',
      disabled: 'bg-{surfaceMuted} dark:bg-{surfaceMutedDark} cursor-not-allowed opacity-50',
      required: 'text-{error}'
    } as ThemePrimitives['input'],
    textarea: {
      wrapper: 'w-full',
      base: 'w-full px-3 py-2 border border-{borderMuted} dark:border-{borderMutedDark} rounded-lg focus:outline-none focus:ring-2 focus:ring-{primary} focus:border-transparent transition-colors resize-y bg-{background} dark:bg-{surfaceMutedDark} text-{text} dark:text-{background}',
      label: 'block text-sm font-medium text-{text} dark:text-{textMutedLight} mb-1',
      disabled: 'bg-{surfaceMuted} dark:bg-{surfaceMutedDark} cursor-not-allowed opacity-50',
      required: 'text-{error}'
    } as ThemePrimitives['textarea'],
    dropdown: {
      wrapper: 'w-full',
      base: 'w-full px-3 py-2 border border-{borderMuted} dark:border-{borderMutedDark} rounded-lg focus:outline-none focus:ring-2 focus:ring-{primary} focus:border-transparent transition-colors bg-{background} dark:bg-{surfaceMutedDark} text-{text} dark:text-{background}',
      label: 'block text-sm font-medium text-{text} dark:text-{textMutedLight} mb-1',
      required: 'text-{error}'
    } as ThemePrimitives['dropdown'],
    checkbox: {
      wrapper: 'flex items-center',
      base: 'h-4 w-4 rounded border-{borderMuted} text-{primary} focus:ring-2 focus:ring-{primary}',
      label: 'ml-2 text-sm text-{text} dark:text-{textMutedLight}',
      required: 'text-{error}'
    } as ThemePrimitives['checkbox'],
    radio: {
      wrapper: 'flex items-center',
      base: 'h-4 w-4 rounded-full border-{borderMuted} text-{primary} focus:ring-2 focus:ring-{primary}',
      label: 'ml-2 text-sm text-{text} dark:text-{textMutedLight}',
      required: 'text-{error}'
    } as ThemePrimitives['radio'],
    chip: {
      base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variants: {
        default: 'bg-{surfaceMuted} text-{text} dark:bg-{surfaceMutedDark} dark:text-{textMutedLight}',
        primary: 'bg-{primaryMuted} text-{primary}',
        success: 'bg-{successMuted} text-{success} dark:bg-{success}/30 dark:text-{successMuted}',
        warning: 'bg-{warningMuted} text-{warning} dark:bg-{warning}/30 dark:text-{warningMuted}',
        error: 'bg-{errorMuted} text-{error} dark:bg-{error}/30 dark:text-{errorMuted}'
      },
      sizes: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm'
      },
      closeButton: 'ml-1 hover:bg-{surfaceMuted} dark:hover:bg-{surfaceMutedDark} rounded-full p-0.5'
    },
    toggle: {
      wrapper: 'flex items-center',
      base: 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-{primary} focus:ring-offset-2',
      label: 'ml-2 text-sm text-{text} dark:text-{textMutedLight}',
      required: 'text-{error}'
    } as ThemePrimitives['toggle'],
    slider: {
      wrapper: 'w-full',
      base: 'w-full h-2 bg-{surfaceMuted} dark:bg-{surfaceMutedDark} rounded-lg appearance-none cursor-pointer accent-{primary}',
      label: 'block text-sm font-medium text-{text} dark:text-{textMutedLight} mb-1',
      required: 'text-{error}'
    } as ThemePrimitives['slider'],
    spacer: {
      xs: 'h-2',
      sm: 'h-4',
      md: 'h-6',
      lg: 'h-8',
      xl: 'h-12',
      '2xl': 'h-16',
      '3xl': 'h-24'
    },
    divider: {
      base: 'border-{borderMuted} dark:border-{borderMutedDark}',
      horizontal: 'w-full border-t',
      vertical: 'h-full border-l'
    },
    link: {
      base: 'transition-colors',
      variants: {
        default: 'text-{primary} hover:text-{primaryHover}',
        muted: 'text-{textMuted} hover:text-{text}',
        underline: 'text-{primary} underline hover:text-{primaryHover}'
      },
      sizes: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg'
      }
    },
    badge: {
      base: 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variants: {
        default: 'bg-{surfaceMuted} text-{text} dark:bg-{surfaceMutedDark} dark:text-{textMutedLight}',
        primary: 'bg-{primaryMuted} text-{primary}',
        success: 'bg-{successMuted} text-{success} dark:bg-{success}/30 dark:text-{successMuted}',
        warning: 'bg-{warningMuted} text-{warning} dark:bg-{warning}/30 dark:text-{warningMuted}',
        error: 'bg-{errorMuted} text-{error} dark:bg-{error}/30 dark:text-{errorMuted}',
        info: 'bg-{infoMuted} text-{info} dark:bg-{info}/30 dark:text-{infoMuted}'
      },
      sizes: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm'
      }
    },
    avatar: {
      base: 'inline-flex items-center justify-center rounded-full bg-{surfaceMuted} text-{textMuted}',
      sizes: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl'
      },
      shapes: {
        circle: 'rounded-full',
        square: 'rounded-md'
      }
    },
    icon: {
      base: ''
    },
    progress: {
      wrapper: 'w-full bg-{surfaceMuted} rounded-full overflow-hidden',
      bar: 'h-full transition-all duration-300 bg-{primary}'
    },
    alert: {
      base: 'rounded-lg border p-4',
      variants: {
        info: 'bg-{infoMuted} dark:bg-{info}/20 border-{infoMuted} dark:border-{info}/80 text-{info} dark:text-{infoMuted}',
        success: 'bg-{successMuted} dark:bg-{success}/20 border-{successMuted} dark:border-{success}/80 text-{success} dark:text-{successMuted}',
        warning: 'bg-{warningMuted} dark:bg-{warning}/20 border-{warningMuted} dark:border-{warning}/80 text-{warning} dark:text-{warningMuted}',
        error: 'bg-{errorMuted} dark:bg-{error}/20 border-{errorMuted} dark:border-{error}/80 text-{error} dark:text-{errorMuted}'
      },
      dismissButton: 'ml-4 shrink-0 rounded-md p-1.5 inline-flex hover:opacity-75 focus:outline-none',
      message: 'text-sm'
    },
    video: {
      wrapper: 'w-full',
      base: 'w-full rounded-lg'
    },
    embed: {
      wrapper: 'w-full',
      base: 'w-full rounded-lg'
    },
    accordion: {
      base: 'border border-{borderMuted} dark:border-{borderMutedDark} rounded-lg divide-y divide-{borderMuted} dark:divide-{borderMutedDark}',
      item: '',
      header: 'flex items-center justify-between w-full px-4 py-3 text-left font-medium text-{text} dark:text-{textMutedLight} hover:bg-{surfaceMuted} dark:hover:bg-{surfaceMutedDark} transition-colors',
      content: 'px-4 py-3 text-{textMuted} dark:text-{textMutedLight}'
    },
    tabs: {
      base: '',
      list: 'flex border-b border-{borderMuted} dark:border-{borderMutedDark}',
      tab: 'px-4 py-2 font-medium transition-colors',
      active: 'text-{primary} border-b-2 border-{primary}',
      inactive: 'text-{textMutedLight} hover:text-{text} dark:text-{textMutedLight} dark:hover:text-{textMutedLight}',
      panel: 'mt-4'
    },
    modal: {
      overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50',
      base: 'bg-{background} dark:bg-{surfaceMutedDark} rounded-lg shadow-xl',
      sizes: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
      },
      closeButton: 'absolute top-4 right-4 text-{textMuted} hover:text-{text} dark:text-{textMutedLight} dark:hover:text-{textMutedLight}'
    },
    breadcrumb: {
      base: 'flex items-center space-x-2 text-sm',
      item: 'text-{textMuted} hover:text-{text} dark:text-{textMutedLight} dark:hover:text-{textMutedLight}',
      separator: 'text-{textMutedLight} dark:text-{textMutedLight}'
    },
    section: {
      base: 'relative',
      backgrounds: {
        default: 'bg-{background} dark:bg-{surfaceDark}',
        muted: 'bg-{backgroundMuted} dark:bg-{surfaceDark}',
        white: 'bg-{background} dark:bg-{surfaceDark}',
        dark: 'bg-{surfaceDark} dark:bg-{surfaceDark}'
      }
    },
    container: {
      base: 'mx-auto px-4 sm:px-6 lg:px-8',
      maxWidths: {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
        '2xl': 'max-w-screen-2xl',
        full: 'max-w-full'
      }
    },
    stack: {
      base: 'flex flex-col',
      gaps: {
        none: 'gap-0',
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8'
      },
      alignItems: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch'
      },
      justifyContent: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly'
      }
    },
    row: {
      base: 'flex flex-row flex-wrap',
      gaps: {
        none: 'gap-0',
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8'
      },
      alignItems: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch'
      },
      justifyContent: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly'
      }
    },
    grid: {
      base: 'grid',
      gaps: {
        none: 'gap-0',
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8'
      },
      columns: {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        12: 'grid-cols-12'
      }
    },
    form: {
      base: '',
      layouts: {
        vertical: 'flex flex-col',
        horizontal: 'flex flex-row flex-wrap'
      },
      gaps: {
        none: 'gap-0',
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6'
      }
    },
    image: {
      base: '',
      objectFit: {
        contain: 'object-contain',
        cover: 'object-cover',
        fill: 'object-fill',
        none: 'object-none',
        scaleDown: 'object-scale-down'
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
      }
    }
  }
};
