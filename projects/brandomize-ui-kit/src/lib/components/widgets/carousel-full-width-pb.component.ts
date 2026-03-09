import { Component, Input, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ComponentRendererProxyComponent } from '@brandomize/core/components/component-renderer-proxy/component-renderer-proxy.component';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PIconComponent } from '@brandomize/primitives/p-icon/p-icon.component';
import { PButtonComponent, PButtonConfig } from '@brandomize/primitives/p-button/p-button.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

/**
 * Full-width carousel that receives any component configs as children and renders them as slides.
 * Features:
 * - Auto-play with configurable interval
 * - Optional navigation buttons with configurable positions
 * - Optional navigation dots
 * - Smooth transitions
 * - Button position changes on hover
 */
@Component({
  selector: 'bkit-carousel-full-width-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    ComponentRendererProxyComponent,
    PIconComponent,
    PButtonComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()" class=" transition-all duration-300 ">
      <div class="relative overflow-hidden" (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
        <div
          class="flex transition-transform duration-500 ease-in-out"
          [style.transform]="'translateX(-' + (currentIndex() * 100) + '%)'"
        >
          @for (slide of getSlides(); track slide.id || $index) {
            <div class="min-w-full flex-shrink-0 px-4 sm:px-6 lg:px-8">
              <bkit-component-renderer-proxy [config]="slide"></bkit-component-renderer-proxy>
            </div>
          }
        </div>

        @if (getSlides().length > 1) {
          @if (shouldShowButtons()) {
            <!-- Left button -->
            <bkit-button
              [config]="getPrevButtonConfig()"
              (click)="prev()"
            >
              <bkit-icon [config]="{ name: 'chevron-left', size: 20 }"></bkit-icon>
            </bkit-button>
            <!-- Right button -->
            <bkit-button
              [config]="getNextButtonConfig()"
              (click)="next()"
            >
              <bkit-icon [config]="{ name: 'chevron-right', size: 20 }"></bkit-icon>
            </bkit-button>
          }

          @if (shouldShowDots()) {
            <div [class]="getDotsContainerClasses()">
              @for (slide of getSlides(); track slide.id || $index) {
                <button
                  type="button"
                  (click)="goTo($index)"
                  [class]="getDotClasses($index)"
                  [attr.aria-label]="'Go to slide ' + ($index + 1)"
                ></button>
              }
            </div>
          }
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class CarouselFullWidthPbComponent implements OnInit, OnDestroy {
  @Input() config?: ComponentConfig;

  currentIndex = signal(0);
  isHovered = signal(false);
  private autoPlayInterval: ReturnType<typeof setInterval> | null = null;
  private pauseOnHover = true;
  private autoplayEnabled = false;

  constructor(public theme: ThemeService) {}

  getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'white') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'none') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: ['overflow-hidden', ...(this.config?.classes ?? [])] as string[]
    };
  }

  getSlides(): ComponentConfig[] {
    return (this.config?.children ?? []) as ComponentConfig[];
  }

  shouldShowButtons(): boolean {
    return (this.getData()['showArrows'] ?? true) === true;
  }

  shouldShowDots(): boolean {
    return (this.getData()['showDots'] ?? true) === true;
  }

  getButtonVisibilityClasses(): string {
    const visibility = this.isHovered() ? 'opacity-100 pointer-events-auto' : 'pointer-events-none';
    return `transition-opacity duration-300 ${visibility}`;
  }

  getNavButtonClasses(): string {
    const t = this.theme.themeResolved();
    const surface = t.colors?.surface ?? 'white';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const surfaceBase = surfaceDark.split('-')[0];
    return `rounded-full p-2.5 bg-${surface}/90 dark:bg-${surfaceBase}-800/90 shadow-lg ring-1 ring-${surfaceBase}-900/10 dark:ring-white/10 backdrop-blur-sm transition-all duration-300   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${surfaceBase}-500`;
  }

  getPrevButtonConfig(): PButtonConfig {
    const positionClasses = 'absolute transition-all duration-300  left-4 top-1/2 z-10';
    const navClasses = this.getNavButtonClasses();
    const visibilityClasses = this.getButtonVisibilityClasses();
    return {
      variant: 'ghost',
      ariaLabel: 'Previous slide',
      class: [positionClasses, navClasses, visibilityClasses].filter(Boolean)
    };
  }

  getNextButtonConfig(): PButtonConfig {
    const positionClasses = 'absolute transition-all duration-300 right-4 top-1/2 z-10';
    const navClasses = this.getNavButtonClasses();
    const visibilityClasses = this.getButtonVisibilityClasses();
    return {
      variant: 'ghost',
      ariaLabel: 'Next slide',
      class: [positionClasses, navClasses, visibilityClasses].filter(Boolean)
    };
  }

  getDotsContainerClasses(): string {
    const position = this.getData()['dotsPosition'] as 'top' | 'bottom' | undefined;
    return `flex justify-center gap-2 z-10 ${position === 'top' ? 'absolute top-4 left-1/2 -translate-x-1/2' : 'mt-6'}`;
  }

  prev(): void {
    const slides = this.getSlides();
    if (slides.length === 0) return;
    this.currentIndex.update(i => (i === 0 ? slides.length - 1 : i - 1));
    this.resetAutoplay();
  }

  next(): void {
    const slides = this.getSlides();
    if (slides.length === 0) return;
    this.currentIndex.update(i => (i >= slides.length - 1 ? 0 : i + 1));
    this.resetAutoplay();
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
    this.resetAutoplay();
  }

  getDotClasses(index: number): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const isActive = this.currentIndex() === index;
    const baseClasses = 'cursor-pointer duration-300 h-2 rounded-full transition-all';
    
    if (isActive) {
      // Active dot: use theme color dynamically
      return `${baseClasses} bg-${primary} w-6`;
    } else {
      // Inactive dots: use static classes that Tailwind can detect
      return `${baseClasses} bg-indigo-300 dark:bg-indigo-600 hover:bg-indigo-400 hover:w-4 w-2`;
    }
  }

  onMouseEnter(): void {
    this.isHovered.set(true);
    if (this.pauseOnHover && this.autoplayEnabled) {
      this.pauseAutoplay();
    }
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
    if (this.autoplayEnabled) {
      this.startAutoplay();
    }
  }

  getAutoplayInterval(): number {
    const interval = this.getData()['autoplay'] as number | undefined;
    return interval && interval > 0 ? interval : 5000; // Default 5 seconds
  }

  startAutoplay(): void {
    this.pauseAutoplay();
    const slides = this.getSlides();
    if (slides.length > 1 && (!this.isHovered() || !this.pauseOnHover)) {
      const interval = this.getAutoplayInterval();
      this.autoplayEnabled = true;
      this.autoPlayInterval = setInterval(() => {
        if (!this.isHovered() || !this.pauseOnHover) {
          this.next();
        }
      }, interval);
    }
  }

  pauseAutoplay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoplay(): void {
    if (this.autoplayEnabled) {
      this.pauseAutoplay();
      this.startAutoplay();
    }
  }

  ngOnInit(): void {
    this.pauseOnHover = (this.getData()['pauseOnHover'] ?? true) === true;
    const autoplay = this.getAutoplayInterval();
    if (autoplay > 0) {
      this.startAutoplay();
    }
  }

  ngOnDestroy(): void {
    this.pauseAutoplay();
  }
}
