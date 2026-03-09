export type PreviewSize = 'mobile' | 'tablet' | 'desktop';

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    xlarge?: string;
  };
  fontSizes: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
    xxlarge?: string;
  };
  fontFamily: string;
  fontWeights?: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
  };
  lineHeights?: {
    tight: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
  letterSpacing?: {
    tight: string;
    normal: string;
    wide: string;
  };
  spacing?: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  shadows?: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions?: {
    fast: string;
    normal: string;
    slow: string;
  };
  zIndex?: {
    dropdown: number;
    sticky: number;
    fixed: number;
    modal: number;
    popover: number;
    tooltip: number;
  };
}

export interface Resource {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  uploadedAt: Date;
}

export interface Component {
  id: string;
  name: string;
  html: string;
  css?: string;
  type?: 'header' | 'footer' | 'page';
  createdAt: Date;
}

export interface Page {
  id: string;
  name: string;
  html: string;
  css?: string;
  js?: string;
  createdAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  html: string;
  css?: string;
}

export interface SelectedElement {
  type: 'section' | 'component';
  id: string;
  element: HTMLElement;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  selectedElement?: SelectedElement;
  isLoading?: boolean;
}

export type NavigationFeatureId = 
  | 'user-management' 
  | 'crm' 
  | 'payments' 
  | 'online-courses' 
  | 'merch-store' 
  | 'service-store' 
  | 'memberships' 
  | 'donations' 
  | 'sell-ticket' 
  | 'events';

export interface ButtonConfiguration {
  text: string;
  style: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'small' | 'medium' | 'large';
  icon?: string;
  position: 'left' | 'right' | 'center';
}

export interface NavigationFeature {
  id: NavigationFeatureId;
  name: string;
  enabled: boolean;
  buttonConfig?: ButtonConfiguration;
}

export interface HeaderConfiguration {
  enabled: boolean;
  // Add header-specific configuration here if needed
}

export interface FooterConfiguration {
  enabled: boolean;
  // Add footer-specific configuration here if needed
}

export interface NavigationSettings {
  header: HeaderConfiguration;
  footer: FooterConfiguration;
  features: NavigationFeature[];
}

export interface WebsiteSettings {
  logo?: string;
  favicon?: string;
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  language?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
  };
  contact: {
    email?: string;
    phone?: string;
    address?: string;
  };
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  analytics?: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
}
