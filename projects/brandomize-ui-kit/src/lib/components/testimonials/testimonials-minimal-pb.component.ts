import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { PAvatarComponent } from '@brandomize/primitives/p-avatar/p-avatar.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-testimonials-minimal-pb',
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
      <div class="mx-auto mt-16 max-w-2xl">
        <div [class]="getDivideClasses()">
          @for (testimonial of getTestimonials(); track $index) {
            <div class="py-12">
              <blockquote>
                <p [class]="getQuoteClasses()">
                  &ldquo;{{ testimonial.quote }}&rdquo;
                </p>
              </blockquote>
              <figcaption class="mt-6 flex items-center gap-x-4">
                <bkit-avatar
                  [config]="{
                    src: testimonial.avatar,
                    alt: testimonial.name,
                    size: 'md',
                    class: ['h-10 w-10 rounded-full object-cover']
                  }"
                ></bkit-avatar>
                <div>
                  <div [class]="getNameClasses()">{{ testimonial.name }}</div>
                  <div [class]="getRoleClasses()">{{ testimonial.role }}</div>
                </div>
              </figcaption>
            </div>
          }
        </div>
      </div>
    </bkit-section>
  `,
  styles: []
})
export class TestimonialsMinimalPbComponent {
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
    return (this.getData()['subtitle'] as string) || 'What our customers say about us.';
  }

  getTitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['titleColor'] as string) ?? (t.colors?.text ?? 'gray-900');
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    return (this.getData()['subtitleColor'] as string) ?? (t.colors?.textMuted ?? 'gray-600');
  }

  getDivideClasses(): string {
    const t = this.theme.themeResolved();
    const border = t.colors?.border ?? 'gray-200';
    const borderMutedDark = t.colors?.borderMutedDark ?? 'gray-700';
    return `divide-y divide-${border} dark:divide-${borderMutedDark}`;
  }

  getQuoteClasses(): string {
    const t = this.theme.themeResolved();
    const text = t.colors?.text ?? 'gray-900';
    return `text-2xl font-medium leading-9 text-${text} dark:text-white`;
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
      { quote: 'This product has changed how we work. Highly recommended.', name: 'Sarah Chen', role: 'CEO, Acme Inc', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
      { quote: 'Outstanding support and intuitive interface.', name: 'Michael Foster', role: 'CTO, TechCo', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face' },
      { quote: 'Best investment we\'ve made for our team.', name: 'Emma Wilson', role: 'Design Lead', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
    ];
  }
}
