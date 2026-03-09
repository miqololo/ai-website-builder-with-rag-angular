import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PImageComponent } from '@brandomize/primitives/p-image/p-image.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-blog-featured-grid-pb',
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
      <div class="mx-auto max-w-2xl text-center">
        <bkit-stack [config]="getHeaderStackConfig()">
          <bkit-text
            [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', align: 'center', color: getTitleColor() }"
          ></bkit-text>
          <bkit-text
            [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', align: 'center', color: getSubtitleColor() }"
          ></bkit-text>
        </bkit-stack>
      </div>
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
        <article class="col-span-1 lg:col-span-2">
          <a [href]="getFeatured().link || '#'" [class]="getFeaturedCardClasses()">
            <div class="aspect-[16/10] overflow-hidden">
              <bkit-image
                [config]="{
                  src: getFeatured().image,
                  alt: getFeatured().title,
                  objectFit: 'cover',
                  rounded: 'none',
                  class: ['h-full w-full transition-transform duration-500 group-hover:scale-105']
                }"
              ></bkit-image>
            </div>
            <div class="p-6 sm:p-8">
              @if (getFeatured().category) {
                <span [class]="getCategoryClasses()">{{ getFeatured().category }}</span>
              }
              <h3 [class]="getTitleClasses()">{{ getFeatured().title }}</h3>
              <p [class]="getExcerptClasses()">{{ getFeatured().excerpt }}</p>
              <div [class]="getMetaClasses()">
                <time [attr.datetime]="getFeatured().date">{{ getFeatured().date }}</time>
                <span>{{ getFeatured().author }}</span>
              </div>
            </div>
          </a>
        </article>
        <div class="col-span-1 flex flex-col gap-8">
          @for (post of getSecondaryPosts(); track $index) {
            <article>
              <a [href]="post.link || '#'" class="group flex gap-4">
                <div class="h-24 w-28 flex-shrink-0 overflow-hidden rounded-lg">
                  <bkit-image
                    [config]="{
                      src: post.image,
                      alt: post.title,
                      objectFit: 'cover',
                      rounded: 'lg',
                      class: ['h-full w-full transition-transform duration-300 group-hover:scale-105']
                    }"
                  ></bkit-image>
                </div>
                <div class="min-w-0 flex-1">
                  @if (post.category) {
                    <span [class]="getSecondaryCategoryClasses()">{{ post.category }}</span>
                  }
                  <h4 [class]="getSecondaryTitleClasses()">{{ post.title }}</h4>
                  <time [class]="getDateClasses()" [attr.datetime]="post.date">{{ post.date }}</time>
                </div>
              </a>
            </article>
          }
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class BlogFeaturedGridPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'white') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      animateOnScroll: true,
      class: this.config?.classes ?? []
    };
  }

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'From the blog';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Insights and updates from our team.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getFeatured(): { title: string; excerpt: string; image: string; date: string; author: string; category?: string; link?: string } {
    const posts = this.getPosts();
    return (this.getData()['featured'] as { title: string; excerpt: string; image: string; date: string; author: string; category?: string; link?: string }) ?? posts[0];
  }

  getSecondaryPosts(): Array<{ title: string; excerpt: string; image: string; date: string; author: string; category?: string; link?: string }> {
    return this.getPosts().slice(1, 4);
  }

  getFeaturedCardClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-100';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `group block overflow-hidden rounded-2xl bg-${surfaceMuted} transition-all duration-500 hover:shadow-xl dark:bg-${surfaceMutedDark}`;
  }

  getCategoryClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-sm font-semibold uppercase tracking-wider text-${primary} dark:text-${primaryBase}-400`;
  }

  getSecondaryCategoryClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-xs font-semibold uppercase tracking-wider text-${primary} dark:text-${primaryBase}-400`;
  }

  getTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-2 text-2xl font-bold text-${text} dark:text-white group-hover:text-${primary} dark:group-hover:text-${primaryBase}-400`;
  }

  getExcerptClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-3 text-${textMuted} dark:text-gray-300 line-clamp-2`;
  }

  getMetaClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `mt-4 flex items-center gap-4 text-sm text-${textMutedLight} dark:text-gray-400`;
  }

  getSecondaryTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-1 font-semibold text-${text} dark:text-white group-hover:text-${primary} dark:group-hover:text-${primaryBase}-400 line-clamp-2`;
  }

  getDateClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `mt-1 block text-sm text-${textMutedLight} dark:text-gray-400`;
  }

  getPosts(): Array<{ title: string; excerpt: string; image: string; date: string; author: string; category?: string; link?: string }> {
    return (this.getData()['posts'] as Array<{ title: string; excerpt: string; image: string; date: string; author: string; category?: string; link?: string }>) || [
      { title: 'Boost your conversion rate', excerpt: 'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo.', image: 'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?w=800&h=500&fit=crop', date: 'Mar 16, 2024', author: 'Michael Foster', category: 'Product' },
      { title: 'Improve your customer experience', excerpt: 'Et tempora quod voluptatem nobis. Ut hic sit explicabo dolorum.', image: 'https://images.unsplash.com/photo-1547586696-ea22b4d4238d?w=400&h=300&fit=crop', date: 'Mar 10, 2024', author: 'Lindsay Walton', category: 'Design' },
      { title: 'Building a design system', excerpt: 'Architecto libero natus est. Est quam debitis officia enim atque.', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop', date: 'Mar 5, 2024', author: 'Emma Wilson', category: 'Engineering' }
    ];
  }
}
