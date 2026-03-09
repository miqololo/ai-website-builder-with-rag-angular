import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

/**
 * Animated grid - displays items in columns with smooth scroll animation (up or down).
 * Supports images, videos, and custom content. Configurable column count and animation speed.
 */
@Component({
  selector: 'bkit-animated-grid-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      @if (getTitle() || getSubtitle()) {
        <div class="mx-auto max-w-2xl text-center mb-16">
          <bkit-stack [config]="getHeaderStackConfig()">
            @if (getTitle()) {
              <bkit-text
                [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', align: 'center', color: getTitleColor() }"
              ></bkit-text>
            }
            @if (getSubtitle()) {
              <bkit-text
                [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', align: 'center', color: getSubtitleColor() }"
              ></bkit-text>
            }
          </bkit-stack>
        </div>
      }
      <div [class]="getGridClasses()">
        @for (col of getColumns(); track $index) {
          <div [class]="getColumnClasses()">
            <div
              class="animate-scroll flex flex-col gap-4 py-2"
              [class.animate-scroll-up]="getDirection() === 'up'"
              [class.animate-scroll-down]="getDirection() === 'down'"
              [style.animation-duration]="getColumnSpeed(col) + 's'"
              [style.animation-delay]="($index * -2) + 's'"
            >
              @for (item of col.items; track item.src || item.id || $index) {
                <div [class]="getItemCardClasses()">
                  @if (item.type === 'video') {
                    <video [src]="item.src" muted loop playsinline class="aspect-[3/4] w-full object-cover rounded-lg" (loadeddata)="playVideo($event)"></video>
                  } @else {
                    <img [src]="item.src" [alt]="item.alt || item.name || ''" class="aspect-[3/4] w-full object-cover rounded-lg" />
                  }
                  @if (item.caption || item.name) {
                    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-b-lg">
                      <p [class]="getCaptionClasses()">{{ item.caption || item.name }}{{ item.role ? ', ' + item.role : '' }}</p>
                    </div>
                  }
                </div>
              }
              @for (item of col.items; track 'dup-' + (item.src || item.id) + $index) {
                <div [class]="getItemCardClasses()">
                  @if (item.type === 'video') {
                    <video [src]="item.src" muted loop playsinline class="aspect-[3/4] w-full object-cover rounded-lg" (loadeddata)="playVideo($event)"></video>
                  } @else {
                    <img [src]="item.src" [alt]="item.alt || item.name || ''" class="aspect-[3/4] w-full object-cover rounded-lg" />
                  }
                  @if (item.caption || item.name) {
                    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-b-lg">
                      <p [class]="getCaptionClasses()">{{ item.caption || item.name }}{{ item.role ? ', ' + item.role : '' }}</p>
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
    .column-viewport {
      position: relative;
      mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
    }
    .animate-scroll-up {
      animation: scroll-up linear infinite;
    }
    .animate-scroll-down {
      animation: scroll-down linear infinite;
    }
    @keyframes scroll-up {
      0% { transform: translateY(0); }
      100% { transform: translateY(-50%); }
    }
    @keyframes scroll-down {
      0% { transform: translateY(-50%); }
      100% { transform: translateY(0); }
    }
  `]
})
export class AnimatedGridPbComponent {
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
      background: (d['background'] ?? 'dark') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: ['overflow-hidden', ...this.getSectionBgClasses(), ...(this.config?.classes ?? [])] as string[]
    };
  }

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) ?? '';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) ?? '';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'white');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-400';
    return textMutedLight;
  }

  getDirection(): 'up' | 'down' {
    return (this.getData()['direction'] as 'up' | 'down') ?? 'up';
  }

  getSectionBgClasses(): string[] {
    const t = this.theme.themeResolved();
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const surfaceBase = surfaceDark.split('-')[0];
    return [`!bg-${surfaceBase}-950`];
  }

  getGridClasses(): string {
    const cols = (this.getData()['columns'] as number) ?? 4;
    const colMap: Record<number, string> = {
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
      5: 'lg:grid-cols-5',
      6: 'lg:grid-cols-6'
    };
    return `mx-auto grid gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-3 ${colMap[Math.min(cols, 6)] ?? 'lg:grid-cols-4'}`;
  }

  getColumnClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    const surfaceBase = surfaceDark.split('-')[0];
    return `column-viewport h-64 overflow-hidden rounded-xl bg-${surfaceBase}-900/50 sm:h-80 lg:h-96`;
  }

  getItemCardClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `relative flex-shrink-0 overflow-hidden rounded-lg bg-${surfaceMutedDark}`;
  }

  getCaptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    const textMutedBase = textMuted.split('-')[0];
    return `text-xs font-medium text-white/90`;
  }

  getColumnSpeed(col: { speed?: number }): number {
    return col.speed ?? 20;
  }

  getColumns(): Array<{ items: Array<{ type?: 'image' | 'video'; src: string; alt?: string; name?: string; caption?: string; role?: string; id?: string }>; speed?: number }> {
    const cols = this.getData()['columnData'] as Array<{ items: Array<{ type?: 'image' | 'video'; src: string; alt?: string; name?: string; caption?: string; role?: string; id?: string }>; speed?: number }> | undefined;
    if (cols?.length) return cols;

    const defaultItems = [
      { type: 'image' as const, src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=533&fit=crop', name: 'Item 1' },
      { type: 'image' as const, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=533&fit=crop', name: 'Item 2' },
      { type: 'image' as const, src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=533&fit=crop', name: 'Item 3' },
      { type: 'image' as const, src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=533&fit=crop', name: 'Item 4' },
      { type: 'image' as const, src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=533&fit=crop', name: 'Item 5' }
    ];

    return [
      { items: defaultItems, speed: 25 },
      { items: [...defaultItems].reverse(), speed: 18 },
      { items: defaultItems, speed: 30 },
      { items: [...defaultItems].reverse(), speed: 22 }
    ];
  }
}
