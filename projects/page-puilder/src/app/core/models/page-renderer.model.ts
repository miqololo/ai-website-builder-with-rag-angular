// Page renderer models for structured page rendering
export interface PageSection {
  id: string;
  component: string; // Component type identifier (e.g., 'hero', 'text', 'image', 'button', etc.)
  data?: Record<string, any>; // Component-specific data
  props?: Record<string, any>; // Component props
  children?: PageSection[]; // Nested sections
  className?: string; // Tailwind classes
  style?: Record<string, string>; // Inline styles
  px?: number; // Padding X
  py?: number; // Padding Y
  mx?: number; // Margin X
  my?: number; // Margin Y
  enableContainer?: boolean;
  enableSectionSpacing?: boolean;
  enableTitle?: boolean;
  enableBackgroundImage?: boolean;
  enableBackgroundMask?: boolean;
  enableSectionSmooth?: boolean;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundVideoUrl?: string;
  backgroundImagePosition?: string;
  backgroundImageFit?: string;
  title?: string;
  subtitle?: string;
  mobileOrder?: number;
}

export interface PageData {
  id: string;
  name: string;
  slug: string;
  layout: 'one' | 'full' | 'ltr' | 'rtl';
  sections: PageSection[];
  css?: string;
  js?: string;
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  };
  createdAt: Date;
}

export interface BackendPageData {
  _id: string;
  projectId: string;
  name: string;
  slug?: string;
  html?: string;
  css?: string;
  js?: string;
  data?: PageData; // Structured page data
  metadata?: any;
  order?: number;
  isHomePage?: boolean;
  createdAt: string;
  updatedAt: string;
}
