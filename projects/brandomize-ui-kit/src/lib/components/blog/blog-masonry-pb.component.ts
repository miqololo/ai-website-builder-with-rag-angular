import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PImageComponent } from '@brandomize/primitives/p-image/p-image.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-blog-masonry-pb',
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
      <div class="mx-auto mt-16 columns-1 gap-8 sm:mt-20 md:columns-2 lg:columns-3">
        @for (post of getPosts(); track $index) {
          <article class="mb-8 break-inside-avoid">
            <a [href]="post.link || '#'" [class]="getCardClasses()">
              <div class="overflow-hidden">
                <bkit-image
                  [config]="{
                    src: post.image,
                    alt: post.title,
                    objectFit: 'cover',
                    rounded: 'none',
                    class: ['aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-105']
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
export class BlogMasonryPbComponent {
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

  getCardClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `group block overflow-hidden rounded-2xl border border-${border} bg-${surfaceMuted} shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-${primaryBase}-200 hover:shadow-xl dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark} dark:hover:border-${primaryBase}-500/30`;
  }

  getCategoryClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-sm font-semibold text-${primary} dark:text-${primaryBase}-400`;
  }

  getTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-2 font-semibold text-${text} dark:text-white group-hover:text-${primary} dark:group-hover:text-${primaryBase}-400 line-clamp-2`;
  }

  getExcerptClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-sm text-${textMuted} dark:text-gray-300 line-clamp-2`;
  }

  getMetaClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `mt-4 flex items-center justify-between text-sm text-${textMutedLight} dark:text-gray-400`;
  }

  getPosts(): Array<{ title: string; excerpt: string; image: string; date: string; author: string; category?: string; link?: string }> {
    return (this.getData()['posts'] as Array<{ title: string; excerpt: string; image: string; date: string; author: string; category?: string; link?: string }>) || [
      { title: 'Boost your conversion rate', excerpt: 'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo.', image: 'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?w=800&h=500&fit=crop', date: 'Mar 16, 2024', author: 'Michael Foster', category: 'Product' },
      { title: 'Improve your customer experience', excerpt: 'Et tempora quod voluptatem nobis.', image: 'https://images.unsplash.com/photo-1547586696-ea22b4d4238d?w=800&h=500&fit=crop', date: 'Mar 10, 2024', author: 'Lindsay Walton', category: 'Design' },
      { title: 'Building a design system', excerpt: 'Architecto libero natus est. Est quam debitis officia enim atque.', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=500&fit=crop', date: 'Mar 5, 2024', author: 'Emma Wilson', category: 'Engineering' },
      { title: 'Content strategy for growth', excerpt: 'Quaerat quasi aut velit incidunt.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop', date: 'Mar 2, 2024', author: 'Tom Cook', category: 'Marketing' },
      { title: 'Remote work best practices', excerpt: 'Molestias ea earum quos nostrum doloremque sed. Quaerat quasi aut velit.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop', date: 'Feb 28, 2024', author: 'Courtney Henry', category: 'Product' },
      { title: 'Developer productivity tips', excerpt: 'Aut reprehenderit voluptatem eum asperiores beatae id.', image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=500&fit=crop', date: 'Feb 25, 2024', author: 'Leonard Krasner', category: 'Engineering' }
    ];
  }
}
