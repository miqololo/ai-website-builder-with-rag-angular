import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-testimonials-with-bento-grid-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PTextComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="relative isolate">
        <div aria-hidden="true" class="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl">
          <div [ngClass]="getDecorativeBlobClasses()" class="ml-[max(50%,38rem)] aspect-[1313/771] w-[328.25px] [clip-path:polygon(74.1%_44.1%,100%_61.6%,97.5%_26.9%,85.5%_0.1%,80.7%_2%,72.5%_32.5%,60.2%_62.4%,52.4%_68.1%,47.5%_58.3%,45.2%_34.5%,27.5%_76.7%,0.1%_64.9%,17.9%_100%,27.6%_76.8%,76.1%_97.7%,74.1%_44.1%)]"></div>
        </div>
        <div class="mx-auto max-w-2xl text-center">
          <h2 [class]="getBadgeClasses()">{{ getBadge() }}</h2>
          <p [class]="getTitleClasses()">{{ getTitle() }}</p>
        </div>
        <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          <figure [class]="getFeaturedFigureClasses()">
            <blockquote [class]="getFeaturedQuoteClasses()">
              <p>&ldquo;{{ getFeatured().quote }}&rdquo;</p>
            </blockquote>
            <figcaption [class]="getFigcaptionClasses()">
              <img [src]="getFeatured().avatar" [alt]="getFeatured().name" [class]="getFeaturedAvatarClasses()" />
              <div class="flex-auto">
                <div [class]="getNameClasses()">{{ getFeatured().name }}</div>
                <div [class]="getHandleClasses()">{{ getFeatured().handle }}</div>
              </div>
              @if (getFeatured().logoLight) {
                <img [src]="getFeatured().logoLight" alt="" class="h-10 w-auto flex-none dark:hidden" />
              }
              @if (getFeatured().logoDark) {
                <img [src]="getFeatured().logoDark" alt="" class="h-10 w-auto flex-none hidden dark:block" />
              }
            </figcaption>
          </figure>
          <div class="space-y-8 xl:contents xl:space-y-0">
            <div class="space-y-8 xl:row-span-2">
              @for (t of getLeftColumn(); track t.name) {
                <figure [class]="getFigureClasses()">
                  <blockquote [class]="getBlockquoteClasses()">
                    <p>&ldquo;{{ t.quote }}&rdquo;</p>
                  </blockquote>
                  <figcaption class="mt-6 flex items-center gap-x-4">
                    <img [src]="t.avatar" [alt]="t.name" [class]="getAvatarClasses()" />
                    <div>
                      <div [class]="getNameClasses()">{{ t.name }}</div>
                      <div [class]="getHandleClasses()">{{ t.handle }}</div>
                    </div>
                  </figcaption>
                </figure>
              }
            </div>
            <div class="space-y-8 xl:row-start-1">
              @for (t of getRightTopColumn(); track t.name) {
                <figure [class]="getFigureClasses()">
                  <blockquote [class]="getBlockquoteClasses()">
                    <p>&ldquo;{{ t.quote }}&rdquo;</p>
                  </blockquote>
                  <figcaption class="mt-6 flex items-center gap-x-4">
                    <img [src]="t.avatar" [alt]="t.name" [class]="getAvatarClasses()" />
                    <div>
                      <div [class]="getNameClasses()">{{ t.name }}</div>
                      <div [class]="getHandleClasses()">{{ t.handle }}</div>
                    </div>
                  </figcaption>
                </figure>
              }
            </div>
          </div>
          <div class="space-y-8 xl:contents xl:space-y-0">
            <div class="space-y-8 xl:row-start-1">
              @for (t of getRightCol2Top(); track t.name) {
                <figure [class]="getFigureClasses()">
                  <blockquote [class]="getBlockquoteClasses()">
                    <p>&ldquo;{{ t.quote }}&rdquo;</p>
                  </blockquote>
                  <figcaption class="mt-6 flex items-center gap-x-4">
                    <img [src]="t.avatar" [alt]="t.name" [class]="getAvatarClasses()" />
                    <div>
                      <div [class]="getNameClasses()">{{ t.name }}</div>
                      <div [class]="getHandleClasses()">{{ t.handle }}</div>
                    </div>
                  </figcaption>
                </figure>
              }
            </div>
            <div class="space-y-8 xl:row-span-2">
              @for (t of getRightCol2Bottom(); track t.name) {
                <figure [class]="getFigureClasses()">
                  <blockquote [class]="getBlockquoteClasses()">
                    <p>&ldquo;{{ t.quote }}&rdquo;</p>
                  </blockquote>
                  <figcaption class="mt-6 flex items-center gap-x-4">
                    <img [src]="t.avatar" [alt]="t.name" [class]="getAvatarClasses()" />
                    <div>
                      <div [class]="getNameClasses()">{{ t.name }}</div>
                      <div [class]="getHandleClasses()">{{ t.handle }}</div>
                    </div>
                  </figcaption>
                </figure>
              }
            </div>
          </div>
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class TestimonialsWithBentoGridPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private readonly defaultTestimonials: Array<{ quote: string; name: string; handle: string; avatar: string }> = [
    { quote: 'Integer id nunc sit semper purus. Bibendum at lacus ut arcu blandit montes vitae auctor libero.', name: 'Brenna Goyette', handle: '@brennagoyette', avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?w=256&h=256&fit=crop&crop=face' },
    { quote: 'Laborum quis quam. Dolorum et ut quod quia. Voluptas numquam delectus nihil.', name: 'Leslie Alexander', handle: '@lesliealexander', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256&h=256&fit=crop&crop=face' },
    { quote: 'Quia dolorem qui et. Atque quo aliquid sit eos officia.', name: 'Michael Foster', handle: '@michaelfoster', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=256&h=256&fit=crop&crop=face' },
    { quote: 'Consequatur ut atque. Itaque nostrum molestiae id veniam eos cumque.', name: 'Dries Vincent', handle: '@driesvincent', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=256&h=256&fit=crop&crop=face' },
    { quote: 'Aut reprehenderit voluptatem eum asperiores beatae id.', name: 'Lindsay Walton', handle: '@lindsaywalton', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=256&h=256&fit=crop&crop=face' },
    { quote: 'Nam nesciunt dolorem dolor asperiores cum.', name: 'Courtney Henry', handle: '@courtneyhenry', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256&h=256&fit=crop&crop=face' },
    { quote: 'Voluptas quos itaque ipsam in voluptatem est.', name: 'Tom Cook', handle: '@tomcook', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=face' },
    { quote: 'Aliquid dolore praesentium ratione. Cumque ea officia repellendus laboriosam.', name: 'Whitney Francis', handle: '@whitneyfrancis', avatar: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?w=256&h=256&fit=crop&crop=face' },
    { quote: 'Molestias ea earum quos nostrum doloremque sed.', name: 'Leonard Krasner', handle: '@leonardkrasner', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=256&h=256&fit=crop&crop=face' },
    { quote: 'Architecto libero natus est. Est quam debitis officia enim atque et ut non.', name: 'Floyd Miles', handle: '@floydmiles', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=256&h=256&fit=crop&crop=face' },
    { quote: 'Temporibus ea molestiae impedit adipisci perspiciatis illo aliquid.', name: 'Emily Selman', handle: '@emilyselman', avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=256&h=256&fit=crop&crop=face' }
  ];

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getDecorativeBlobClasses(): string {
    return this.theme.getGradientClass('mesh');
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'white') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: ['pt-24 pb-32 sm:pt-32', ...(this.config?.classes ?? [])] as string[]
    };
  }

  getBadge(): string {
    return (this.getData()['badge'] as string) || 'Testimonials';
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'We have worked with thousands of amazing people';
  }

  getFeatured(): { quote: string; name: string; handle: string; avatar: string; logoLight?: string; logoDark?: string } {
    const f = this.getData()['featured'] as { quote?: string; name?: string; handle?: string; avatar?: string; logoLight?: string; logoDark?: string } | undefined;
    const d = this.defaultTestimonials[0];
    return {
      quote: f?.quote ?? d.quote,
      name: f?.name ?? d.name,
      handle: f?.handle ?? d.handle,
      avatar: f?.avatar ?? d.avatar,
      logoLight: f?.logoLight,
      logoDark: f?.logoDark
    };
  }

  private getTestimonialsList(): Array<{ quote: string; name: string; handle: string; avatar: string }> {
    return (this.getData()['testimonials'] as Array<{ quote: string; name: string; handle: string; avatar: string }>) ?? this.defaultTestimonials.slice(1);
  }

  getLeftColumn(): Array<{ quote: string; name: string; handle: string; avatar: string }> {
    return this.getTestimonialsList().slice(0, 3);
  }

  getRightTopColumn(): Array<{ quote: string; name: string; handle: string; avatar: string }> {
    return this.getTestimonialsList().slice(3, 5);
  }

  getRightCol2Top(): Array<{ quote: string; name: string; handle: string; avatar: string }> {
    return this.getTestimonialsList().slice(5, 7);
  }

  getRightCol2Bottom(): Array<{ quote: string; name: string; handle: string; avatar: string }> {
    return this.getTestimonialsList().slice(7, 10);
  }

  getBadgeClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-base font-semibold leading-7 text-${primary} dark:text-${primaryBase}-400`;
  }

  getTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `mt-2 text-4xl font-semibold tracking-tight text-${text} sm:text-5xl dark:text-white`;
  }

  getFeaturedFigureClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    const textBase = text.split('-')[0];
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    // Use semi-transparent white with backdrop blur and proper shadows
    return `rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-lg ring-1 ring-${textBase}-900/5 sm:col-span-2 xl:col-start-2 xl:row-end-1 dark:bg-${surfaceMutedDark}/95 dark:backdrop-blur-sm dark:shadow-lg dark:ring-white/10`;
  }

  getFigureClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    const textBase = text.split('-')[0];
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    // Use semi-transparent white with backdrop blur and proper shadows
    return `rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-lg ring-1 ring-${textBase}-900/5 dark:bg-${surfaceMutedDark}/95 dark:backdrop-blur-sm dark:shadow-lg dark:ring-white/10`;
  }

  getFeaturedQuoteClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-lg font-semibold tracking-tight text-${text} sm:p-12 sm:text-xl sm:leading-8 dark:text-white`;
  }

  getBlockquoteClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-${text} dark:text-white`;
  }

  getFigcaptionClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    const textBase = text.split('-')[0];
    return `flex flex-wrap items-center gap-x-4 gap-y-4 border-t border-${textBase}-900/10 px-6 py-4 sm:flex-nowrap dark:border-white/10`;
  }

  getAvatarClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `size-10 rounded-full bg-${surfaceMuted} dark:bg-${borderMutedDark}`;
  }

  getFeaturedAvatarClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `size-10 flex-none rounded-full bg-${surfaceMuted} dark:bg-${borderMutedDark}`;
  }

  getNameClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `font-semibold text-${text} dark:text-white`;
  }

  getHandleClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `text-${textMuted} dark:text-gray-400`;
  }
}
