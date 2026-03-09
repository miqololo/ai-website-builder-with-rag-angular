import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentConfig } from '@brandomize/core/types/component-config.types';
import { ThemeService } from '@brandomize/core/theme/theme.service';
import { ScrollAnimateDirective } from './scroll-animate.directive';

@Component({
  selector: 'theme1-hero-educational',
  standalone: true,
  imports: [CommonModule, ScrollAnimateDirective],
  template: `
    <section class="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div class="text-center">
          <!-- Badge -->
          <div class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mb-8">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            {{ getBadge() }}
          </div>

          <!-- Main heading -->
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 animate-fade-in-up">
            <span class="block">{{ getTitle() }}</span>
            <span class="block mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {{ getTitleHighlight() }}
            </span>
          </h1>

          <!-- Subtitle -->
          <p class="mt-6 text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style="animation-delay: 0.1s">
            {{ getSubtitle() }}
          </p>

          <!-- CTA Buttons -->
          <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              [href]="getPrimaryCtaUrl()"
              class="hero-primary-btn inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-lg shadow-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 relative overflow-hidden group"
              (mouseenter)="onButtonHover($event)"
              (mouseleave)="onButtonLeave($event)"
            >
              <span class="relative z-10 flex items-center">
                {{ getPrimaryCtaText() }}
                <svg class="ml-2 w-5 h-5 arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
              <span class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
            </a>
            <a
              [href]="getSecondaryCtaUrl()"
              class="hero-secondary-btn inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-600 dark:hover:border-purple-600 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              {{ getSecondaryCtaText() }}
            </a>
          </div>

          <!-- Stats -->
          <div class="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div *ngFor="let stat of getStats(); let i = index" theme1ScrollAnimate class="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-800/50" [style.animation-delay.s]="0.3 + (i * 0.1)">
              <div class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">{{ stat.value }}</div>
              <div class="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    @keyframes blob {
      0%, 100% {
        transform: translate(0px, 0px) scale(1);
      }
      33% {
        transform: translate(30px, -50px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
    }
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
    @keyframes slide-in-right {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes slide-in-left {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7), 0 0 20px rgba(99, 102, 241, 0.3);
      }
      50% {
        box-shadow: 0 0 0 10px rgba(99, 102, 241, 0), 0 0 30px rgba(139, 92, 246, 0.5);
      }
    }
    @keyframes arrow-slide {
      0% {
        transform: translateX(0);
      }
      50% {
        transform: translateX(4px);
      }
      100% {
        transform: translateX(0);
      }
    }
    @keyframes gradient-shift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    @keyframes fade-out-in {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0;
        transform: scale(0.95);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
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
    .hero-primary-btn {
      animation: slide-in-right 0.6s ease-out 0.3s both, pulse-glow 2s ease-in-out 1s infinite;
      background-size: 200% 200%;
      transition: all 0.3s ease-in-out, transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
      animation-fill-mode: both;
    }
    .hero-primary-btn:hover {
      animation: pulse-glow 1s ease-in-out infinite, gradient-shift 3s ease infinite;
      transition: all 0.3s ease-in-out, transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    }
    .hero-primary-btn.fade-out-in {
      animation: fade-out-in 0.6s ease-in-out;
    }
    .hero-primary-btn .arrow-icon {
      animation: arrow-slide 1.5s ease-in-out infinite;
      animation-delay: 0.5s;
      transition: transform 0.3s ease-in-out;
    }
    .hero-primary-btn:hover .arrow-icon {
      animation: arrow-slide 0.6s ease-in-out infinite;
      transition: transform 0.3s ease-in-out;
    }
    .hero-secondary-btn {
      animation: slide-in-left 0.6s ease-out 0.4s both;
    }
  `]
})
export class HeroEducationalComponent {
  @Input() config?: ComponentConfig;
  private hasBeenHovered = false;

  constructor(public theme: ThemeService) {}

  onButtonHover(event: Event): void {
    const button = event.target as HTMLElement;
    button.classList.remove('fade-out-in');
  }

  onButtonLeave(event: Event): void {
    const button = event.target as HTMLElement;
    if (!this.hasBeenHovered) {
      this.hasBeenHovered = true;
    }
    button.classList.add('fade-out-in');
    setTimeout(() => {
      button.classList.remove('fade-out-in');
    }, 600);
  }

  private getData(): Record<string, unknown> {
    return this.config?.data ?? {};
  }

  getBadge(): string {
    return (this.getData()['badge'] as string) || 'Start Learning Today';
  }

  getTitle(): string {
    return (this.getData()['title'] as string) || 'Transform Your Future with';
  }

  getTitleHighlight(): string {
    return (this.getData()['titleHighlight'] as string) || 'Expert-Led Courses';
  }

  getSubtitle(): string {
    return (this.getData()['subtitle'] as string) || 'Join thousands of students learning new skills and advancing their careers with our comprehensive online courses.';
  }

  getPrimaryCtaText(): string {
    return (this.getData()['primaryCtaText'] as string) || 'Browse Courses';
  }

  getPrimaryCtaUrl(): string {
    return (this.getData()['primaryCtaUrl'] as string) || '#courses';
  }

  getSecondaryCtaText(): string {
    return (this.getData()['secondaryCtaText'] as string) || 'Watch Demo';
  }

  getSecondaryCtaUrl(): string {
    return (this.getData()['secondaryCtaUrl'] as string) || '#demo';
  }

  getStats(): Array<{ value: string; label: string }> {
    return (this.getData()['stats'] as Array<{ value: string; label: string }>) || [
      { value: '10K+', label: 'Active Students' },
      { value: '500+', label: 'Expert Instructors' },
      { value: '100+', label: 'Courses Available' }
    ];
  }
}
