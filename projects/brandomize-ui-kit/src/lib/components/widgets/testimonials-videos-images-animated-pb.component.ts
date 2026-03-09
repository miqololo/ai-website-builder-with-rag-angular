import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

/**
 * Testimonials / videos / images animated widget - vertical scrolling columns of media with captions.
 * Moved to widgets folder for reuse as a general-purpose animated media grid.
 */
@Component({
  selector: 'bkit-testimonials-videos-images-animated-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="mx-auto max-w-2xl text-center">
        <bkit-stack [config]="getHeaderStackConfig()">
          <bkit-text
            [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', align: 'center', color: 'white' }"
          ></bkit-text>
          <bkit-text
            [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', align: 'center', color: getSubtitleColor() }"
          ></bkit-text>
        </bkit-stack>
      </div>
      <div class="mx-auto mt-16 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
        @for (col of getColumns(); track $index) {
          <div [class]="getColumnClasses()">
            <div
              class="animate-scroll-up flex flex-col gap-4 py-2"
              [style.animation-duration]="getColumnSpeed(col) + 's'"
              [style.animation-delay]="($index * -2) + 's'"
            >
              @for (item of col.items; track item.src + $index) {
                <div [class]="getMediaCardClasses()">
                  @if (item.type === 'video') {
                    <video [src]="item.src" muted loop playsinline class="aspect-[3/4] w-full object-cover" (loadeddata)="playVideo($event)"></video>
                  } @else {
                    <img [src]="item.src" [alt]="item.name || ''" class="aspect-[3/4] w-full object-cover" />
                  }
                  @if (item.quote || item.name) {
                    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      @if (item.quote) {
                        <p class="line-clamp-2 text-xs font-medium text-white">{{ item.quote }}</p>
                      }
                      @if (item.name) {
                        <p [class]="getCaptionClasses()">{{ item.name }}{{ item.role ? ', ' + item.role : '' }}</p>
                      }
                    </div>
                  }
                </div>
              }
              @for (item of col.items; track 'dup-' + item.src + $index) {
                <div [class]="getMediaCardClasses()">
                  @if (item.type === 'video') {
                    <video [src]="item.src" muted loop playsinline class="aspect-[3/4] w-full object-cover" (loadeddata)="playVideo($event)"></video>
                  } @else {
                    <img [src]="item.src" [alt]="item.name || ''" class="aspect-[3/4] w-full object-cover" />
                  }
                  @if (item.quote || item.name) {
                    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      @if (item.quote) {
                        <p class="line-clamp-2 text-xs font-medium text-white">{{ item.quote }}</p>
                      }
                      @if (item.name) {
                        <p [class]="getCaptionClasses()">{{ item.name }}{{ item.role ? ', ' + item.role : '' }}</p>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: [`
    .media-card { position: relative; }
    .column-viewport {
      position: relative;
      mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
    }
    .animate-scroll-up {
      animation: scroll-up linear infinite;
    }
    @keyframes scroll-up {
      0% { transform: translateY(0); }
      100% { transform: translateY(-50%); }
    }
  `]
})
export class TestimonialsVideosImagesAnimatedPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  playVideo(e: Event): void {
    const video = e.target as HTMLVideoElement;
    video.play().catch(() => {});
  }

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: 'dark' as const,
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: ['overflow-hidden', ...this.getSectionBgClasses(), ...(this.config?.classes ?? [])] as string[]
    };
  }

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'See what our customers share';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Real stories from real people.';
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-400';
    return textMutedLight;
  }

  getSectionBgClasses(): string[] {
    const t = this.theme.themeResolved();
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const surfaceBase = surfaceDark.split('-')[0];
    return [`!bg-${surfaceBase}-950`];
  }

  getColumnClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const surfaceBase = surfaceDark.split('-')[0];
    return `column-viewport h-64 overflow-hidden rounded-xl bg-${surfaceBase}-900/50 sm:h-80 lg:h-96`;
  }

  getMediaCardClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `media-card flex-shrink-0 overflow-hidden rounded-lg bg-${surfaceMutedDark} relative`;
  }

  getCaptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    const textMutedBase = textMuted.split('-')[0];
    return `mt-1 text-xs text-${textMutedBase}-300`;
  }

  getColumnSpeed(col: { speed?: number }): number {
    return col.speed ?? 20;
  }

  getColumns(): Array<{ items: Array<{ type: 'image' | 'video'; src: string; quote?: string; name?: string; role?: string }>; speed?: number }> {
    const cols = this.getData()['columns'] as Array<{ items: Array<{ type: 'image' | 'video'; src: string; quote?: string; name?: string; role?: string }>; speed?: number }> | undefined;
    if (cols?.length) return cols;

    const defaultItems: Array<{ type: 'image' | 'video'; src: string; quote?: string; name?: string; role?: string }> = [
      { type: 'image', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=533&fit=crop', quote: 'Transformed how we work.', name: 'Sarah Chen', role: 'CEO' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=533&fit=crop', quote: '3x growth since switching.', name: 'Marcus Johnson', role: 'CTO' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=533&fit=crop', quote: 'Simple, fast, and reliable.', name: 'Emma Wilson', role: 'Product Lead' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=533&fit=crop', quote: "Best investment we've made.", name: 'Judith Black', role: 'Workcation' },
      { type: 'image', src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=533&fit=crop', quote: 'Outstanding support.', name: 'James Park', role: 'Founder' }
    ];

    return [
      { items: defaultItems, speed: 25 },
      { items: [...defaultItems].reverse(), speed: 18 },
      { items: defaultItems, speed: 30 },
      { items: [...defaultItems].reverse(), speed: 22 }
    ];
  }
}
