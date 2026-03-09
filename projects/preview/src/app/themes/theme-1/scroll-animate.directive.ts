import { Directive, ElementRef, OnInit, OnDestroy, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[theme1ScrollAnimate]',
  standalone: true
})
export class ScrollAnimateDirective implements OnInit, AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;
  private hasAnimated = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Immediately add hidden state using inline style to prevent flash
    const element = this.el.nativeElement;
    this.renderer.setStyle(element, 'opacity', '0');
    this.renderer.setStyle(element, 'transform', 'translateY(30px)');
    this.renderer.addClass(element, 'scroll-animate-hidden');
  }

  ngAfterViewInit(): void {
    // Create intersection observer after view init
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only animate once - when element first appears in viewport
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            const element = this.el.nativeElement;
            // Remove inline styles
            this.renderer.removeStyle(element, 'opacity');
            this.renderer.removeStyle(element, 'transform');
            this.renderer.removeClass(element, 'scroll-animate-hidden');
            this.renderer.addClass(element, 'scroll-animate-visible');
            // Unobserve immediately after triggering to prevent any re-triggering
            this.observer?.unobserve(entry.target);
            // Disconnect observer completely to ensure no further observations
            this.observer?.disconnect();
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation slightly before element enters viewport
      }
    );

    // Start observing
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
