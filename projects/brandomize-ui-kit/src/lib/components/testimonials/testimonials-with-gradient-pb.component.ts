import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { PSectionComponent } from '@brandomize/primitives/p-section/p-section.component';
import { PStackComponent } from '@brandomize/primitives/p-stack/p-stack.component';
import { PTextComponent } from '@brandomize/primitives/p-text/p-text.component';
import { ThemeService } from '@brandomize/core/theme/theme.service';

@Component({
  selector: 'bkit-testimonials-with-gradient-pb',
  standalone: true,
  imports: [
    CommonModule,
    PSectionComponent,
    PStackComponent,
    PTextComponent
  ],
  template: `
    <bkit-section [config]="getSectionConfig()">
      <div class="absolute inset-0 bg-white/5"></div>
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
      <div class="relative mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
        @for (testimonial of getTestimonials(); track $index) {
          <div class="flex flex-col rounded-2xl bg-white/10 px-8 py-10 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:bg-white/20">
            <blockquote class="flex-1 text-base leading-7 text-white">
              <p>&ldquo;{{ testimonial.quote }}&rdquo;</p>
            </blockquote>
            <figcaption class="mt-6 flex items-center gap-x-4">
              <img [src]="testimonial.avatar" [alt]="testimonial.name" class="h-12 w-12 rounded-full bg-white/20 object-cover ring-2 ring-white/30" />
              <div>
                <div class="font-semibold text-white">{{ testimonial.name }}</div>
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
export class TestimonialsWithGradientPbComponent {
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

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Loved by customers';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'See what our customers have to say.';
  }

  getSubtitleColor(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `${primaryBase}-100`;
  }

  getSectionGradientClasses(): string[] {
    const heroGradient = this.theme.getGradientClass('hero');
    return [heroGradient.split(' ').map(c => '!' + c).join(' ')];
  }

  getRoleClasses(): string {
    const t = this.theme.themeResolved();
    const primary = t.colors?.primary ?? 'indigo-600';
    const primaryBase = primary.split('-')[0];
    return `text-sm text-${primaryBase}-100`;
  }

  getTestimonials(): Array<{ quote: string; name: string; role: string; avatar: string }> {
    return (this.getData()['testimonials'] as Array<{ quote: string; name: string; role: string; avatar: string }>) || [
      { quote: 'This product has completely transformed how we work. The team is more productive than ever.', name: 'Sarah Chen', role: 'CEO, Tech Startup', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
      { quote: "Outstanding support and an incredibly powerful platform. We've seen 3x growth since switching.", name: 'Marcus Johnson', role: 'CTO, ScaleUp Inc', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }
    ];
  }
}
