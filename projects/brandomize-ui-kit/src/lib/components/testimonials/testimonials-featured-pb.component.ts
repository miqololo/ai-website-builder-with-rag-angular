import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PImageComponent } from '@brandomize/primitives/p-image/p-image.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-testimonials-featured-pb',
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
      <div class="mx-auto mt-16 max-w-3xl">
        <figure [class]="getFigureClasses()">
          <blockquote [class]="getQuoteClasses()">
            <p>&ldquo;{{ getFeatured().quote }}&rdquo;</p>
          </blockquote>
          <figcaption class="mt-8 flex items-center justify-center gap-x-4">
            <img [src]="getFeatured().avatar" [alt]="getFeatured().name" [class]="getAvatarClasses()" />
            <div class="text-left">
              <div [class]="getNameClasses()">{{ getFeatured().name }}</div>
              <div [class]="getRoleClasses()">{{ getFeatured().role }}</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class TestimonialsFeaturedPbComponent {
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
    return (this.getData()['title'] as string) || 'Loved by customers';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'See what our customers have to say.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getFigureClasses(): string {
    const t = this.theme.themeResolved();
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const text = t.colors?.text ?? 'gray-900';
    const textBase = text.split('-')[0];
    return `rounded-2xl bg-${surfaceMuted} p-10 shadow-lg ring-1 ring-${textBase}-900/5 transition-all duration-500 hover:shadow-xl dark:bg-${surfaceMutedDark} dark:ring-white/10`;
  }

  getQuoteClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-xl font-medium leading-8 text-${text} dark:text-white sm:text-2xl sm:leading-9`;
  }

  getAvatarClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryMuted = t.colors?.primaryMuted ?? 'indigo-100';
    const primaryBase = primary.split('-')[0];
    return `h-14 w-14 rounded-full bg-${primaryMuted} object-cover dark:bg-${primaryBase}-500/20`;
  }

  getNameClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-base font-semibold text-${text} dark:text-white`;
  }

  getRoleClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-sm text-${primary} dark:text-${primaryBase}-400`;
  }

  getFeatured(): { quote: string; name: string; role: string; avatar: string } {
    const testimonials = (this.getData()['testimonials'] as Array<{ quote: string; name: string; role: string; avatar: string }>) || [
      { quote: 'This product has completely transformed how we work. The team is more productive than ever. Outstanding support and an incredibly powerful platform.', name: 'Sarah Chen', role: 'CEO, Tech Startup', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' }
    ];
    return testimonials[0];
  }
}
