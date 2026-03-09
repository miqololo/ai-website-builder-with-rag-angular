import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

/**
 * Infinite scroll carousel - smoothly animates left to right (or right to left) without stopping.
 * Ideal for: logo clouds, reviews, product showcases, testimonials strips.
 * Receives a list of items and renders each via the configured template type (image, text, card, etc.)
 */
@Component({
  selector: 'bkit-carousel-infinite-scroll-pb',
  standalone: true,
  imports: [CommonModule, PSectionComponent],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          class="flex gap-8 sm:gap-12 lg:gap-16"
          [class.animate-scroll-left]="getDirection() === 'left'"
          [class.animate-scroll-right]="getDirection() === 'right'"
          [style.animation-duration]="getSpeed() + 's'"
        >
          @for (item of getDuplicatedItems(); track $index) {
            <div [class]="getItemWrapperClasses()">
              @switch (getItemType()) {
                @case ('logo') {
                  @if (item['link']) {
                    <a
                      [href]="item['link']"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex shrink-0 items-center justify-center opacity-60 transition-opacity hover:opacity-100"
                    >
                      <img [src]="item['src']" [alt]="item['alt'] || ''" [class]="getLogoClasses()" />
                    </a>
                  } @else {
                    <img [src]="item['src']" [alt]="item['alt'] || ''" [class]="getLogoClasses() + ' opacity-60'" />
                  }
                }
                @case ('image') {
                  <img [src]="item['src']" [alt]="item['alt'] || ''" [class]="getImageClasses()" />
                }
                @case ('card') {
                  <div [class]="getCardClasses()">
                    @if (item['quote']) {
                      <p [class]="getQuoteClasses()">{{ item['quote'] }}</p>
                    }
                    @if (item['name'] || item['title']) {
                      <p [class]="getCaptionClasses()">{{ item['name'] || item['title'] }}{{ item['role'] ? ', ' + item['role'] : '' }}</p>
                    }
                  </div>
                }
                @default {
                  <div [class]="getDefaultItemClasses()">
                    @if (item['text']) {
                      <span>{{ item['text'] }}</span>
                    }
                    @if (item['src'] && !item['text']) {
                      <img [src]="item['src']" [alt]="item['alt'] || ''" [class]="getLogoClasses()" />
                    }
                  </div>
                }
              }
            </div>
          }
        </div>
      </div>
    </bkit-section>
  `,
  styles: [`
    .animate-scroll-left {
      animation: scroll-left linear infinite;
    }
    .animate-scroll-right {
      animation: scroll-right linear infinite;
    }
    @keyframes scroll-left {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes scroll-right {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0); }
    }
  `]
})
export class CarouselInfiniteScrollPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'white') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'md') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: ['overflow-hidden', ...(this.config?.classes ?? [])] as string[]
    };
  }

  getItemType(): 'logo' | 'image' | 'card' | 'text' {
    return (this.getData()['itemType'] as 'logo' | 'image' | 'card' | 'text') ?? 'logo';
  }

  getDirection(): 'left' | 'right' {
    return (this.getData()['direction'] as 'left' | 'right') ?? 'left';
  }

  getSpeed(): number {
    const speed = this.getData()['speed'] as number | undefined;
    return speed ?? 30;
  }

  getItems(): Array<{ src?: string; alt?: string; link?: string; text?: string; quote?: string; name?: string; title?: string; role?: string }> {
    return (this.getData()['items'] as Array<Record<string, unknown>>) ?? this.getDefaultItems();
  }

  getDuplicatedItems(): Array<Record<string, unknown>> {
    const items = this.getItems() as Array<Record<string, unknown>>;
    return [...items, ...items];
  }

  private getDefaultItems(): Array<Record<string, unknown>> {
    return [
      { src: 'https://via.placeholder.com/120x40?text=Logo+1', alt: 'Logo 1', link: '#' },
      { src: 'https://via.placeholder.com/120x40?text=Logo+2', alt: 'Logo 2', link: '#' },
      { src: 'https://via.placeholder.com/120x40?text=Logo+3', alt: 'Logo 3', link: '#' },
      { src: 'https://via.placeholder.com/120x40?text=Logo+4', alt: 'Logo 4', link: '#' },
      { src: 'https://via.placeholder.com/120x40?text=Logo+5', alt: 'Logo 5', link: '#' }
    ];
  }

  getItemWrapperClasses(): string {
    return 'flex shrink-0 items-center justify-center';
  }

  getLogoClasses(): string {
    return 'h-8 w-auto max-w-[120px] object-contain sm:h-10 sm:max-w-[140px]';
  }

  getImageClasses(): string {
    return 'h-16 w-auto max-w-[160px] object-contain sm:h-20';
  }

  getCardClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `flex min-w-[280px] max-w-[320px] flex-col rounded-xl bg-${surfaceMuted} p-6 shadow-sm dark:bg-${surfaceMutedDark}`;
  }

  getQuoteClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-sm text-${text} dark:text-white`;
  }

  getCaptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    const textMutedBase = textMuted.split('-')[0];
    return `mt-2 text-xs text-${textMutedBase}-500 dark:text-gray-400`;
  }

  getDefaultItemClasses(): string {
    return 'flex items-center justify-center px-4';
  }
}
