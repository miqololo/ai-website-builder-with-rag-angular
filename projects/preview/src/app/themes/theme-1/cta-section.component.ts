import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { ScrollAnimateDirective } from './scroll-animate.directive';

@Component({
  selector: 'theme1-cta-section',
  standalone: true,
  imports: [CommonModule, ScrollAnimateDirective],
  template: `
    <section class="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      <!-- Background Gradient -->
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
      
      <!-- Pattern Overlay -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center" theme1ScrollAnimate>
          <!-- Badge -->
          <div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white mb-6">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            {{ getBadge() }}
          </div>

          <!-- Heading -->
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {{ getTitle() }}
          </h2>

          <!-- Description -->
          <p class="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            {{ getDescription() }}
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              [href]="getPrimaryCtaUrl()"
              class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-blue-600 bg-white rounded-lg shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              {{ getPrimaryCtaText() }}
              <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </a>
            <a
              [href]="getSecondaryCtaUrl()"
              class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-lg hover:bg-white/20 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
            >
              {{ getSecondaryCtaText() }}
            </a>
          </div>

          <!-- Trust Indicators -->
          <div class="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-white/80">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-sm sm:text-base">No credit card required</span>
            </div>
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-sm sm:text-base">14-day free trial</span>
            </div>
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-sm sm:text-base">Cancel anytime</span>
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
      animation: fade-in-up 0.8s ease-out forwards;
    }
  `]
})
export class CtaSectionComponent {
  @Input() config?: ComponentConfig;

  constructor(public theme: ThemeService) {}

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getBadge(): string {
    return (this.getData()['badge'] as string) || 'Start Learning Today';
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Ready to Start Your Learning Journey?';
  }

  getDescription(): string {
    return (this.getData()['description'] as string) || 'Join thousands of students already learning with us. Start your free trial today and unlock unlimited access to all courses.';
  }

  getPrimaryCtaText(): string {
    return (this.getData()['primaryCtaText'] as string) || 'Start Free Trial';
  }

  getPrimaryCtaUrl(): string {
    return (this.getData()['primaryCtaUrl'] as string) || '#signup';
  }

  getSecondaryCtaText(): string {
    return (this.getData()['secondaryCtaText'] as string) || 'Browse Courses';
  }

  getSecondaryCtaUrl(): string {
    return (this.getData()['secondaryCtaUrl'] as string) || '#courses';
  }
}
