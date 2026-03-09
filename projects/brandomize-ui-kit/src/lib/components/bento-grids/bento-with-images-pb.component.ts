import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PImageComponent } from '@brandomize/primitives/p-image/p-image.component';
import { PLinkComponent } from '@brandomize/primitives/p-link/p-link.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-bento-with-images-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PImageComponent,
    PLinkComponent
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
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-5 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-6">
        @for (card of getCards(); track $index) {
          <div
            [class]="getCardClasses()"
            [class.lg:col-span-2]="card.span === 2"
            [class.lg:row-span-2]="card.rowSpan === 2"
          >
            @if (card.image) {
              <div class="relative aspect-[16/10] overflow-hidden">
                <bkit-image
                  [config]="{
                    src: card.image,
                    alt: card.title,
                    objectFit: 'cover',
                    rounded: 'none',
                    class: ['h-full w-full transition-transform duration-700 ease-out group-hover:scale-110']
                  }"
                ></bkit-image>
              </div>
            }
            <div class="relative p-8">
              <h3 [class]="getCardTitleClasses()">{{ card.title }}</h3>
              <p [class]="getCardDescriptionClasses()">{{ card.description }}</p>
              @if (card.link) {
                <bkit-link
                  [config]="{ href: card.link, text: 'Learn more →', variant: 'primary', ariaLabel: 'Learn more', class: ['mt-6', 'inline-flex'] }"
                ></bkit-link>
              }
            </div>
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class BentoWithImagesPbComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getSectionConfig() {
    const d = this.getData();
    return {
      background: (d['background'] ?? 'muted') as 'default' | 'muted' | 'white' | 'dark',
      padding: (d['padding'] ?? 'lg') as 'none' | 'sm' | 'md' | 'lg',
      maxWidth: 'full' as const,
      animateOnScroll: true,
      class: this.config?.classes ?? []
    };
  }

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Everything you need';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'All the tools you need to build amazing products.';
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
    const surface = t.colors?.surface ?? 'white';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const surfaceDark = t.colors?.surfaceDark ?? 'gray-900';
    return `group relative overflow-hidden rounded-2xl bg-${surface} shadow-lg ring-1 ring-${surfaceDark}/5 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl dark:bg-${surfaceMutedDark} dark:ring-white/10`;
  }

  getCardTitleClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-lg font-semibold text-${text} dark:text-white`;
  }

  getCardDescriptionClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-2 text-sm leading-6 text-${textMuted} dark:text-slate-400`;
  }

  getCards(): Array<{ title: string; description: string; image?: string; link?: string; span?: number; rowSpan?: number }> {
    return (this.getData()['cards'] as Array<{ title: string; description: string; image?: string; link?: string; span?: number; rowSpan?: number }>) || [
      { title: 'Analytics', description: 'Get insights into your users.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop', link: '#', span: 2 },
      { title: 'Integrations', description: 'Connect with your favorite tools.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop', link: '#' },
      { title: 'Security', description: 'Enterprise-grade security.', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop', link: '#', rowSpan: 2 }
    ];
  }
}
