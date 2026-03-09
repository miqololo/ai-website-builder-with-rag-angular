import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-testimonials-with-quote-icon-pb',
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
            [config]="{ tag: 'h2', content: getTitle(), size: '3xl', weight: 'bold', align: 'center', color: getTitleColor() }"
          ></bkit-text>
          <bkit-text
            [config]="{ tag: 'p', content: getSubtitle(), size: 'lg', align: 'center', color: getSubtitleColor() }"
          ></bkit-text>
        </bkit-stack>
      </div>
      <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
        @for (testimonial of getTestimonials(); track $index) {
          <div [class]="getCardClasses()">
            <svg [class]="getQuoteIconClasses()" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/>
            </svg>
            <blockquote [class]="getQuoteClasses()">
              <p>{{ testimonial.quote }}</p>
            </blockquote>
            <figcaption class="mt-6 flex items-center gap-x-4">
              <img [src]="testimonial.avatar" [alt]="testimonial.name" [class]="getAvatarClasses()" />
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
export class TestimonialsWithQuoteIconPbComponent {
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
      animateOnScroll: true,
      class: this.config?.classes ?? []
    };
  }

  getHeaderStackConfig() {
    return { gap: 'md' as const, alignItems: 'center' as const, class: [] as string[] };
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Testimonials';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Hear from our customers.';
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
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `flex flex-col rounded-2xl border border-${border}  p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg dark:border-${borderMutedDark} dark:bg-${surfaceMutedDark}`;
  }

  getQuoteIconClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    // Use primaryMuted for dark mode instead of hardcoding -400 shade
    const primaryMuted = t.colors?.primaryMuted ?? 'indigo-50';
    // Extract base color name for dark mode (use a lighter variant that exists in theme)
    const primaryBase = primary.split('-')[0];
    // Use a safe dark mode color that exists in default theme (gray-400 or theme-appropriate)
    const darkColor = t.colors?.textMutedLight ?? 'gray-400';
    return `h-10 w-10 flex-none text-${primary} dark:text-${darkColor}`;
  }

  getQuoteClasses(): string {
    const t = this.theme.themeResolved();
    const textMuted = t.colors?.textMuted ?? 'gray-600';
    return `mt-4 flex-1 text-base leading-7 text-${textMuted} dark:text-gray-300`;
  }

  getAvatarClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryMuted = t.colors?.primaryMuted ?? 'indigo-100';
    // Use a safe dark mode background that exists in theme
    const surfaceMutedDark = t.colors?.surfaceMutedDark ?? 'gray-800';
    return `h-12 w-12 rounded-full bg-${primaryMuted} object-cover dark:bg-${surfaceMutedDark}/50`;
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
      { quote: "Outstanding support and an incredibly powerful platform. We've seen 3x growth since switching.", name: 'Marcus Johnson', role: 'CTO, ScaleUp Inc', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }
    ];
  }
}
