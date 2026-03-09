import { Injectable } from '@angular/core';
import { ComponentMetadata, ComponentCategory } from '@brandomize/core/types/component-metadata.types';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';

/**
 * Service that provides a catalog of available components with their metadata.
 * Used by the builder component to display available components and their configurations.
 */
@Injectable({
  providedIn: 'root'
})
export class ComponentCatalogService {
  private readonly components = new Map<string, ComponentMetadata>();
  private readonly categories: ComponentCategory[] = [];

  constructor() {
    this.initializeCatalog();
  }

  /**
   * Initialize the component catalog with all available components
   */
  private initializeCatalog(): void {
    // Hero Banners
    this.addComponent({
      id: 'hero-simple-centered-pb',
      name: 'Hero Simple Centered',
      description: 'A centered hero section with title, subtitle, and buttons',
      icon: 'sparkles',
      category: 'hero',
      parameters: [],
      defaultConfig: { type: 'hero-simple-centered-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'hero-split-with-image-pb',
      name: 'Hero Split with Image',
      description: 'Hero section with split layout and image',
      icon: 'sparkles',
      category: 'hero',
      parameters: [],
      defaultConfig: { type: 'hero-split-with-image-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'hero-split-with-screenshot-pb',
      name: 'Hero Split with Screenshot',
      description: 'Hero section with screenshot on the side',
      icon: 'sparkles',
      category: 'hero',
      parameters: [],
      defaultConfig: { type: 'hero-split-with-screenshot-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'hero-with-angled-image-right-pb',
      name: 'Hero with Angled Image',
      description: 'Hero section with angled image on the right',
      icon: 'sparkles',
      category: 'hero',
      parameters: [],
      defaultConfig: { type: 'hero-with-angled-image-right-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'hero-with-image-tiles-pb',
      name: 'Hero with Image Tiles',
      description: 'Hero section with image tiles',
      icon: 'sparkles',
      category: 'hero',
      parameters: [],
      defaultConfig: { type: 'hero-with-image-tiles-pb', data: {} } as ComponentConfig
    });

    // Headers
    this.addComponent({
      id: 'header-minimal-pb',
      name: 'Header Minimal',
      description: 'Minimal header with navigation links',
      icon: 'menu',
      category: 'header',
      parameters: [],
      defaultConfig: { type: 'header-minimal-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'header-with-cta-pb',
      name: 'Header with CTA',
      description: 'Header with call-to-action button',
      icon: 'menu',
      category: 'header',
      parameters: [],
      defaultConfig: { type: 'header-with-cta-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'header-megamenu-pb',
      name: 'Header Megamenu',
      description: 'Header with categories and icons in dropdown panels',
      icon: 'layout-grid',
      category: 'header',
      parameters: [],
      defaultConfig: {
        type: 'header-megamenu-pb',
        data: {
          brand: 'Brand',
          sticky: true,
          searchBar: true,
          megamenuCategories: [],
          actions: [{ label: 'Sign in', href: '#', variant: 'ghost' }, { label: 'Sign up', href: '#', variant: 'primary' }]
        }
      } as ComponentConfig
    });
    this.addComponent({
      id: 'header-menu-with-icons-pb',
      name: 'Header Menu with Icons',
      description: 'Header with navigation links and icons',
      icon: 'menu',
      category: 'header',
      parameters: [],
      defaultConfig: {
        type: 'header-menu-with-icons-pb',
        data: {
          brand: 'Brand',
          sticky: true,
          searchBar: false,
          links: [
            { label: 'Features', url: '#features', icon: 'sparkles' },
            { label: 'Pricing', url: '#pricing', icon: 'dollar-sign' },
            { label: 'About', url: '#about', icon: 'info' }
          ],
          actions: [{ label: 'Sign in', href: '#', variant: 'ghost' }, { label: 'Sign up', href: '#', variant: 'primary' }]
        }
      } as ComponentConfig
    });
    this.addComponent({
      id: 'header-multilevel-pb',
      name: 'Header Multilevel',
      description: 'Header with nested dropdown menus',
      icon: 'layers',
      category: 'header',
      parameters: [],
      defaultConfig: {
        type: 'header-multilevel-pb',
        data: {
          brand: 'Brand',
          sticky: true,
          links: [
            { label: 'Products', icon: 'box', children: [{ label: 'Overview', url: '#' }, { label: 'Pricing', url: '#' }] },
            { label: 'Resources', icon: 'book-open', children: [{ label: 'Docs', url: '#' }, { label: 'Blog', url: '#' }] },
            { label: 'Contact', url: '#contact' }
          ],
          actions: [{ label: 'Sign in', href: '#', variant: 'ghost' }, { label: 'Sign up', href: '#', variant: 'primary' }]
        }
      } as ComponentConfig
    });
    this.addComponent({
      id: 'header-transparent-pb',
      name: 'Header Transparent',
      description: 'Transparent header for hero sections',
      icon: 'maximize-2',
      category: 'header',
      parameters: [],
      defaultConfig: {
        type: 'header-transparent-pb',
        data: {
          brand: 'Brand',
          sticky: true,
          links: [
            { label: 'Features', url: '#features', icon: 'sparkles' },
            { label: 'Pricing', url: '#pricing', icon: 'dollar-sign' },
            { label: 'About', url: '#about', icon: 'info' }
          ],
          actions: [{ label: 'Sign in', href: '#', variant: 'ghost' }, { label: 'Sign up', href: '#', variant: 'primary' }]
        }
      } as ComponentConfig
    });
    // Stats
    this.addComponent({
      id: 'stats-minimal-pb',
      name: 'Stats Minimal',
      description: 'Minimal stats display',
      icon: 'bar-chart',
      category: 'stats',
      parameters: [],
      defaultConfig: { type: 'stats-minimal-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'stats-simple-grid-pb',
      name: 'Stats Simple Grid',
      description: 'Stats displayed in a simple grid layout',
      icon: 'bar-chart',
      category: 'stats',
      parameters: [],
      defaultConfig: { type: 'stats-simple-grid-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'stats-with-icons-pb',
      name: 'Stats with Icons',
      description: 'Stats with icon indicators',
      icon: 'bar-chart',
      category: 'stats',
      parameters: [],
      defaultConfig: { type: 'stats-with-icons-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'stats-bento-pb',
      name: 'Stats Bento',
      description: 'Stats in bento grid layout',
      icon: 'bar-chart',
      category: 'stats',
      parameters: [],
      defaultConfig: { type: 'stats-bento-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'stats-with-gradient-pb',
      name: 'Stats with Gradient',
      description: 'Stats with gradient background',
      icon: 'bar-chart',
      category: 'stats',
      parameters: [],
      defaultConfig: { type: 'stats-with-gradient-pb', data: {} } as ComponentConfig
    });

    // Features
    this.addComponent({
      id: 'features-minimal-centered-pb',
      name: 'Features Minimal Centered',
      description: 'Minimal centered features section',
      icon: 'grid',
      category: 'features',
      parameters: [],
      defaultConfig: { type: 'features-minimal-centered-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'features-grid-with-icons-pb',
      name: 'Features Grid with Icons',
      description: 'Features grid layout with icons',
      icon: 'grid',
      category: 'features',
      parameters: [],
      defaultConfig: { type: 'features-grid-with-icons-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'features-list-with-descriptions-pb',
      name: 'Features List',
      description: 'Features in list format with descriptions',
      icon: 'grid',
      category: 'features',
      parameters: [],
      defaultConfig: { type: 'features-list-with-descriptions-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'features-cards-with-hover-pb',
      name: 'Features Cards with Hover',
      description: 'Feature cards with hover effects',
      icon: 'grid',
      category: 'features',
      parameters: [],
      defaultConfig: { type: 'features-cards-with-hover-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'features-split-image-pb',
      name: 'Features Split Image',
      description: 'Features with split image layout',
      icon: 'grid',
      category: 'features',
      parameters: [],
      defaultConfig: { type: 'features-split-image-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'features-split-with-images-pb',
      name: 'Features Split with Images',
      description: 'Features with multiple images',
      icon: 'grid',
      category: 'features',
      parameters: [],
      defaultConfig: { type: 'features-split-with-images-pb', data: {} } as ComponentConfig
    });

    // Pricing
    this.addComponent({
      id: 'pricing-minimal-pb',
      name: 'Pricing Minimal',
      description: 'Minimal pricing section',
      icon: 'dollar-sign',
      category: 'pricing',
      parameters: [],
      defaultConfig: { type: 'pricing-minimal-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'pricing-simple-cards-pb',
      name: 'Pricing Simple Cards',
      description: 'Pricing plans as simple cards',
      icon: 'dollar-sign',
      category: 'pricing',
      parameters: [],
      defaultConfig: { type: 'pricing-simple-cards-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'pricing-comparison-table-pb',
      name: 'Pricing Comparison Table',
      description: 'Pricing comparison table',
      icon: 'dollar-sign',
      category: 'pricing',
      parameters: [],
      defaultConfig: { type: 'pricing-comparison-table-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'pricing-featured-plan-pb',
      name: 'Pricing Featured Plan',
      description: 'Pricing with featured plan highlight',
      icon: 'dollar-sign',
      category: 'pricing',
      parameters: [],
      defaultConfig: { type: 'pricing-featured-plan-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'pricing-with-toggle-pb',
      name: 'Pricing with Toggle',
      description: 'Pricing with monthly/yearly toggle',
      icon: 'dollar-sign',
      category: 'pricing',
      parameters: [],
      defaultConfig: { type: 'pricing-with-toggle-pb', data: {} } as ComponentConfig
    });

    // Testimonials
    this.addComponent({
      id: 'testimonials-minimal-pb',
      name: 'Testimonials Minimal',
      description: 'Minimal testimonials section',
      icon: 'message-circle',
      category: 'testimonials',
      parameters: [],
      defaultConfig: { type: 'testimonials-minimal-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'testimonials-simple-cards-pb',
      name: 'Testimonials Simple Cards',
      description: 'Testimonials as simple cards',
      icon: 'message-circle',
      category: 'testimonials',
      parameters: [],
      defaultConfig: { type: 'testimonials-simple-cards-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'testimonials-featured-pb',
      name: 'Testimonials Featured',
      description: 'Featured testimonials layout',
      icon: 'message-circle',
      category: 'testimonials',
      parameters: [],
      defaultConfig: { type: 'testimonials-featured-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'testimonials-with-gradient-pb',
      name: 'Testimonials with Gradient',
      description: 'Testimonials with gradient background',
      icon: 'message-circle',
      category: 'testimonials',
      parameters: [],
      defaultConfig: { type: 'testimonials-with-gradient-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'testimonials-with-quote-icon-pb',
      name: 'Testimonials with Quote Icon',
      description: 'Testimonials with quote icons',
      icon: 'message-circle',
      category: 'testimonials',
      parameters: [],
      defaultConfig: { type: 'testimonials-with-quote-icon-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'testimonials-with-overlapping-image-pb',
      name: 'Testimonials Overlapping Image',
      description: 'Testimonials with overlapping images',
      icon: 'message-circle',
      category: 'testimonials',
      parameters: [],
      defaultConfig: { type: 'testimonials-with-overlapping-image-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'testimonials-with-bento-grid-pb',
      name: 'Testimonials Bento Grid',
      description: 'Testimonials in bento grid layout',
      icon: 'message-circle',
      category: 'testimonials',
      parameters: [],
      defaultConfig: { type: 'testimonials-with-bento-grid-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'testimonials-videos-images-animated-pb',
      name: 'Testimonials Videos Images',
      description: 'Testimonials with videos and animated images',
      icon: 'message-circle',
      category: 'testimonials',
      parameters: [],
      defaultConfig: { type: 'testimonials-videos-images-animated-pb', data: {} } as ComponentConfig
    });

    // Widgets
    this.addComponent({
      id: 'carousel-full-width-pb',
      name: 'Carousel Full Width',
      description: 'Full-width carousel that receives any component as slides',
      icon: 'layout',
      category: 'widgets',
      parameters: [],
      defaultConfig: {
        type: 'carousel-full-width-pb',
        data: {
          showArrows: true,
          showDots: true,
          autoplay: 5000,
          pauseOnHover: true,
          buttonPosition: 'left-center',
          hoverButtonPosition: 'right-center',
          dotsPosition: 'bottom'
        },
        children: [
          {
            type: 'section',
            id: 'carousel-slide-1',
            data: { background: 'muted', padding: 'lg' },
            children: [
              {
                type: 'container',
                data: { maxWidth: '7xl', padding: 'md' },
                children: [
                  {
                    type: 'stack',
                    data: { gap: 'lg', alignItems: 'center', justifyContent: 'center' },
                    children: [
                      { type: 'text', data: { tag: 'h2', content: 'Welcome to Slide 1', size: '3xl', weight: 'bold', align: 'center' } },
                      { type: 'text', data: { tag: 'p', content: 'This is the first slide of the carousel. Add any component as a slide.', size: 'lg', align: 'center' } }
                    ]
                  }
                ]
              }
            ]
          } as ComponentConfig,
          {
            type: 'section',
            id: 'carousel-slide-2',
            data: { background: 'default', padding: 'lg' },
            children: [
              {
                type: 'container',
                data: { maxWidth: '7xl', padding: 'md' },
                children: [
                  {
                    type: 'stack',
                    data: { gap: 'lg', alignItems: 'center', justifyContent: 'center' },
                    children: [
                      { type: 'text', data: { tag: 'h2', content: 'Slide 2', size: '3xl', weight: 'bold', align: 'center' } },
                      { type: 'text', data: { tag: 'p', content: 'Use arrows or dots to navigate between slides.', size: 'lg', align: 'center' } }
                    ]
                  }
                ]
              }
            ]
          } as ComponentConfig,
          {
            type: 'section',
            id: 'carousel-slide-3',
            data: { background: 'muted', padding: 'lg' },
            children: [
              {
                type: 'container',
                data: { maxWidth: '7xl', padding: 'md' },
                children: [
                  {
                    type: 'stack',
                    data: { gap: 'lg', alignItems: 'center', justifyContent: 'center' },
                    children: [
                      { type: 'text', data: { tag: 'h2', content: 'Slide 3', size: '3xl', weight: 'bold', align: 'center' } },
                      { type: 'text', data: { tag: 'p', content: 'Replace these with hero sections, cards, or any other component.', size: 'lg', align: 'center' } }
                    ]
                  }
                ]
              }
            ]
          } as ComponentConfig
        ]
      } as ComponentConfig
    });
    this.addComponent({
      id: 'carousel-infinite-scroll-pb',
      name: 'Carousel Infinite Scroll',
      description: 'Smooth infinite scroll for logos, reviews, showcases',
      icon: 'repeat',
      category: 'widgets',
      parameters: [],
      defaultConfig: { type: 'carousel-infinite-scroll-pb', data: { itemType: 'logo', direction: 'left', speed: 30 } } as ComponentConfig
    });
    this.addComponent({
      id: 'animated-grid-pb',
      name: 'Animated Grid',
      description: 'Animated grid with scrolling columns',
      icon: 'grid',
      category: 'widgets',
      parameters: [],
      defaultConfig: { type: 'animated-grid-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'contact-with-map-pb',
      name: 'Contact with Map',
      description: 'Contact form with embedded map',
      icon: 'map-pin',
      category: 'contact-us',
      parameters: [],
      defaultConfig: { type: 'contact-with-map-pb', data: {} } as ComponentConfig
    });

    // Team
    this.addComponent({
      id: 'team-grid-cards-pb',
      name: 'Team Grid Cards',
      description: 'Team members in grid card layout',
      icon: 'users',
      category: 'team',
      parameters: [],
      defaultConfig: { type: 'team-grid-cards-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'team-minimal-list-pb',
      name: 'Team Minimal List',
      description: 'Team members in minimal list format',
      icon: 'users',
      category: 'team',
      parameters: [],
      defaultConfig: { type: 'team-minimal-list-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'team-alternating-pb',
      name: 'Team Alternating',
      description: 'Team members in alternating layout',
      icon: 'users',
      category: 'team',
      parameters: [],
      defaultConfig: { type: 'team-alternating-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'team-overlapping-avatars-pb',
      name: 'Team Overlapping Avatars',
      description: 'Team with overlapping avatar display',
      icon: 'users',
      category: 'team',
      parameters: [],
      defaultConfig: { type: 'team-overlapping-avatars-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'team-with-gradient-pb',
      name: 'Team with Gradient',
      description: 'Team section with gradient background',
      icon: 'users',
      category: 'team',
      parameters: [],
      defaultConfig: { type: 'team-with-gradient-pb', data: {} } as ComponentConfig
    });

    // FAQ
    this.addComponent({
      id: 'faq-minimal-pb',
      name: 'FAQ Minimal',
      description: 'Minimal FAQ section',
      icon: 'help-circle',
      category: 'faq',
      parameters: [],
      defaultConfig: { type: 'faq-minimal-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'faq-accordion-pb',
      name: 'FAQ Accordion',
      description: 'FAQ in accordion format',
      icon: 'help-circle',
      category: 'faq',
      parameters: [],
      defaultConfig: { type: 'faq-accordion-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'faq-split-pb',
      name: 'FAQ Split',
      description: 'FAQ with split layout',
      icon: 'help-circle',
      category: 'faq',
      parameters: [],
      defaultConfig: { type: 'faq-split-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'faq-split-qa-pb',
      name: 'FAQ Split Q&A',
      description: 'FAQ with split Q&A format',
      icon: 'help-circle',
      category: 'faq',
      parameters: [],
      defaultConfig: { type: 'faq-split-qa-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'faq-with-gradient-pb',
      name: 'FAQ with Gradient',
      description: 'FAQ with gradient background',
      icon: 'help-circle',
      category: 'faq',
      parameters: [],
      defaultConfig: { type: 'faq-with-gradient-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'faq-with-icons-pb',
      name: 'FAQ with Icons',
      description: 'FAQ with icon indicators',
      icon: 'help-circle',
      category: 'faq',
      parameters: [],
      defaultConfig: { type: 'faq-with-icons-pb', data: {} } as ComponentConfig
    });

    // CTA
    this.addComponent({
      id: 'cta-centered-pb',
      name: 'CTA Centered',
      description: 'Centered call-to-action section',
      icon: 'arrow-right',
      category: 'cta',
      parameters: [],
      defaultConfig: { type: 'cta-centered-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'cta-minimal-pb',
      name: 'CTA Minimal',
      description: 'Minimal call-to-action',
      icon: 'arrow-right',
      category: 'cta',
      parameters: [],
      defaultConfig: { type: 'cta-minimal-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'cta-gradient-pb',
      name: 'CTA Gradient',
      description: 'CTA with gradient background',
      icon: 'arrow-right',
      category: 'cta',
      parameters: [],
      defaultConfig: { type: 'cta-gradient-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'cta-split-pb',
      name: 'CTA Split',
      description: 'CTA with split layout',
      icon: 'arrow-right',
      category: 'cta',
      parameters: [],
      defaultConfig: { type: 'cta-split-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'cta-with-image-pb',
      name: 'CTA with Image',
      description: 'CTA section with image',
      icon: 'arrow-right',
      category: 'cta',
      parameters: [],
      defaultConfig: { type: 'cta-with-image-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'cta-with-stats-pb',
      name: 'CTA with Stats',
      description: 'CTA section with statistics',
      icon: 'arrow-right',
      category: 'cta',
      parameters: [],
      defaultConfig: { type: 'cta-with-stats-pb', data: {} } as ComponentConfig
    });

    // Newsletter
    this.addComponent({
      id: 'newsletter-centered-pb',
      name: 'Newsletter Centered',
      description: 'Centered newsletter signup',
      icon: 'mail',
      category: 'newsletter',
      parameters: [],
      defaultConfig: { type: 'newsletter-centered-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'newsletter-compact-pb',
      name: 'Newsletter Compact',
      description: 'Compact newsletter signup',
      icon: 'mail',
      category: 'newsletter',
      parameters: [],
      defaultConfig: { type: 'newsletter-compact-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'newsletter-minimal-pb',
      name: 'Newsletter Minimal',
      description: 'Minimal newsletter signup',
      icon: 'mail',
      category: 'newsletter',
      parameters: [],
      defaultConfig: { type: 'newsletter-minimal-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'newsletter-split-pb',
      name: 'Newsletter Split',
      description: 'Newsletter with split layout',
      icon: 'mail',
      category: 'newsletter',
      parameters: [],
      defaultConfig: { type: 'newsletter-split-pb', data: {} } as ComponentConfig
    });

    // Logo Cloud
    this.addComponent({
      id: 'logo-cloud-minimal-pb',
      name: 'Logo Cloud Minimal',
      description: 'Minimal logo cloud display',
      icon: 'image',
      category: 'logo-cloud',
      parameters: [],
      defaultConfig: { type: 'logo-cloud-minimal-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'logo-cloud-centered-pb',
      name: 'Logo Cloud Centered',
      description: 'Centered logo cloud',
      icon: 'image',
      category: 'logo-cloud',
      parameters: [],
      defaultConfig: { type: 'logo-cloud-centered-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'logo-cloud-bordered-pb',
      name: 'Logo Cloud Bordered',
      description: 'Logo cloud with borders',
      icon: 'image',
      category: 'logo-cloud',
      parameters: [],
      defaultConfig: { type: 'logo-cloud-bordered-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'logo-cloud-compact-pb',
      name: 'Logo Cloud Compact',
      description: 'Compact logo cloud',
      icon: 'image',
      category: 'logo-cloud',
      parameters: [],
      defaultConfig: { type: 'logo-cloud-compact-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'logo-cloud-grayscale-pb',
      name: 'Logo Cloud Grayscale',
      description: 'Grayscale logo cloud',
      icon: 'image',
      category: 'logo-cloud',
      parameters: [],
      defaultConfig: { type: 'logo-cloud-grayscale-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'logo-cloud-with-gradient-pb',
      name: 'Logo Cloud Gradient',
      description: 'Logo cloud with gradient',
      icon: 'image',
      category: 'logo-cloud',
      parameters: [],
      defaultConfig: { type: 'logo-cloud-with-gradient-pb', data: {} } as ComponentConfig
    });

    // Footer
    this.addComponent({
      id: 'footer-minimal-pb',
      name: 'Footer Minimal',
      description: 'Minimal footer',
      icon: 'layout',
      category: 'footer',
      parameters: [],
      defaultConfig: { type: 'footer-minimal-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'footer-centered-pb',
      name: 'Footer Centered',
      description: 'Centered footer',
      icon: 'layout',
      category: 'footer',
      parameters: [],
      defaultConfig: { type: 'footer-centered-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'footer-multi-column-pb',
      name: 'Footer Multi Column',
      description: 'Multi-column footer',
      icon: 'layout',
      category: 'footer',
      parameters: [],
      defaultConfig: { type: 'footer-multi-column-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'footer-with-gradient-pb',
      name: 'Footer with Gradient',
      description: 'Footer with gradient background',
      icon: 'layout',
      category: 'footer',
      parameters: [],
      defaultConfig: { type: 'footer-with-gradient-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'footer-with-newsletter-pb',
      name: 'Footer with Newsletter',
      description: 'Footer with newsletter signup',
      icon: 'layout',
      category: 'footer',
      parameters: [],
      defaultConfig: { type: 'footer-with-newsletter-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'footer-with-social-links-pb',
      name: 'Footer with Social Links',
      description: 'Footer with social media links',
      icon: 'layout',
      category: 'footer',
      parameters: [],
      defaultConfig: { type: 'footer-with-social-links-pb', data: {} } as ComponentConfig
    });

    // How It Works
    this.addComponent({
      id: 'how-it-works-numbered-circles-pb',
      name: 'How It Works Numbered',
      description: 'How it works with numbered circles',
      icon: 'settings',
      category: 'how-it-works',
      parameters: [],
      defaultConfig: { type: 'how-it-works-numbered-circles-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'how-it-works-bento-steps-pb',
      name: 'How It Works Bento Steps',
      description: 'How it works in bento steps layout',
      icon: 'settings',
      category: 'how-it-works',
      parameters: [],
      defaultConfig: { type: 'how-it-works-bento-steps-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'how-it-works-horizontal-cards-pb',
      name: 'How It Works Horizontal',
      description: 'How it works in horizontal cards',
      icon: 'settings',
      category: 'how-it-works',
      parameters: [],
      defaultConfig: { type: 'how-it-works-horizontal-cards-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'how-it-works-vertical-timeline-pb',
      name: 'How It Works Timeline',
      description: 'How it works in vertical timeline',
      icon: 'settings',
      category: 'how-it-works',
      parameters: [],
      defaultConfig: { type: 'how-it-works-vertical-timeline-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'how-it-works-with-icons-pb',
      name: 'How It Works with Icons',
      description: 'How it works with icon indicators',
      icon: 'settings',
      category: 'how-it-works',
      parameters: [],
      defaultConfig: { type: 'how-it-works-with-icons-pb', data: {} } as ComponentConfig
    });

    // Bento Grids
    this.addComponent({
      id: 'bento-minimal-pb',
      name: 'Bento Minimal',
      description: 'Minimal bento grid layout',
      icon: 'grid-3x3',
      category: 'bento',
      parameters: [],
      defaultConfig: { type: 'bento-minimal-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'bento-classic-pb',
      name: 'Bento Classic',
      description: 'Classic bento grid',
      icon: 'grid-3x3',
      category: 'bento',
      parameters: [],
      defaultConfig: { type: 'bento-classic-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'bento-asymmetric-pb',
      name: 'Bento Asymmetric',
      description: 'Asymmetric bento grid',
      icon: 'grid-3x3',
      category: 'bento',
      parameters: [],
      defaultConfig: { type: 'bento-asymmetric-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'bento-with-images-pb',
      name: 'Bento with Images',
      description: 'Bento grid with images',
      icon: 'grid-3x3',
      category: 'bento',
      parameters: [],
      defaultConfig: { type: 'bento-with-images-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'bento-colorful-pb',
      name: 'Bento Colorful',
      description: 'Colorful bento grid',
      icon: 'grid-3x3',
      category: 'bento',
      parameters: [],
      defaultConfig: { type: 'bento-colorful-pb', data: {} } as ComponentConfig
    });

    // Blog
    this.addComponent({
      id: 'blog-simple-cards-pb',
      name: 'Blog Simple Cards',
      description: 'Blog posts as simple cards',
      icon: 'file-text',
      category: 'blog',
      parameters: [],
      defaultConfig: { type: 'blog-simple-cards-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'blog-minimal-list-pb',
      name: 'Blog Minimal List',
      description: 'Blog posts in minimal list',
      icon: 'file-text',
      category: 'blog',
      parameters: [],
      defaultConfig: { type: 'blog-minimal-list-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'blog-featured-grid-pb',
      name: 'Blog Featured Grid',
      description: 'Blog with featured grid layout',
      icon: 'file-text',
      category: 'blog',
      parameters: [],
      defaultConfig: { type: 'blog-featured-grid-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'blog-masonry-pb',
      name: 'Blog Masonry',
      description: 'Blog in masonry layout',
      icon: 'file-text',
      category: 'blog',
      parameters: [],
      defaultConfig: { type: 'blog-masonry-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'blog-with-categories-pb',
      name: 'Blog with Categories',
      description: 'Blog with category filters',
      icon: 'file-text',
      category: 'blog',
      parameters: [],
      defaultConfig: { type: 'blog-with-categories-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'blog-with-gradient-pb',
      name: 'Blog with Gradient',
      description: 'Blog with gradient background',
      icon: 'file-text',
      category: 'blog',
      parameters: [],
      defaultConfig: { type: 'blog-with-gradient-pb', data: {} } as ComponentConfig
    });

    // Not Found
    this.addComponent({
      id: 'not-found-centered-pb',
      name: 'Not Found Centered',
      description: 'Centered 404 page',
      icon: 'alert-circle',
      category: 'not-found',
      parameters: [],
      defaultConfig: { type: 'not-found-centered-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'not-found-minimal-pb',
      name: 'Not Found Minimal',
      description: 'Minimal 404 page',
      icon: 'alert-circle',
      category: 'not-found',
      parameters: [],
      defaultConfig: { type: 'not-found-minimal-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'not-found-humorous-pb',
      name: 'Not Found Humorous',
      description: 'Humorous 404 page',
      icon: 'alert-circle',
      category: 'not-found',
      parameters: [],
      defaultConfig: { type: 'not-found-humorous-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'not-found-with-gradient-pb',
      name: 'Not Found Gradient',
      description: '404 page with gradient',
      icon: 'alert-circle',
      category: 'not-found',
      parameters: [],
      defaultConfig: { type: 'not-found-with-gradient-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'not-found-with-illustration-pb',
      name: 'Not Found Illustration',
      description: '404 page with illustration',
      icon: 'alert-circle',
      category: 'not-found',
      parameters: [],
      defaultConfig: { type: 'not-found-with-illustration-pb', data: {} } as ComponentConfig
    });
    this.addComponent({
      id: 'not-found-with-search-pb',
      name: 'Not Found with Search',
      description: '404 page with search',
      icon: 'alert-circle',
      category: 'not-found',
      parameters: [],
      defaultConfig: { type: 'not-found-with-search-pb', data: {} } as ComponentConfig
    });

    // Primitives - Layout
    this.addComponent({
      id: 'p-section',
      name: 'Section',
      description: 'Page section with background and padding',
      icon: 'layout',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'section', id: 'p-section', data: { padding: 'md' } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-container',
      name: 'Container',
      description: 'Content container with max-width',
      icon: 'layout',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'container', id: 'p-container', data: { maxWidth: '7xl', padding: 'md' } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-stack',
      name: 'Stack',
      description: 'Vertical flex layout',
      icon: 'layout',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'stack', id: 'p-stack', data: { gap: 'md' }, children: [] } as ComponentConfig
    });
    this.addComponent({
      id: 'p-row',
      name: 'Row',
      description: 'Horizontal flex layout',
      icon: 'layout',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'row', id: 'p-row', data: { gap: 'md', wrap: true }, children: [] } as ComponentConfig
    });
    this.addComponent({
      id: 'p-grid',
      name: 'Grid',
      description: 'CSS grid layout',
      icon: 'grid',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'grid', id: 'p-grid', data: { cols: 3, gap: 'md' }, children: [] } as ComponentConfig
    });
    this.addComponent({
      id: 'p-box',
      name: 'Box',
      description: 'Generic container with padding and styling',
      icon: 'box',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'box', id: 'p-box', data: { padding: 'md' } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-spacer',
      name: 'Spacer',
      description: 'Vertical or horizontal spacing',
      icon: 'plus',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'spacer', id: 'p-spacer', data: { size: 'md' } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-divider',
      name: 'Divider',
      description: 'Horizontal or vertical divider line',
      icon: 'minus',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'divider', id: 'p-divider', data: {} } as ComponentConfig
    });

    // Primitives - Content
    this.addComponent({
      id: 'p-text',
      name: 'Text',
      description: 'Text with typography options',
      icon: 'file-text',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'text', id: 'p-text', data: { content: 'Text content', tag: 'p', size: 'base' } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-image',
      name: 'Image',
      description: 'Image with src and alt',
      icon: 'image',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'image', id: 'p-image', data: { src: 'https://via.placeholder.com/400', alt: 'Image' } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-icon',
      name: 'Icon',
      description: 'Lucide icon',
      icon: 'star',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'icon', id: 'p-icon', data: { name: 'star', size: 24 } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-badge',
      name: 'Badge',
      description: 'Label or tag badge',
      icon: 'star',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'badge', id: 'p-badge', data: { label: 'Badge', variant: 'primary' } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-avatar',
      name: 'Avatar',
      description: 'User avatar image',
      icon: 'user',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'avatar', id: 'p-avatar', data: { src: 'https://via.placeholder.com/64', alt: 'Avatar' } } as ComponentConfig
    });

    // Primitives - Interactive
    this.addComponent({
      id: 'p-button',
      name: 'Button',
      description: 'Button or link button',
      icon: 'zap',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'button', id: 'p-button', data: { text: 'Button', variant: 'primary' } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-link',
      name: 'Link',
      description: 'Text or inline link',
      icon: 'arrow-right',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'link', id: 'p-link', data: { text: 'Link', href: '#' } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-card',
      name: 'Card',
      description: 'Card container with optional children',
      icon: 'layout',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'card', id: 'p-card', data: { variant: 'default', padding: 'md' }, children: [] } as ComponentConfig
    });

    // Primitives - Form
    this.addComponent({
      id: 'p-input',
      name: 'Input',
      description: 'Text input field',
      icon: 'settings',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'input', id: 'p-input', data: { label: 'Label', placeholder: 'Placeholder' } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-textarea',
      name: 'Textarea',
      description: 'Multi-line text input',
      icon: 'file-text',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'textarea', id: 'p-textarea', data: { label: 'Label', placeholder: 'Placeholder' } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-checkbox',
      name: 'Checkbox',
      description: 'Checkbox input',
      icon: 'circle-check',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'checkbox', id: 'p-checkbox', data: { label: 'Option', checked: false } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-radio',
      name: 'Radio',
      description: 'Radio button group',
      icon: 'circle',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'radio', id: 'p-radio', data: { name: 'group', options: [{ label: 'Option 1', value: '1' }] } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-dropdown',
      name: 'Dropdown',
      description: 'Select dropdown',
      icon: 'chevron-down',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'dropdown', id: 'p-dropdown', data: { label: 'Select', options: [] } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-form',
      name: 'Form',
      description: 'Form container',
      icon: 'file-text',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'form', id: 'p-form', data: {}, children: [] } as ComponentConfig
    });

    // Primitives - Other
    this.addComponent({
      id: 'p-chip',
      name: 'Chip',
      description: 'Removable chip/tag',
      icon: 'x',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'chip', id: 'p-chip', data: { label: 'Chip' } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-toggle',
      name: 'Toggle',
      description: 'Toggle switch',
      icon: 'settings',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'toggle', id: 'p-toggle', data: { label: 'Toggle', checked: false } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-slider',
      name: 'Slider',
      description: 'Range slider',
      icon: 'chart-bar',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'slider', id: 'p-slider', data: { min: 0, max: 100, value: 50 } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-progress',
      name: 'Progress',
      description: 'Progress bar',
      icon: 'chart-bar',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'progress', id: 'p-progress', data: { value: 50, max: 100 } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-alert',
      name: 'Alert',
      description: 'Alert message box',
      icon: 'alert-circle',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'alert', id: 'p-alert', data: { message: 'Alert message', variant: 'info' } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-accordion',
      name: 'Accordion',
      description: 'Collapsible accordion',
      icon: 'chevron-down',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'accordion', id: 'p-accordion', data: { items: [] } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-tabs',
      name: 'Tabs',
      description: 'Tabbed content',
      icon: 'layout',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'tabs', id: 'p-tabs', data: { items: [] } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-modal',
      name: 'Modal',
      description: 'Modal dialog',
      icon: 'layout',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'modal', id: 'p-modal', data: { title: 'Modal', open: false } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-breadcrumb',
      name: 'Breadcrumb',
      description: 'Breadcrumb navigation',
      icon: 'menu',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'breadcrumb', id: 'p-breadcrumb', data: { items: [] } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-video',
      name: 'Video',
      description: 'Video embed',
      icon: 'image',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'video', id: 'p-video', data: { src: '' } } as ComponentConfig
    });
    this.addComponent({
      id: 'p-embed',
      name: 'Embed',
      description: 'Embedded content (iframe)',
      icon: 'code',
      category: 'primitives',
      parameters: [],
      defaultConfig: { type: 'embed', id: 'p-embed', data: { src: '' } } as ComponentConfig
    });
  }

  /**
   * Add a component to the catalog
   */
  private addComponent(metadata: ComponentMetadata): void {
    this.components.set(metadata.id, metadata);
    
    // Add to category
    let category = this.categories.find(c => c.id === (metadata.category || 'general'));
    if (!category) {
      category = {
        id: metadata.category || 'general',
        name: this.formatCategoryName(metadata.category || 'general'),
        icon: this.getCategoryIcon(metadata.category || 'general'),
        components: []
      };
      this.categories.push(category);
    }
    category.components.push(metadata);
  }

  /**
   * Get a component by ID
   */
  getComponent(id: string): ComponentMetadata | null {
    return this.components.get(id) ?? null;
  }

  /**
   * Get all categories
   */
  getCategories(): ComponentCategory[] {
    return [...this.categories];
  }

  /**
   * Get all components
   */
  getAllComponents(): ComponentMetadata[] {
    return Array.from(this.components.values());
  }

  private formatCategoryName(category: string): string {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      hero: 'sparkles',
      stats: 'bar-chart',
      features: 'grid',
      pricing: 'dollar-sign',
      testimonials: 'message-circle',
      team: 'users',
      faq: 'help-circle',
      cta: 'arrow-right',
      newsletter: 'mail',
      header: 'menu',
      footer: 'layout',
      'logo-cloud': 'image',
      'how-it-works': 'settings',
      bento: 'grid-3x3',
      blog: 'file-text',
      'not-found': 'alert-circle',
      primitives: 'box',
      widgets: 'layout',
      'contact-us': 'map-pin'
    };
    return icons[category] || 'box';
  }
}
