import { Component, Input, ElementRef, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '@brandomize/core/theme/theme.service';

export interface PSectionConfig {
  background?: 'default' | 'muted' | 'white' | 'dark' | 'gradient' | 'gradientMuted' | 'pattern';
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundOverlay?: boolean;
  backgroundOverlayOpacity?: number;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  class?: string[];
  animateOnScroll?: boolean;
}

@Component({
  selector: 'bkit-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section 
      #sectionElement
      [class]="getSectionClasses()" 
      [attr.data-theme-bg]="getThemeBgVariant()" 
      [style]="getSectionStyles()"
      [class.section-scroll-animated]="isAnimated"
    >
      @if (hasBackgroundMedia()) {
        <div class="absolute inset-0 w-full h-full z-0" [style]="getBackgroundStyles()">
          @if (getBackgroundVideo()) {
            <video
              [src]="getBackgroundVideo()"
              autoplay
              loop
              muted
              playsinline
              class="absolute inset-0 w-full h-full object-cover"
            ></video>
          }           @else if (getBackgroundImage()) {
            <img [src]="getBackgroundImage()" class="absolute inset-0 h-full w-full object-cover" alt="" />
          }
          @if (hasOverlay()) {
            <div class="absolute inset-0 w-full h-full z-10 bg-black" [style.opacity]="getOverlayOpacity()"></div>
          }
        </div>
      }
      <div [class]="getContentWrapperClasses()">
        <div [class]="getContainerClasses()">
          <ng-content></ng-content>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* When section is scroll-animated, trigger animations on children with opacity-0 */
    .section-scroll-animated [class*="opacity-0"]:not([class*="animate-"]) {
      animation: fadeIn 0.6s ease-out forwards;
    }
    
    /* Ensure existing animation classes play */
    .section-scroll-animated [class*="animate-"] {
      animation-play-state: running !important;
    }
  `]
})
export class PSectionComponent implements AfterViewInit, OnDestroy {
  @Input() config?: PSectionConfig;
  @Input() background?: PSectionConfig['background'];
  @Input() padding?: PSectionConfig['padding'];
  @Input() maxWidth?: PSectionConfig['maxWidth'];
  @Input() animateOnScroll?: boolean;

  private intersectionObserver?: IntersectionObserver;
  isAnimated = false;

  constructor(
    public theme: ThemeService,
    private elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  hasBackgroundMedia(): boolean {
    return !!(this.config?.backgroundImage ?? this.config?.backgroundVideo);
  }

  hasOverlay(): boolean {
    return this.config?.backgroundOverlay ?? !!this.config?.backgroundOverlayOpacity;
  }

  getBackgroundImage(): string {
    return this.config?.backgroundImage ?? '';
  }

  getBackgroundVideo(): string {
    return this.config?.backgroundVideo ?? '';
  }

  getOverlayOpacity(): number {
    return this.config?.backgroundOverlayOpacity ?? 0.5;
  }

  getSectionStyles(): { [key: string]: string } {
    const styles: { [key: string]: string } = {};
    if (this.hasBackgroundMedia()) {
      styles['position'] = 'relative';
      styles['minHeight'] = 'min(100vh, 600px)';
    }
    return styles;
  }

  getBackgroundStyles(): { [key: string]: string } {
    return {};
  }

  getContentWrapperClasses(): string {
    return 'relative z-20';
  }

  getThemeBgVariant(): string | null {
    if (this.hasBackgroundMedia()) return null;
    const bg = this.config?.background ?? this.background ?? 'muted';
    const sb = this.theme.themeResolved().page?.sectionBackgrounds;
    return sb?.[bg as keyof typeof sb] ? String(bg) : null;
  }

  getSectionClasses(): string {
    const t = this.theme.themeResolved();
    const colors = t.colors ?? {};
    const bg = this.config?.background ?? this.background ?? 'muted';
    const pad = this.config?.padding ?? this.padding ?? 'lg';

    const surfaceDark = colors.surfaceDark ?? 'gray-900';
    const bgMap: Record<string, string> = {
      default: `bg-${colors.background ?? 'white'} dark:bg-${surfaceDark}`,
      muted: `bg-${colors.backgroundMuted ?? 'gray-50'} dark:bg-gray-950`,
      white: ' dark:bg-' + surfaceDark,
      dark: `bg-${surfaceDark} dark:bg-gray-950`
    };

    const padMap: Record<string, string> = {
      none: '',
      sm: 'py-12 sm:py-16',
      md: 'py-16 sm:py-20',
      lg: 'py-24 sm:py-32'
    };

    const sb = t.page?.sectionBackgrounds;
    const themeBgClass = (bg === 'gradient' || bg === 'gradientMuted') ? this.theme.getSectionBackgroundClass(bg) : (sb?.[bg as keyof typeof sb] ?? (bgMap[bg] ?? bgMap['muted']));

    const base = this.hasBackgroundMedia() ? 'relative' : '';
    // Parent component classes come first (can override theme classes)
    return `${(this.config?.class ?? []).join(' ')} ${base} ${themeBgClass} ${padMap[pad] ?? padMap['lg']}`.trim();
  }

  getContainerClasses(): string {
    const max = this.config?.maxWidth ?? this.maxWidth ?? '7xl';
    const maxMap: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '7xl': 'max-w-7xl',
      full: 'max-w-full'
    };
    return `mx-auto ${maxMap[max] ?? 'max-w-7xl'} px-6 lg:px-8`;
  }

  ngAfterViewInit(): void {
    // Default to true: enable scroll animations for all sections unless explicitly disabled
    const shouldAnimate = this.config?.animateOnScroll ?? this.animateOnScroll ?? true;
    if (shouldAnimate && isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const sectionElement = this.elementRef.nativeElement.querySelector('section');
    if (!sectionElement) return;

    // Create intersection observer with threshold to trigger when section is partially visible
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isAnimated) {
            // Section is in viewport - trigger animations on child elements
            this.triggerAnimations(entry.target as HTMLElement);
            // Disconnect after first trigger to prevent re-triggering on scroll
            this.intersectionObserver?.disconnect();
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of section is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before section fully enters viewport
      }
    );

    this.intersectionObserver.observe(sectionElement);
  }

  private triggerAnimations(sectionElement: HTMLElement): void {
    if (this.isAnimated) return; // Prevent multiple triggers

    this.isAnimated = true;

    // Find elements with opacity-0 that need animation
    const elementsWithOpacity = sectionElement.querySelectorAll('[class*="opacity-0"]');
    
    elementsWithOpacity.forEach((element) => {
      const el = element as HTMLElement;
      const classes = el.className;
      
      // If element has opacity-0 but no animation class, add fade-in animation
      if (classes.includes('opacity-0') && !classes.includes('animate-')) {
        // Check if it's a direct child of a component with animation preset
        const parent = el.parentElement;
        if (parent && parent.classList.toString().includes('animate-')) {
          // Parent has animation, let it handle it
          return;
        }
        
        // Add fade-in animation
        el.style.animation = 'fadeIn 0.6s ease-out forwards';
      }
    });

    // Trigger any existing animation classes that might be paused
    const animatedElements = sectionElement.querySelectorAll('[class*="animate-"]');
    animatedElements.forEach((element) => {
      const el = element as HTMLElement;
      // Ensure animations are set to play
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.animationPlayState === 'paused') {
        el.style.animationPlayState = 'running';
      }
    });
  }
}
