/**
 * Shared header types for JSON-driven header components.
 * All headers support: sticky, search bar, action buttons, mobile drawer (right-side).
 */

export interface HeaderNavLink {
  label: string;
  url?: string;
  target?: string;
  icon?: string; // Lucide icon name (kebab-case)
}

export interface HeaderNavLinkWithChildren extends HeaderNavLink {
  children?: HeaderNavItem[];
}

export type HeaderNavItem = HeaderNavLink | HeaderNavLinkWithChildren;

export interface HeaderMegamenuItem {
  label: string;
  url?: string;
  icon?: string;
  description?: string;
  /** Sub-items for categorized menu (e.g. "Billing" with items: Monthly, Annual) */
  items?: HeaderMegamenuItem[];
}

export interface HeaderMegamenuCategory {
  label: string;
  icon?: string;
  url?: string;
  description?: string;
  items: HeaderMegamenuItem[];
}

export interface HeaderActionButton {
  label: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  icon?: string;
  ariaLabel?: string;
}

export interface HeaderConfigData {
  brand?: string;
  brandLink?: string;
  logo?: string;
  sticky?: boolean;
  searchBar?: boolean;
  searchPlaceholder?: string;
  searchAction?: string; // URL or handler
  links?: HeaderNavItem[];
  megamenuCategories?: HeaderMegamenuCategory[];
  actions?: HeaderActionButton[];
  transparent?: boolean;
  centeredLogo?: boolean;
}
