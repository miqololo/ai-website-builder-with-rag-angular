import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PImageComponent } from '@brandomize/primitives/p-image/p-image.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-blog-with-gradient-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PImageComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="relative mx-auto max-w-2xl text-center">
        <bkit-stack [config]="getHeaderStackConfig()">
          <bkit-text
            [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', align: 'center', color: 'white' }"
          ></bkit-text>
          <bkit-text
            [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', align: 'center', color: getSubtitleColor() }"
          ></bkit-text>
        </bkit-stack>
      </div>
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3">
        @for (post of getPosts(); track $index) {
          <article class="group">
            <a [href]="post.link || '#'" class="block overflow-hidden rounded-2xl  backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:bg-white/20">
              <div class="aspect-[16/10] overflow-hidden">
                <bkit-image
                  [config]="{
                    src: post.image,
                    alt: post.title,
                    objectFit: 'cover',
                    rounded: 'none',
                    class: ['h-full w-full transition-transform duration-500 group-hover:scale-105']
                  }"
                ></bkit-image>
              </div>
              <div class="p-6">
                @if (post.category) {
                  <span [class]="getCategoryClasses()">{{ post.category }}</span>
                }
                <h3 [class]="getTitleClasses()">{{ post.title }}</h3>
                <p [class]="getExcerptClasses()">{{ post.excerpt }}</p>
                <div [class]="getMetaClasses()">
                  <time [attr.datetime]="post.date">{{ post.date }}</time>
                  <span>{{ post.author }}</span>
                </div>
              </div>
            </a>
          </article>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class BlogWithGradientPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: 'default' as const,
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: [
        'relative overflow-hidden',
        ...this.getSectionGradientClasses(),
        ...(this.config?.classes ?? [])
      ] as string[]
    };
  }

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getSectionGradientClasses(): string[] {
    const heroGradient = this.theme.getGradientClass('hero');
    return [heroGradient.split(' ').map(c => '!' + c).join(' ')];
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'indigo-100');
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'From the blog';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Insights and updates from our team.';
  }

  getCategoryClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.secondary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-sm font-semibold text-${primaryBase}-200`;
  }

  getTitleClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-2 font-semibold text-white group-hover:text-${primaryBase}-100 line-clamp-2`;
  }

  getExcerptClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.secondary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-2 text-sm text-${primaryBase}-100 line-clamp-2`;
  }

  getMetaClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.textMutedLight ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-4 flex items-center justify-between text-sm text-${primaryBase}-200`;
  }

  getPosts(): Array<{ title: string; excerpt: string; image: string; date: string; author: string; category?: string; link?: string }> {
    return (this.getData()['posts'] as Array<{ title: string; excerpt: string; image: string; date: string; author: string; category?: string; link?: string }>) || [
      { title: 'Boost your conversion rate', excerpt: 'Illo sint voluptas. Error voluptates culpa eligendi.', image: 'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?w=800&h=500&fit=crop', date: 'Mar 16, 2024', author: 'Michael Foster', category: 'Product' },
      { title: 'Improve your customer experience', excerpt: 'Et tempora quod voluptatem nobis.', image: 'https://images.unsplash.com/photo-1547586696-ea22b4d4238d?w=800&h=500&fit=crop', date: 'Mar 10, 2024', author: 'Lindsay Walton', category: 'Design' },
      { title: 'Building a design system', excerpt: 'Architecto libero natus est.', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=500&fit=crop', date: 'Mar 5, 2024', author: 'Emma Wilson', category: 'Engineering' }
    ];
  }
}
