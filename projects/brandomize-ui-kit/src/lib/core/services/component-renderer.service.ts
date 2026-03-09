import { Injectable, Type } from '@angular/core';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';

/**
 * Service that maps component type strings to their Angular component classes.
 * Used by ComponentRendererComponent to dynamically render compositions.
 */
@Injectable({
  providedIn: 'root'
})
export class ComponentRendererService {
  private readonly componentRegistry = new Map<string, Type<unknown>>();
  private componentsRegistered = false;

  constructor() {
    // Delay initialization to avoid circular dependencies
    // Components will be registered lazily on first access
  }

  /**
   * Register all composition components (lazy initialization)
   */
  private registerComponents(): void {
    if (this.componentsRegistered) {
      return;
    }
    this.componentsRegistered = true;

    // Use dynamic import to avoid circular dependencies at module load time
    // This function will be called lazily when components are first accessed
    import('@brandomize/components').then((Compositions) => {
      // Hero Banners
      this.register('hero-simple-centered-pb', Compositions.HeroSimpleCenteredPbComponent);
      this.register('hero-split-with-image-pb', Compositions.HeroSplitWithImagePbComponent);
      this.register('hero-split-with-screenshot-pb', Compositions.HeroSplitWithScreenshotPbComponent);
      this.register('hero-with-angled-image-right-pb', Compositions.HeroWithAngledImageRightPbComponent);
      this.register('hero-with-image-tiles-pb', Compositions.HeroWithImageTilesPbComponent);

      // Headers
      this.register('header-minimal-pb', Compositions.HeaderMinimalPbComponent);
      this.register('header-with-cta-pb', Compositions.HeaderWithCtaPbComponent);
      this.register('header-megamenu-pb', Compositions.HeaderMegamenuPbComponent);
      this.register('header-menu-with-icons-pb', Compositions.HeaderMenuWithIconsPbComponent);
      this.register('header-multilevel-pb', Compositions.HeaderMultilevelPbComponent);
      this.register('header-transparent-pb', Compositions.HeaderTransparentPbComponent);

      // Stats
      this.register('stats-minimal-pb', Compositions.StatsMinimalPbComponent);
      this.register('stats-simple-grid-pb', Compositions.StatsSimpleGridPbComponent);
      this.register('stats-with-icons-pb', Compositions.StatsWithIconsPbComponent);
      this.register('stats-bento-pb', Compositions.StatsBentoPbComponent);
      this.register('stats-with-gradient-pb', Compositions.StatsWithGradientPbComponent);

      // Features
      this.register('features-minimal-centered-pb', Compositions.FeaturesMinimalCenteredPbComponent);
      this.register('features-grid-with-icons-pb', Compositions.FeaturesGridWithIconsPbComponent);
      this.register('features-list-with-descriptions-pb', Compositions.FeaturesListWithDescriptionsPbComponent);
      this.register('features-cards-with-hover-pb', Compositions.FeaturesCardsWithHoverPbComponent);
      this.register('features-split-image-pb', Compositions.FeaturesSplitImagePbComponent);
      this.register('features-split-with-images-pb', Compositions.FeaturesSplitWithImagesPbComponent);

      // Pricing
      this.register('pricing-minimal-pb', Compositions.PricingMinimalPbComponent);
      this.register('pricing-simple-cards-pb', Compositions.PricingSimpleCardsPbComponent);
      this.register('pricing-comparison-table-pb', Compositions.PricingComparisonTablePbComponent);
      this.register('pricing-featured-plan-pb', Compositions.PricingFeaturedPlanPbComponent);
      this.register('pricing-with-toggle-pb', Compositions.PricingWithTogglePbComponent);

      // Testimonials
      this.register('testimonials-minimal-pb', Compositions.TestimonialsMinimalPbComponent);
      this.register('testimonials-simple-cards-pb', Compositions.TestimonialsSimpleCardsPbComponent);
      this.register('testimonials-featured-pb', Compositions.TestimonialsFeaturedPbComponent);
      this.register('testimonials-with-gradient-pb', Compositions.TestimonialsWithGradientPbComponent);
      this.register('testimonials-with-quote-icon-pb', Compositions.TestimonialsWithQuoteIconPbComponent);
      this.register('testimonials-with-overlapping-image-pb', Compositions.TestimonialsWithOverlappingImagePbComponent);
      this.register('testimonials-with-bento-grid-pb', Compositions.TestimonialsWithBentoGridPbComponent);
      this.register('testimonials-videos-images-animated-pb', Compositions.TestimonialsVideosImagesAnimatedPbComponent);

      // Widgets
      this.register('carousel-full-width-pb', Compositions.CarouselFullWidthPbComponent);
      this.register('carousel-infinite-scroll-pb', Compositions.CarouselInfiniteScrollPbComponent);
      this.register('animated-grid-pb', Compositions.AnimatedGridPbComponent);
      this.register('contact-with-map-pb', Compositions.ContactWithMapPbComponent);

      // Team
      this.register('team-grid-cards-pb', Compositions.TeamGridCardsPbComponent);
      this.register('team-minimal-list-pb', Compositions.TeamMinimalListPbComponent);
      this.register('team-alternating-pb', Compositions.TeamAlternatingPbComponent);
      this.register('team-overlapping-avatars-pb', Compositions.TeamOverlappingAvatarsPbComponent);
      this.register('team-with-gradient-pb', Compositions.TeamWithGradientPbComponent);
      // Note: TeamSocialLinksPbComponent is not exported - it's only used internally by other team components

      // FAQ
      this.register('faq-minimal-pb', Compositions.FaqMinimalPbComponent);
      this.register('faq-accordion-pb', Compositions.FaqAccordionPbComponent);
      this.register('faq-split-pb', Compositions.FaqSplitPbComponent);
      this.register('faq-split-qa-pb', Compositions.FaqSplitQaPbComponent);
      this.register('faq-with-gradient-pb', Compositions.FaqWithGradientPbComponent);
      this.register('faq-with-icons-pb', Compositions.FaqWithIconsPbComponent);

      // CTA
      this.register('cta-centered-pb', Compositions.CtaCenteredPbComponent);
      this.register('cta-minimal-pb', Compositions.CtaMinimalPbComponent);
      this.register('cta-gradient-pb', Compositions.CtaGradientPbComponent);
      this.register('cta-split-pb', Compositions.CtaSplitPbComponent);
      this.register('cta-with-image-pb', Compositions.CtaWithImagePbComponent);
      this.register('cta-with-stats-pb', Compositions.CtaWithStatsPbComponent);

      // Newsletter
      this.register('newsletter-centered-pb', Compositions.NewsletterCenteredPbComponent);
      this.register('newsletter-compact-pb', Compositions.NewsletterCompactPbComponent);
      this.register('newsletter-minimal-pb', Compositions.NewsletterMinimalPbComponent);
      this.register('newsletter-split-pb', Compositions.NewsletterSplitPbComponent);

      // Logo Cloud
      this.register('logo-cloud-minimal-pb', Compositions.LogoCloudMinimalPbComponent);
      this.register('logo-cloud-centered-pb', Compositions.LogoCloudCenteredPbComponent);
      this.register('logo-cloud-bordered-pb', Compositions.LogoCloudBorderedPbComponent);
      this.register('logo-cloud-compact-pb', Compositions.LogoCloudCompactPbComponent);
      this.register('logo-cloud-grayscale-pb', Compositions.LogoCloudGrayscalePbComponent);
      this.register('logo-cloud-with-gradient-pb', Compositions.LogoCloudWithGradientPbComponent);

      // Footer
      this.register('footer-minimal-pb', Compositions.FooterMinimalPbComponent);
      this.register('footer-centered-pb', Compositions.FooterCenteredPbComponent);
      this.register('footer-multi-column-pb', Compositions.FooterMultiColumnPbComponent);
      this.register('footer-with-gradient-pb', Compositions.FooterWithGradientPbComponent);
      this.register('footer-with-newsletter-pb', Compositions.FooterWithNewsletterPbComponent);
      this.register('footer-with-social-links-pb', Compositions.FooterWithSocialLinksPbComponent);

      // How It Works
      this.register('how-it-works-numbered-circles-pb', Compositions.HowItWorksNumberedCirclesPbComponent);
      this.register('how-it-works-bento-steps-pb', Compositions.HowItWorksBentoStepsPbComponent);
      this.register('how-it-works-horizontal-cards-pb', Compositions.HowItWorksHorizontalCardsPbComponent);
      this.register('how-it-works-vertical-timeline-pb', Compositions.HowItWorksVerticalTimelinePbComponent);
      this.register('how-it-works-with-icons-pb', Compositions.HowItWorksWithIconsPbComponent);

      // Bento Grids
      this.register('bento-minimal-pb', Compositions.BentoMinimalPbComponent);
      this.register('bento-classic-pb', Compositions.BentoClassicPbComponent);
      this.register('bento-asymmetric-pb', Compositions.BentoAsymmetricPbComponent);
      this.register('bento-with-images-pb', Compositions.BentoWithImagesPbComponent);
      this.register('bento-colorful-pb', Compositions.BentoColorfulPbComponent);

      // Blog
      this.register('blog-simple-cards-pb', Compositions.BlogSimpleCardsPbComponent);
      this.register('blog-minimal-list-pb', Compositions.BlogMinimalListPbComponent);
      this.register('blog-featured-grid-pb', Compositions.BlogFeaturedGridPbComponent);
      this.register('blog-masonry-pb', Compositions.BlogMasonryPbComponent);
      this.register('blog-with-categories-pb', Compositions.BlogWithCategoriesPbComponent);
      this.register('blog-with-gradient-pb', Compositions.BlogWithGradientPbComponent);

      // Not Found
      this.register('not-found-centered-pb', Compositions.NotFoundCenteredPbComponent);
      this.register('not-found-minimal-pb', Compositions.NotFoundMinimalPbComponent);
      this.register('not-found-humorous-pb', Compositions.NotFoundHumorousPbComponent);
      this.register('not-found-with-gradient-pb', Compositions.NotFoundWithGradientPbComponent);
      this.register('not-found-with-illustration-pb', Compositions.NotFoundWithIllustrationPbComponent);
      this.register('not-found-with-search-pb', Compositions.NotFoundWithSearchPbComponent);

      // Register header-mega-menu if it exists (using dynamic import)
      // Note: This component is in components-html, not compositions, so it's registered separately if needed
    }).catch((error) => {
      console.error('Failed to load composition components:', error);
      this.componentsRegistered = false;
    });
  }

  /**
   * Register a component type
   */
  register(type: string, component: Type<unknown>): void {
    this.componentRegistry.set(type, component);
  }

  /**
   * Get component class for a type
   * Note: Components are loaded asynchronously, so this may return null initially.
   * The ComponentRendererComponent handles this by retrying after components load.
   */
  getComponent(type: string): Type<unknown> | null {
    // Trigger lazy loading if not yet registered
    if (!this.componentsRegistered) {
      this.registerComponents();
      // Return null initially - components will be available after async load
      return null;
    }
    return this.componentRegistry.get(type) ?? null;
  }

  /**
   * Check if a component type is registered
   */
  hasComponent(type: string): boolean {
    // Trigger lazy loading if not yet registered
    if (!this.componentsRegistered) {
      this.registerComponents();
    }
    return this.componentRegistry.has(type);
  }

  /**
   * Get all registered component types
   */
  getRegisteredTypes(): string[] {
    // Trigger lazy loading if not yet registered
    if (!this.componentsRegistered) {
      this.registerComponents();
    }
    return Array.from(this.componentRegistry.keys());
  }
}
