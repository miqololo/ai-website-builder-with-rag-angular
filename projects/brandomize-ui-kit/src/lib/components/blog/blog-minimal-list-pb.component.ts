import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PImageComponent } from '@brandomize/primitives/p-image/p-image.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-blog-minimal-list-pb',
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
      <div class="mx-auto mt-16 max-w-2xl">
        <div [class]="getListClasses()">
          @for (post of getPosts(); track $index) {
            <article class="py-10 first:pt-0">
              <a [href]="post.link || '#'" class="group flex gap-6 sm:gap-8">
                @if (post.image) {
                  <div class="h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-32">
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
                }
                <div class="min-w-0 flex-1">
                  <time [class]="getDateClasses()" [attr.datetime]="post.date">{{ post.date }}</time>
                  <h3 [class]="getTitleClasses()">{{ post.title }}</h3>
                  <p [class]="getExcerptClasses()">{{ post.excerpt }}</p>
                  <p [class]="getAuthorClasses()">{{ post.author }}</p>
                </div>
                <svg [class]="getArrowClasses()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </article>
          }
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class BlogMinimalListPbComponent {
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

  getListClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `divide-y divide-${border} dark:divide-${borderMutedDark}`;
  }

  getDateClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `block text-sm font-medium text-${textMutedLight} dark:text-gray-400`;
  }

  getTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `mt-1 text-lg font-semibold text-${text} dark:text-white group-hover:text-${primary} dark:group-hover:text-${primaryBase}-400`;
  }

  getExcerptClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-sm text-${textMuted} dark:text-gray-300 line-clamp-2`;
  }

  getAuthorClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `mt-2 text-sm text-${textMutedLight} dark:text-gray-400`;
  }

  getArrowClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-400';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `h-5 w-5 flex-shrink-0 text-${textMutedLight} transition-colors group-hover:text-${primary} dark:group-hover:text-${primaryBase}-400`;
  }

  getPosts(): Array<{ title: string; excerpt: string; image?: string; date: string; author: string; category?: string; link?: string }> {
    return (this.getData()['posts'] as Array<{ title: string; excerpt: string; image?: string; date: string; author: string; category?: string; link?: string }>) || [
      { title: 'Boost your conversion rate', excerpt: 'Illo sint voluptas. Error voluptates culpa eligendi.', image: 'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?w=400&h=300&fit=crop', date: 'Mar 16, 2024', author: 'Michael Foster' },
      { title: 'Improve your customer experience', excerpt: 'Et tempora quod voluptatem nobis. Ut hic sit explicabo dolorum.', date: 'Mar 10, 2024', author: 'Lindsay Walton' },
      { title: 'Building a design system', excerpt: 'Architecto libero natus est. Est quam debitis officia enim atque.', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop', date: 'Mar 5, 2024', author: 'Emma Wilson' }
    ];
  }
}
