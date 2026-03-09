import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { ScrollAnimateDirective } from './scroll-animate.directive';

@Component({
  selector: 'theme1-testimonials',
  standalone: true,
  imports: [CommonModule, ScrollAnimateDirective],
  template: `
    <section class="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12 sm:mb-16" theme1ScrollAnimate>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {{ getTitle() }}
          </h2>
          <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {{ getSubtitle() }}
          </p>
        </div>

        <!-- Testimonials Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div
            *ngFor="let testimonial of getTestimonials(); let i = index"
            theme1ScrollAnimate
            class="bg-gray-50 dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            [style.animation-delay.ms]="i * 100"
          >
            <!-- Quote Icon -->
            <div class="mb-4">
              <svg class="w-10 h-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z"></path>
              </svg>
            </div>

            <!-- Testimonial Text -->
            <blockquote class="text-gray-700 dark:text-gray-300 mb-6 text-base sm:text-lg leading-relaxed">
              "{{ testimonial.quote }}"
            </blockquote>

            <!-- Author Info -->
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img
                  [src]="testimonial.avatar"
                  [alt]="testimonial.name"
                  class="w-full h-full object-cover"
                  (error)="handleImageError($event, testimonial.name)"
                />
              </div>
              <div class="ml-4">
                <div class="font-semibold text-gray-900 dark:text-white">
                  {{ testimonial.name }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ testimonial.role }}
                </div>
                <!-- Rating -->
                <div class="flex items-center mt-1">
                  <div class="flex text-yellow-400">
                    <svg *ngFor="let star of [1,2,3,4,5]" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    [theme1ScrollAnimate] {
      opacity: 0;
      transform: translateY(30px);
    }
    .scroll-animate-hidden {
      opacity: 0 !important;
      transform: translateY(30px) !important;
    }
    .scroll-animate-visible {
      animation: fade-in-up 0.6s ease-out forwards;
    }
  `]
})
export class TestimonialsComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'What Our Students Say';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Join thousands of satisfied learners who have transformed their careers';
  }

  handleImageError(event: Event, name: string): void {
    const img = event.target as HTMLImageElement;
    if (img && img.parentElement) {
      img.parentElement.innerHTML = `<span class="text-white text-sm font-semibold">${name.charAt(0)}</span>`;
    }
  }

  getTestimonials(): Array<{
    name: string;
    role: string;
    quote: string;
    avatar: string;
  }> {
    return (this.getData()['testimonials'] as Array<any>) || [
      {
        name: 'Alexandra Martinez',
        role: 'Software Engineer',
        quote: 'The courses here completely changed my career trajectory. The instructors are knowledgeable and the content is practical. I landed my dream job within 3 months!',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
      },
      {
        name: 'James Wilson',
        role: 'Data Analyst',
        quote: 'Best investment I\'ve made in my education. The data science course was comprehensive and the projects were real-world applicable. Highly recommend!',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      {
        name: 'Priya Patel',
        role: 'UX Designer',
        quote: 'As someone switching careers, I was nervous. But the step-by-step approach and supportive community made all the difference. Now I\'m working at a top design agency.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      }
    ];
  }
}
