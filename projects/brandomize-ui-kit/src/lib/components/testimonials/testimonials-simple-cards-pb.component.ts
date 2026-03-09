import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PAvatarComponent } from '@brandomize/primitives/p-avatar/p-avatar.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-testimonials-simple-cards-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent,
    PAvatarComponent
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
        @for (testimonial of getTestimonials(); track $index) {
          <div [class]="getCardClasses()">
            <blockquote [class]="getQuoteClasses()">
              <p>&ldquo;{{ testimonial.quote }}&rdquo;</p>
            </blockquote>
            <figcaption class="mt-6 flex items-center gap-x-4">
              <bkit-avatar
                [config]="{ src: testimonial.avatar, alt: testimonial.name, size: 'lg', shape: 'circle' }"
              ></bkit-avatar>
              <div>
                <div [class]="getNameClasses()">{{ testimonial.name }}</div>
                <div [class]="getRoleClasses()">{{ testimonial.role }}</div>
              </div>
            </figcaption>
          </div>
        }
      </div>
    </bkit-section>
  `,
  styles: []
})
export class TestimonialsSimpleCardsPbComponent {
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

  getCardClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    const surfaceMuted = t.colors?.surfaceMuted ?? 'gray-50';
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `flex flex-col rounded-2xl border border-${border} bg-${surfaceMuted} p-8 transition-all duration-500 hover:-translate-y-2 hover:border-${primaryBase}-200 hover:shadow-lg dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark} dark:hover:border-${primaryBase}-500/30`;
  }

  getQuoteClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `flex-1 text-base leading-7 text-${textMuted} dark:text-gray-300`;
  }

  getNameClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `font-semibold text-${text} dark:text-white`;
  }

  getRoleClasses(): string {
    const t = this.theme.themeResolved();
    const textMutedLight = t.colors?.textMutedLight ?? 'gray-500';
    return `text-sm text-${textMutedLight} dark:text-gray-400`;
  }

  getTestimonials(): Array<{ quote: string; name: string; role: string; avatar: string }> {
    return (this.getData()['testimonials'] as Array<{ quote: string; name: string; role: string; avatar: string }>) || [
      { quote: 'This product has completely transformed how we work. The team is more productive than ever.', name: 'Sarah Chen', role: 'CEO, Tech Startup', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
      { quote: 'Outstanding support and an incredibly powerful platform. We\'ve seen 3x growth since switching.', name: 'Marcus Johnson', role: 'CTO, ScaleUp Inc', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
      { quote: 'Simple, fast, and reliable. Exactly what we needed for our growing business.', name: 'Emma Wilson', role: 'Product Lead, Design Co', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
    ];
  }
}
